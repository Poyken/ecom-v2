import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import type { AdjustInventoryDto, CreateWarehouseDto, UpdateWarehouseDto } from '@ecommerce/shared';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  private get tenantId() {
    return this.cls.get('tenantId');
  }

  // --- WAREHOUSE OPERATIONS ---

  async createWarehouse(dto: CreateWarehouseDto) {
      if (dto.isDefault) {
          // Unset other defaults
          await this.prisma.warehouse.updateMany({
              where: { tenantId: this.tenantId, isDefault: true },
              data: { isDefault: false }
          });
      }

      return this.prisma.warehouse.create({
          data: {
              ...dto,
              tenantId: this.tenantId,
          }
      });
  }

  async findAllWarehouses() {
      return this.prisma.warehouse.findMany({
          where: { tenantId: this.tenantId }
      });
  }

  async findDefaultWarehouse(tx?: any) {
      const client = tx || this.prisma;
      let warehouse = await client.warehouse.findFirst({
          where: { tenantId: this.tenantId, isDefault: true }
      });

      if (!warehouse) {
          // If no default, pick any or create one?
          // For safety, let's create a default one if none exists
           warehouse = await client.warehouse.findFirst({
              where: { tenantId: this.tenantId }
           });
           
           if (!warehouse) {
               warehouse = await client.warehouse.create({
                   data: {
                       tenantId: this.tenantId,
                       name: 'Default Warehouse',
                       isDefault: true
                   }
               });
           }
      }
      return warehouse;
  }

  // --- INVENTORY OPERATIONS ---

  async getAvailableStock(skuId: string) {
      // Return total stock across all warehouses (from Sku.stock cache or recalc?)
      // We rely on Sku.stock being the aggregate cache.
      const sku = await this.prisma.sku.findUnique({
          where: { id: skuId, tenantId: this.tenantId }
      });
      if (!sku) throw new NotFoundException('SKU not found');
      return sku.stock;
  }
  
  async getInventoryItems(skuId: string) {
      return this.prisma.inventoryItem.findMany({
          where: { skuId, tenantId: this.tenantId },
          include: { warehouse: true }
      });
  }

  /**
   * Main method to change stock.
   * Handles: InventoryItem update + InventoryLog + Sku.stock sync + Transaction
   */
  async adjustStock(
      skuId: string, 
      adjustDto: AdjustInventoryDto,
      externalTx?: any 
  ) {
    const { quantity, type, reason, warehouseId } = adjustDto;
    
    // Use provided transaction or start a new one
    const action = async (tx: any) => {
        // 1. Resolve Warehouse
        let targetWarehouseId = warehouseId;
        if (!targetWarehouseId) {
            const defaultWh = await this.findDefaultWarehouse(tx);
            targetWarehouseId = defaultWh.id;
        }

        // 2. Get/Create Inventory Item
        let inventoryItem = await tx.inventoryItem.findUnique({
            where: {
                warehouseId_skuId: {
                    warehouseId: targetWarehouseId,
                    skuId
                }
            }
        });

        if (!inventoryItem) {
            inventoryItem = await tx.inventoryItem.create({
                data: {
                    tenantId: this.tenantId,
                    warehouseId: targetWarehouseId,
                    skuId,
                    quantity: 0
                }
            });
        }

        // 3. Validate Logic (e.g. Cannot reduce below 0 for SALE?)
        const newQuantity = inventoryItem.quantity + quantity;
        if (newQuantity < 0 && (type === 'SALE' || type === 'EXPORT')) {
             throw new BadRequestException(`Insufficient stock in warehouse ${targetWarehouseId}. Current: ${inventoryItem.quantity}, Request: ${quantity}`);
        }

        // 4. Update InventoryItem
        await tx.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: { quantity: newQuantity }
        });

        // 5. Create Log (Schema: changeAmount, previousStock, newStock, reason)
        await tx.inventoryLog.create({
            data: {
                tenantId: this.tenantId,
                skuId,
                changeAmount: quantity,
                previousStock: inventoryItem.quantity - quantity, // Before this adjustment
                newStock: newQuantity,
                reason: reason || type,
                userId: this.cls.get('user')?.id,
            }
        });

        // 6. Sync Sku.stock (Aggregate)
        // We can do an increment/decrement on Sku directly.
        await tx.sku.update({
            where: { id: skuId },
            data: {
                stock: { increment: quantity }
            }
        });

        return { newStock: newQuantity, warehouseId: targetWarehouseId };
    };

    if (externalTx) {
        return action(externalTx);
    } else {
        return this.prisma.$transaction(action);
    }
  }
}
