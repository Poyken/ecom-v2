import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import slugify from 'slugify';
import type { CreateCategoryDto, UpdateCategoryDto } from '@ecommerce/shared';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  private get tenantId() {
    return this.cls.get('TENANT_ID');
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, ...rest } = createCategoryDto;
    const slug = slugify(name, { lower: true, strict: true });

    // Handle slug collision if needed (Prisma will throw, but we can verify first)
    // Or just let Prisma throw and catch? Better to auto-append for UX? 
    // Plan said: "Duplicates will be handled by appending".
    // I will try simple suffix if collision.

    let uniqueSlug = slug;
    let counter = 1;
    while (await this.checkSlugExists(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return this.prisma.category.create({
      data: {
        ...rest,
        name,
        slug: uniqueSlug,
        tenantId: this.tenantId,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      where: { tenantId: this.tenantId },
      include: {
        children: true, 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id, tenantId: this.tenantId }, // Tenant isolation
      include: { children: true, parent: true },
    });
    if (!category) {
        throw new BadRequestException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Check exist
    await this.findOne(id);
    
    // Logic for slug update? 
    // If name changes, should slug change? Usually yes, to keep SEO? 
    // Or keep slug unless explicitly requested?
    // DTO doesn't have slug. So if name changes, update slug?
    // For now, if name changes, update slug.
    
    let data: any = { ...updateCategoryDto };
    
    if (updateCategoryDto.name) {
        const slug = slugify(updateCategoryDto.name, { lower: true, strict: true });
        // Check uniqueness if slug changed
        const current = await this.findOne(id);
        if (slug !== current.slug) {
             let uniqueSlug = slug;
            let counter = 1;
            while (await this.checkSlugExists(uniqueSlug, id)) {
                uniqueSlug = `${slug}-${counter}`;
                counter++;
            }
            data.slug = uniqueSlug;
        }
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    // Soft delete
    return this.prisma.category.update({
        where: { id, tenantId: this.tenantId },
        data: { deletedAt: new Date() }
    });
  }
  
  private async checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
      const existing = await this.prisma.category.findFirst({
          where: {
              slug,
              tenantId: this.tenantId,
              id: excludeId ? { not: excludeId } : undefined,
          }
      });
      return !!existing;
  }
}
