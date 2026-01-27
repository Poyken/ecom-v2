import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import {
  Inject,
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
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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
          isActive: true,
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
          // Fix: Ensure we match against the correct key format constructed earlier: "OptionName:Value"
          const key = `${ov.optionName}:${ov.value}`;
          const optionValueId = valueMap.get(key);
          if (!optionValueId) {
            console.error(`Available keys: ${Array.from(valueMap.keys()).join(', ')}`);
            throw new NotFoundException(
              `Option value ${key} not found.`,
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

      // 4. Invalidate Cache
      await this.cacheManager.del(`products:${tenantId}`);

      // 5. Return the full product structure using the Transaction Client to ensure visibility
      return tx.product.findUnique({
        where: { id: product.id },
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
    });
  }

  async findAllProducts() {
    const tenantId = this.getTenantId();
    const cacheKey = `products:${tenantId}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const products = await this.prisma.product.findMany({
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

    await this.cacheManager.set(cacheKey, products, 300000); // Cache for 5 minutes
    return products;
  }

  async findProductBySlug(slug: string) {
    const tenantId = this.getTenantId();
    const cacheKey = `product:${tenantId}:${slug}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

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

    await this.cacheManager.set(cacheKey, product, 300000); // Cache for 5 minutes
    return product;
  }
}
