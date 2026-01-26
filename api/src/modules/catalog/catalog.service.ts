import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { tenantStorage } from '../../common/tenant/tenant.storage';
import { CreateCategoryDto, CreateProductDto } from './dto/catalog.dto';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  private getTenantId(): string {
    const context = tenantStorage.getStore();
    const tenantId = context?.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is missing in context');
    }
    return tenantId;
  }

  // --- Category Logic ---
  async createCategory(dto: CreateCategoryDto) {
    const tenantId = this.getTenantId();
    const existing = await this.prisma.category.findUnique({
      where: { tenantId_slug: { tenantId, slug: dto.slug } },
    });

    if (existing) {
      throw new ConflictException('Category slug already exists');
    }

    return this.prisma.category.create({
      data: { ...dto, tenantId },
    });
  }

  async findAllCategories() {
    const tenantId = this.getTenantId();
    return this.prisma.category.findMany({
      where: { tenantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // --- Product Logic (Matrix Logic) ---
  async createProduct(dto: CreateProductDto) {
    const tenantId = this.getTenantId();
    const { options, skus, ...productData } = dto;

    const existing = await this.prisma.product.findUnique({
      where: { tenantId_slug: { tenantId, slug: dto.slug } },
    });

    if (existing) {
      throw new ConflictException('Product slug already exists');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create Product with Options and Values
      const product = await tx.product.create({
        data: {
          ...productData,
          tenantId,
          options: {
            create: options.map((opt) => ({
              name: opt.name,
              tenantId,
              values: {
                create: opt.values.map((v) => ({
                  value: v.value,
                  displayName: v.displayName,
                  tenantId,
                })),
              },
            })),
          },
        },
        include: {
          options: {
            include: { values: true },
          },
        },
      });

      // 2. Map OptionValue strings to IDs for SKU creation
      const valueMap = new Map<string, string>(); // "OptionName:Value" -> ID
      product.options.forEach((opt) => {
        opt.values.forEach((val) => {
          valueMap.set(`${opt.name}:${val.value}`, val.id);
        });
      });

      // 3. Create SKUs and link them to OptionValues via SkuValue
      for (const skuDto of skus) {
        const sku = await tx.sku.create({
          data: {
            sku: skuDto.sku,
            price: skuDto.price,
            comparePrice: skuDto.comparePrice,
            stock: skuDto.stock,
            tenantId,
            productId: product.id,
          },
        });

        // Link SKU to its specific option values
        for (const ov of skuDto.optionValues) {
          const optionValueId = valueMap.get(`${ov.optionName}:${ov.value}`);
          if (!optionValueId) {
            throw new NotFoundException(
              `Option value ${ov.optionName}:${ov.value} not found`,
            );
          }

          await tx.skuValue.create({
            data: {
              tenantId,
              skuId: sku.id,
              optionValueId,
            },
          });
        }
      }

      return this.findProductBySlug(product.slug);
    });
  }

  async findAllProducts() {
    const tenantId = this.getTenantId();
    return this.prisma.product.findMany({
      where: { tenantId, isActive: true },
      include: {
        category: true,
        skus: {
          include: {
            skuValues: {
              include: {
                optionValue: {
                  include: { option: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async findProductBySlug(slug: string) {
    const tenantId = this.getTenantId();
    const product = await this.prisma.product.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
      include: {
        category: true,
        options: {
          include: { values: true },
        },
        skus: {
          include: {
            skuValues: {
              include: {
                optionValue: {
                  include: { option: true },
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
