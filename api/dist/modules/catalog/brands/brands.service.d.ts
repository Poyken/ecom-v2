import { PrismaService } from '../../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import type { CreateBrandDto, UpdateBrandDto } from '@ecommerce/shared';
export declare class BrandsService {
    private readonly prisma;
    private readonly cls;
    constructor(prisma: PrismaService, cls: ClsService);
    private get tenantId();
    create(createBrandDto: CreateBrandDto): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        imageId: string | null;
        slug: string;
        imageUrl: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        imageId: string | null;
        slug: string;
        imageUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        imageId: string | null;
        slug: string;
        imageUrl: string | null;
    }>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        imageId: string | null;
        slug: string;
        imageUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        imageId: string | null;
        slug: string;
        imageUrl: string | null;
    }>;
    private checkSlugExists;
}
