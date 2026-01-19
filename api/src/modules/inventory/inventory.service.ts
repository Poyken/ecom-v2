import { Injectable, BadRequestException, NotFoundException, Inject, Scope } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AdjustInventoryDto, CreateWarehouseDto } from '@ecommerce/shared';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class InventoryService {
  private tenantId: string;

  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private request: any
  ) {
    this.tenantId = this.request.user?.tenantId;
  }

  get currentTenantId() {
    return this.tenantId;
  }


  /**
   * Resolve default warehouse for the tenant
   */
  async findDefaultWarehouse(tx?: any) {
    const prisma = tx || this.prisma;
    const warehouse = await prisma.warehouse.findFirst({
        where: { tenantId: this.tenantId, isDefault: true }
    });
    if (!warehouse) throw new NotFoundException('Default warehouse not found');
    return warehouse;
  }

  /**
   * Get available stock for a specific SKU (Global aggregate)
   */
  async getAvailableStock(skuId: string) {
    const sku = await this.prisma.sku.findUnique({
      where: { id: skuId },
      select: { stock: true }
    });
    if (!sku) throw new NotFoundException('SKU not found');
    return sku.stock;
  }

  /**
   * Warehouse Management
   */
  async createWarehouse(dto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({
      data: {
        ...dto,
        tenantId: this.tenantId,
      },
    });
  }

  async findAllWarehouses() {
    return this.prisma.warehouse.findMany({
      where: { tenantId: this.tenantId },
    });
  }

  async findWarehouse(id: string) {
    return this.prisma.warehouse.findUnique({
      where: { id, tenantId: this.tenantId }
    });
  }


  async getWarehouseStock(warehouseId: string) {
    return this.prisma.inventoryItem.findMany({
      where: { warehouseId, tenantId: this.tenantId },
      include: {
        sku: {
          include: {
            product: true,
            optionValues: {
              include: { optionValue: true }
            }
          }
        }
      }
    });
  }

  async getWarehouseLogs(warehouseId: string) {
    // InventoryLog is SKU-centric in our schema, but we can filter by warehouse via InventoryItem 
    // Wait, the schema shows InventoryLog is linked to SKU and doesn't have a warehouseId property.
    // This is a design decision we made: Logs are global per SKU.
    // However, for a warehouse view, we might want to see logs that affected THIS warehouse.
    // Let's check if we should add warehouseId to InventoryLog.
    // YES, it makes sense to add warehouseId to InventoryLog for better traceability.
    
    return this.prisma.inventoryLog.findMany({
      where: { 
        tenantId: this.tenantId,
        sku: {
          inventoryItems: {
            some: { warehouseId }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sku: { include: { product: true } },
        user: { select: { firstName: true, lastName: true, email: true } }
      },

      take: 50
    });
  }


  /**
   * Adjusts stock level for a SKU in a specific warehouse.
   */
  async adjustStock(skuId: string, adjustDto: AdjustInventoryDto, externalTx?: any) {
    const { quantity, type, reason, warehouseId } = adjustDto;
    
    const action = async (tx: any) => {
        let targetWarehouseId = warehouseId;
        if (!targetWarehouseId) {
            const defaultWh = await this.findDefaultWarehouse(tx);
            targetWarehouseId = defaultWh.id;
        }

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

        const newQuantity = inventoryItem.quantity + quantity;
        if (newQuantity < 0 && (type === 'SALE' || type === 'EXPORT')) {
             throw new BadRequestException(`Insufficient stock in warehouse ${targetWarehouseId}.`);
        }

        await tx.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: { quantity: newQuantity }
        });

        const sku = await tx.sku.findUnique({
            where: { id: skuId },
            select: { stock: true }
        });
        const previousGlobalStock = sku?.stock || 0;
        const newGlobalStock = previousGlobalStock + quantity;

        await tx.inventoryLog.create({
            data: {
                skuId,
                type,
                changeAmount: quantity,
                previousStock: previousGlobalStock,
                newStock: newGlobalStock,
                reason: reason || `Inventory ${type}`,
                tenantId: this.tenantId,
                userId: this.request.user?.id
            }
        });

        await tx.sku.update({
            where: { id: skuId },
            data: { stock: newGlobalStock }
        });

        return { newStock: newQuantity, warehouseId: targetWarehouseId };
    };

    if (externalTx) {
        return action(externalTx);
    } else {
        return this.prisma.$transaction(action);
    }
  }

  /**
   * Transfers stock from one warehouse to another for a specific SKU.
   */
  async transferStock(
    skuId: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    quantity: number,
    reason?: string
  ) {
    if (quantity <= 0) throw new BadRequestException('Transfer quantity must be positive');
    if (fromWarehouseId === toWarehouseId) throw new BadRequestException('Source and destination warehouses must be different');

    return this.prisma.$transaction(async (tx: any) => {
        const fromItem = await tx.inventoryItem.findUnique({
            where: { warehouseId_skuId: { warehouseId: fromWarehouseId, skuId } }
        });

        if (!fromItem || fromItem.quantity < quantity) {
            throw new BadRequestException(`Insufficient stock in source warehouse.`);
        }

        await tx.inventoryItem.update({
            where: { id: fromItem.id },
            data: { quantity: { decrement: quantity } }
        });

        let toItem = await tx.inventoryItem.findUnique({
            where: { warehouseId_skuId: { warehouseId: toWarehouseId, skuId } }
        });

        if (!toItem) {
            await tx.inventoryItem.create({
                data: {
                    tenantId: this.tenantId,
                    warehouseId: toWarehouseId,
                    skuId,
                    quantity: quantity
                }
            });
        } else {
            await tx.inventoryItem.update({
                where: { id: toItem.id },
                data: { quantity: { increment: quantity } }
            });
        }

        const currentSku = await tx.sku.findUnique({ where: { id: skuId }, select: { stock: true } });

        await tx.inventoryLog.create({
            data: {
                skuId,
                type: 'TRANSFER',
                changeAmount: 0,
                previousStock: currentSku.stock,
                newStock: currentSku.stock,
                reason: reason || `Transfer from ${fromWarehouseId} to ${toWarehouseId}`,
                tenantId: this.tenantId,
                userId: this.request.user?.id
            }
        });

        return { success: true };
    });
  }
}
