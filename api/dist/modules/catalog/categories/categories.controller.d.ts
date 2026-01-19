import { CategoriesService } from './categories.service';
import type { CreateCategoryDto, UpdateCategoryDto } from '@ecommerce/shared';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        metaDescription: string | null;
        metaKeywords: string | null;
        metaTitle: string | null;
        imageId: string | null;
        parentId: string | null;
        slug: string;
        imageUrl: string | null;
    }>;
    findAll(): Promise<({
        children: {
            id: string;
            name: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            metaDescription: string | null;
            metaKeywords: string | null;
            metaTitle: string | null;
            imageId: string | null;
            parentId: string | null;
            slug: string;
            imageUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        metaDescription: string | null;
        metaKeywords: string | null;
        metaTitle: string | null;
        imageId: string | null;
        parentId: string | null;
        slug: string;
        imageUrl: string | null;
    })[]>;
    findOne(id: string): Promise<{
        parent: {
            id: string;
            name: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            metaDescription: string | null;
            metaKeywords: string | null;
            metaTitle: string | null;
            imageId: string | null;
            parentId: string | null;
            slug: string;
            imageUrl: string | null;
        } | null;
        children: {
            id: string;
            name: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            metaDescription: string | null;
            metaKeywords: string | null;
            metaTitle: string | null;
            imageId: string | null;
            parentId: string | null;
            slug: string;
            imageUrl: string | null;
        }[];
    } & {
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        metaDescription: string | null;
        metaKeywords: string | null;
        metaTitle: string | null;
        imageId: string | null;
        parentId: string | null;
        slug: string;
        imageUrl: string | null;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        metaDescription: string | null;
        metaKeywords: string | null;
        metaTitle: string | null;
        imageId: string | null;
        parentId: string | null;
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
        metaDescription: string | null;
        metaKeywords: string | null;
        metaTitle: string | null;
        imageId: string | null;
        parentId: string | null;
        slug: string;
        imageUrl: string | null;
    }>;
}
