import { PrismaService } from '../../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import type { CreateProductDto, UpdateProductDto } from '@ecommerce/shared';
import { AiService } from '../../ai/ai.service';
export declare class ProductsService {
    private readonly prisma;
    private readonly cls;
    private readonly aiService;
    constructor(prisma: PrismaService, cls: ClsService, aiService: AiService);
    private get tenantId();
    create(createProductDto: CreateProductDto): Promise<any>;
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
            productId: string;
            categoryId: string;
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
            productId: string;
            displayOrder: number | null;
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
        categories: ({
            category: {
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
            };
        } & {
            tenantId: string;
            productId: string;
            categoryId: string;
        })[];
        skus: ({
            optionValues: ({
                optionValue: {
                    option: {
                        id: string;
                        name: string;
                        tenantId: string;
                        productId: string;
                        displayOrder: number | null;
                    };
                } & {
                    id: string;
                    value: string;
                    tenantId: string;
                    imageId: string | null;
                    imageUrl: string | null;
                    optionId: string;
                };
            } & {
                tenantId: string;
                skuId: string;
                optionValueId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            tenantId: string;
            imageUrl: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            productId: string;
            skuCode: string;
            price: import("@prisma/client/runtime/library").Decimal | null;
            salePrice: import("@prisma/client/runtime/library").Decimal | null;
            stock: number;
            reservedStock: number;
        })[];
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
            productId: string;
            displayOrder: number | null;
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
    findBySlug(slug: string): Promise<{
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
        categories: ({
            category: {
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
            };
        } & {
            tenantId: string;
            productId: string;
            categoryId: string;
        })[];
        skus: ({
            optionValues: ({
                optionValue: {
                    option: {
                        id: string;
                        name: string;
                        tenantId: string;
                        productId: string;
                        displayOrder: number | null;
                    };
                } & {
                    id: string;
                    value: string;
                    tenantId: string;
                    imageId: string | null;
                    imageUrl: string | null;
                    optionId: string;
                };
            } & {
                tenantId: string;
                skuId: string;
                optionValueId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            tenantId: string;
            imageUrl: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            productId: string;
            skuCode: string;
            price: import("@prisma/client/runtime/library").Decimal | null;
            salePrice: import("@prisma/client/runtime/library").Decimal | null;
            stock: number;
            reservedStock: number;
        })[];
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
            productId: string;
            displayOrder: number | null;
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
    private checkSlugExists;
}
