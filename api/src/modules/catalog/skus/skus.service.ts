import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import type { CreateSkuDto, UpdateSkuDto } from '@ecommerce/shared';

import { InventoryService } from '../../inventory/inventory.service';

@Injectable()
export class SkusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
    private readonly inventoryService: InventoryService,
  ) {}

  private get tenantId() {
    return this.cls.get('TENANT_ID');
  }

  async create(createSkuDto: CreateSkuDto) {
    const { productId, optionValues, skuCode, ...rest } = createSkuDto;

    // Check if duplicate SKU exists in Tenant
    const existing = await this.prisma.sku.findUnique({
        where: { tenantId_skuCode: { tenantId: this.tenantId, skuCode } }
    });
    if (existing) {
        throw new BadRequestException(`SKU code '${skuCode}' already exists`);
    }

    // Verify Product exists
    const product = await this.prisma.product.findUnique({ where: { id: productId, tenantId: this.tenantId } });
    if (!product) throw new NotFoundException('Product not found');

    // Resolve Option Values
    const resolvedOptionValueIds: string[] = [];
    if (optionValues && optionValues.length > 0) {
        for (const ov of optionValues) {
            // Find OptionValue
            const optionValue = await this.prisma.optionValue.findFirst({
                where: {
                    value: ov.value,
                    tenantId: this.tenantId,
                    option: {
                        productId: productId,
                        name: ov.optionName
                    }
                }
            });

            if (!optionValue) {
               throw new BadRequestException(`Option Value '${ov.value}' for Option '${ov.optionName}' not found in Product`); 
               // Start-up strategy: require Options to be created first in Product
            }
            resolvedOptionValueIds.push(optionValue.id);
        }
    }

    // 5. Create SKU with 0 stock initially
    const newSku = await this.prisma.sku.create({
        data: {
            ...rest,
            skuCode,
            productId,
            stock: 0, // Always 0, initialized via Inventory Log
            tenantId: this.tenantId,
            optionValues: {
                create: resolvedOptionValueIds.map(ovId => ({
                    optionValueId: ovId,
                    tenantId: this.tenantId
                }))
            }
        }
    });

    // 6. Import Initial Stock if provided
    if (rest.stock && rest.stock > 0) {
        await this.inventoryService.adjustStock(newSku.id, {
            quantity: rest.stock,
            type: 'IMPORT',
            reason: 'Initial Import on SKU Create'
        });
    }

    return newSku;
  }

  async findAll() {
    return this.prisma.sku.findMany({
      where: { tenantId: this.tenantId },
       include: { product: true, optionValues: { include: { optionValue: true } } },
       orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
     const sku = await this.prisma.sku.findUnique({
      where: { id, tenantId: this.tenantId },
       include: { product: true, optionValues: { include: { optionValue: true } } },
    });
    if (!sku) throw new NotFoundException('SKU not found');
    return sku;
  }

  async update(id: string, updateSkuDto: UpdateSkuDto) {
    const { optionValues, ...rest } = updateSkuDto;
    
    // Check if SKU exists
    const sku = await this.findOne(id);

    // If optionValues handling is needed for update, it's complex (re-link).
    // For now, only update fields like price, stock, images.
    // If SKU Code is updated? Typescript Omit said "UpdateSkuSchema omitted skuCode".
    // So safe.
    
    return this.prisma.sku.update({
        where: { id },
        data: {
            ...rest
        }
    });
  }

  async remove(id: string) {
     return this.prisma.sku.update({
        where: { id, tenantId: this.tenantId },
        data: { status: 'INACTIVE' } // SKU doesn't have deletedAt, has Status.
        // Wait, schema check.
        // Sku model lines 390-424.
        // 397: status String @default("INACTIVE").
        // No deletedAt.
        // So I set status to INACTIVE.
    });
  }
}
