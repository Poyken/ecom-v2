import { ProductsService } from './products.service';
import type { CreateProductDto, UpdateProductDto } from '@ecommerce/shared';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        metaTitle: string | null;
        slug: string;
        brandId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        maxPrice: import("@prisma/client/runtime/library").Decimal | null;
        minPrice: import("@prisma/client/runtime/library").Decimal | null;
        avgRating: number | null;
        reviewCount: number;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(): Promise<({
        brand: {
            id: string;
            name: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            imageId: string | null;
            slug: string;
            imageUrl: string | null;
        };
        categories: {
            tenantId: string;
            categoryId: string;
            productId: string;
        }[];
        options: ({
            values: {
                id: string;
                value: string;
                tenantId: string;
                imageId: string | null;
                imageUrl: string | null;
                optionId: string;
            }[];
        } & {
            id: string;
            name: string;
            tenantId: string;
            displayOrder: number | null;
            productId: string;
        })[];
    } & {
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        metaTitle: string | null;
        slug: string;
        brandId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        maxPrice: import("@prisma/client/runtime/library").Decimal | null;
        minPrice: import("@prisma/client/runtime/library").Decimal | null;
        avgRating: number | null;
        reviewCount: number;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: string): Promise<{
        brand: {
            id: string;
            name: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            imageId: string | null;
            slug: string;
            imageUrl: string | null;
        };
        categories: {
            tenantId: string;
            categoryId: string;
            productId: string;
        }[];
        skus: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            tenantId: string;
            imageUrl: string | null;
            price: import("@prisma/client/runtime/library").Decimal | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            productId: string;
            skuCode: string;
            salePrice: import("@prisma/client/runtime/library").Decimal | null;
            stock: number;
            reservedStock: number;
        }[];
        options: ({
            values: {
                id: string;
                value: string;
                tenantId: string;
                imageId: string | null;
                imageUrl: string | null;
                optionId: string;
            }[];
        } & {
            id: string;
            name: string;
            tenantId: string;
            displayOrder: number | null;
            productId: string;
        })[];
    } & {
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        metaTitle: string | null;
        slug: string;
        brandId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        maxPrice: import("@prisma/client/runtime/library").Decimal | null;
        minPrice: import("@prisma/client/runtime/library").Decimal | null;
        avgRating: number | null;
        reviewCount: number;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        metaTitle: string | null;
        slug: string;
        brandId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        maxPrice: import("@prisma/client/runtime/library").Decimal | null;
        minPrice: import("@prisma/client/runtime/library").Decimal | null;
        avgRating: number | null;
        reviewCount: number;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        metaTitle: string | null;
        slug: string;
        brandId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        maxPrice: import("@prisma/client/runtime/library").Decimal | null;
        minPrice: import("@prisma/client/runtime/library").Decimal | null;
        avgRating: number | null;
        reviewCount: number;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
    }>;
}
