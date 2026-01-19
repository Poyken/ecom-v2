import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import slugify from 'slugify';
import type { CreateProductDto, UpdateProductDto } from '@ecommerce/shared';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  private get tenantId() {
    return this.cls.get('tenantId');
  }

  async create(createProductDto: CreateProductDto) {
    const { name, categoryIds, options, ...rest } = createProductDto;
    const slug = slugify(name, { lower: true, strict: true });

    let uniqueSlug = slug;
    let counter = 1;
    while (await this.checkSlugExists(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    // Transaction to create product + link categories + create options
    return this.prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
            data: {
                ...rest,
                name,
                slug: uniqueSlug,
                tenantId: this.tenantId,
                categories: {
                    create: categoryIds.map(catId => ({
                        categoryId: catId,
                        tenantId: this.tenantId,
                    }))
                }
            }
        });

        // Create Options if provided
        if (options && options.length > 0) {
            for (const opt of options) {
                await tx.productOption.create({
                    data: {
                        name: opt.name,
                        productId: product.id,
                        tenantId: this.tenantId,
                        values: {
                            create: opt.values.map(val => ({
                                value: val,
                                tenantId: this.tenantId,
                            }))
                        }
                    }
                });
            }
        }

        return product;
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { tenantId: this.tenantId },
      include: { brand: true, categories: true, options: { include: { values: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id, tenantId: this.tenantId },
      include: { brand: true, categories: true, options: { include: { values: true } }, skus: true },
    });
    if (!product) throw new BadRequestException('Product not found');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
      // Update logic is complex with relations.
      // For now, support basic fields and maybe category re-linking.
      // Skipping deep update of Options for MVP/Phase 4. 
      // User can update Product fields.
      const { categoryIds, options, ...rest } = updateProductDto;
      
      const product = await this.findOne(id);

      // Slug update logic
       let data: any = { ...rest };
        if (updateProductDto.name) {
          const slug = slugify(updateProductDto.name, { lower: true, strict: true });
            if (slug !== product.slug) {
                let uniqueSlug = slug;
                let counter = 1;
                while (await this.checkSlugExists(uniqueSlug, id)) {
                    uniqueSlug = `${slug}-${counter}`;
                    counter++;
                }
                data.slug = uniqueSlug;
            }
        }

      return this.prisma.product.update({
          where: { id },
          data
      });
      
      // TODO: Handle categoryIds update if needed (delete many -> create many)
  }

  async remove(id: string) {
     return this.prisma.product.update({
        where: { id, tenantId: this.tenantId },
        data: { deletedAt: new Date() }
    });
  }

  private async checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
      const existing = await this.prisma.product.findFirst({
          where: {
              slug,
              tenantId: this.tenantId,
              id: excludeId ? { not: excludeId } : undefined,
          }
      });
      return !!existing;
  }
}
