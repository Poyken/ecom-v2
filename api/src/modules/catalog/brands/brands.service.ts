import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import slugify from 'slugify';
import type { CreateBrandDto, UpdateBrandDto } from '@ecommerce/shared';

@Injectable()
export class BrandsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  private get tenantId() {
    return this.cls.get('tenantId');
  }

  async create(createBrandDto: CreateBrandDto) {
    const { name, ...rest } = createBrandDto;
    const slug = slugify(name, { lower: true, strict: true });

    let uniqueSlug = slug;
    let counter = 1;
    while (await this.checkSlugExists(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return this.prisma.brand.create({
      data: {
         ...rest,
        name,
        slug: uniqueSlug,
        tenantId: this.tenantId,
      },
    });
  }

  async findAll() {
    return this.prisma.brand.findMany({
      where: { tenantId: this.tenantId },
       orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id, tenantId: this.tenantId },
    });
    if (!brand) throw new BadRequestException('Brand not found');
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    await this.findOne(id);
    
    let data: any = { ...updateBrandDto };
    if (updateBrandDto.name) {
      const slug = slugify(updateBrandDto.name, { lower: true, strict: true });
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

    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.brand.update({
        where: { id, tenantId: this.tenantId },
        data: { deletedAt: new Date() }
    });
  }

  private async checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
      const existing = await this.prisma.brand.findFirst({
          where: {
              slug,
              tenantId: this.tenantId,
              id: excludeId ? { not: excludeId } : undefined,
          }
      });
      return !!existing;
  }
}
