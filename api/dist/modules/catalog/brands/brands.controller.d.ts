import { BrandsService } from './brands.service';
import type { CreateBrandDto, UpdateBrandDto } from '@ecommerce/shared';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
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
}
