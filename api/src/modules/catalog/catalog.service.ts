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
      where: {
        tenantId_slug: { tenantId, slug: dto.slug },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Category slug already exists in this tenant',
      );
    }

    return this.prisma.category.create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async findAllCategories() {
    const tenantId = this.getTenantId();
    return this.prisma.category.findMany({
      where: { tenantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // --- Product Logic ---
  async createProduct(dto: CreateProductDto) {
    const tenantId = this.getTenantId();
    const { skus, ...productData } = dto;

    const existing = await this.prisma.product.findUnique({
      where: {
        tenantId_slug: { tenantId, slug: dto.slug },
      },
    });

    if (existing) {
      throw new ConflictException('Product slug already exists in this tenant');
    }

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          ...productData,
          tenantId,
          skus: {
            create: skus.map((sku) => ({
              sku: sku.sku,
              price: sku.price,
              comparePrice: sku.comparePrice,
              stock: sku.stock,
              attributes: sku.attributes ?? {},
              tenantId,
            })),
          },
        },
        include: { skus: true },
      });

      return product;
    });
  }

  async findAllProducts() {
    const tenantId = this.getTenantId();
    return this.prisma.product.findMany({
      where: { tenantId, isActive: true },
      include: {
        skus: { where: { isActive: true } },
        category: true,
      },
    });
  }

  async findProductBySlug(slug: string) {
    const tenantId = this.getTenantId();
    const product = await this.prisma.product.findUnique({
      where: {
        tenantId_slug: { tenantId, slug },
      },
      include: {
        skus: { where: { isActive: true } },
        category: true,
        options: { include: { values: true } },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
