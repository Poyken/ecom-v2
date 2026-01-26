import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { tenantStorage } from '../../common/tenant/tenant.storage';
import { CreateWarehouseDto, UpdateStockDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  private getTenantId(): string {
    const context = tenantStorage.getStore();
    const tenantId = context?.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is missing in context');
    }
    return tenantId;
  }

  // --- Warehouse Management ---
  async createWarehouse(dto: CreateWarehouseDto) {
    const tenantId = this.getTenantId();

    const existing = await this.prisma.warehouse.findUnique({
      where: {
        tenantId_code: { tenantId, code: dto.code },
      },
    });

    if (existing) {
      throw new ConflictException('Warehouse code already exists');
    }

    return this.prisma.warehouse.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async findAllWarehouses() {
    const tenantId = this.getTenantId();
    return this.prisma.warehouse.findMany({
      where: { tenantId, isActive: true },
    });
  }

  // --- Stock Management ---
  async updateStock(dto: UpdateStockDto) {
    const tenantId = this.getTenantId();

    return this.prisma.inventoryItem.upsert({
      where: {
        skuId_warehouseId: {
          skuId: dto.skuId,
          warehouseId: dto.warehouseId,
        },
      },
      update: {
        quantity: dto.quantity,
        reorderPoint: dto.reorderPoint,
      },
      create: {
        skuId: dto.skuId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
        reorderPoint: dto.reorderPoint ?? 0,
        tenantId,
      },
    });
  }

  async getInventorySnapshot() {
    const tenantId = this.getTenantId();
    return this.prisma.inventoryItem.findMany({
      where: { tenantId },
      include: {
        sku: {
          include: { product: true },
        },
        warehouse: true,
      },
    });
  }
}
