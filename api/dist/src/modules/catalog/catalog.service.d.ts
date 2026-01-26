import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCategoryDto, CreateProductDto } from './dto/catalog.dto';
export declare class CatalogService {
    private prisma;
    constructor(prisma: PrismaService);
    private getTenantId;
    createCategory(dto: CreateCategoryDto): Promise<{
        description: string | null;
        id: string;
        tenantId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        parentId: string | null;
        image: string | null;
        sortOrder: number;
    }>;
    findAllCategories(): Promise<{
        description: string | null;
        id: string;
        tenantId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        parentId: string | null;
        image: string | null;
        sortOrder: number;
    }[]>;
    createProduct(dto: CreateProductDto): Promise<{
        category: {
            description: string | null;
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            parentId: string | null;
            image: string | null;
            sortOrder: number;
        } | null;
        skus: ({
            skuValues: ({
                optionValue: {
                    option: {
                        id: string;
                        tenantId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        sortOrder: number;
                        productId: string;
                    };
                } & {
                    id: string;
                    tenantId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    value: string;
                    displayName: string;
                    sortOrder: number;
                    optionId: string;
                };
            } & {
                id: string;
                tenantId: string;
                skuId: string;
                optionValueId: string;
            })[];
        } & {
            sku: string;
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
            stock: number;
            costPrice: import("@prisma/client-runtime-utils").Decimal | null;
            weight: import("@prisma/client-runtime-utils").Decimal | null;
            dimensions: import("@prisma/client/runtime/client").JsonValue | null;
            deletedAt: Date | null;
            productId: string;
            barcode: string | null;
            trackInventory: boolean;
        })[];
        options: ({
            values: {
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                value: string;
                displayName: string;
                sortOrder: number;
                optionId: string;
            }[];
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sortOrder: number;
            productId: string;
        })[];
    } & {
        description: string | null;
        id: string;
        tenantId: string;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        tags: import("@prisma/client/runtime/client").JsonValue;
        status: string;
        slug: string;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
        categoryId: string | null;
        sortOrder: number;
        brandId: string | null;
        shortDescription: string | null;
        images: import("@prisma/client/runtime/client").JsonValue;
        salePrice: import("@prisma/client-runtime-utils").Decimal | null;
        costPrice: import("@prisma/client-runtime-utils").Decimal | null;
        weight: import("@prisma/client-runtime-utils").Decimal | null;
        dimensions: import("@prisma/client/runtime/client").JsonValue | null;
        publishedAt: Date | null;
        deletedAt: Date | null;
    }>;
    findAllProducts(): Promise<({
        category: {
            description: string | null;
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            parentId: string | null;
            image: string | null;
            sortOrder: number;
        } | null;
        skus: ({
            skuValues: ({
                optionValue: {
                    option: {
                        id: string;
                        tenantId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        sortOrder: number;
                        productId: string;
                    };
                } & {
                    id: string;
                    tenantId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    value: string;
                    displayName: string;
                    sortOrder: number;
                    optionId: string;
                };
            } & {
                id: string;
                tenantId: string;
                skuId: string;
                optionValueId: string;
            })[];
        } & {
            sku: string;
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
            stock: number;
            costPrice: import("@prisma/client-runtime-utils").Decimal | null;
            weight: import("@prisma/client-runtime-utils").Decimal | null;
            dimensions: import("@prisma/client/runtime/client").JsonValue | null;
            deletedAt: Date | null;
            productId: string;
            barcode: string | null;
            trackInventory: boolean;
        })[];
    } & {
        description: string | null;
        id: string;
        tenantId: string;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        tags: import("@prisma/client/runtime/client").JsonValue;
        status: string;
        slug: string;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
        categoryId: string | null;
        sortOrder: number;
        brandId: string | null;
        shortDescription: string | null;
        images: import("@prisma/client/runtime/client").JsonValue;
        salePrice: import("@prisma/client-runtime-utils").Decimal | null;
        costPrice: import("@prisma/client-runtime-utils").Decimal | null;
        weight: import("@prisma/client-runtime-utils").Decimal | null;
        dimensions: import("@prisma/client/runtime/client").JsonValue | null;
        publishedAt: Date | null;
        deletedAt: Date | null;
    })[]>;
    findProductBySlug(slug: string): Promise<{
        category: {
            description: string | null;
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            parentId: string | null;
            image: string | null;
            sortOrder: number;
        } | null;
        skus: ({
            skuValues: ({
                optionValue: {
                    option: {
                        id: string;
                        tenantId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        sortOrder: number;
                        productId: string;
                    };
                } & {
                    id: string;
                    tenantId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    value: string;
                    displayName: string;
                    sortOrder: number;
                    optionId: string;
                };
            } & {
                id: string;
                tenantId: string;
                skuId: string;
                optionValueId: string;
            })[];
        } & {
            sku: string;
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            comparePrice: import("@prisma/client-runtime-utils").Decimal | null;
            stock: number;
            costPrice: import("@prisma/client-runtime-utils").Decimal | null;
            weight: import("@prisma/client-runtime-utils").Decimal | null;
            dimensions: import("@prisma/client/runtime/client").JsonValue | null;
            deletedAt: Date | null;
            productId: string;
            barcode: string | null;
            trackInventory: boolean;
        })[];
        options: ({
            values: {
                id: string;
                tenantId: string;
                createdAt: Date;
                updatedAt: Date;
                value: string;
                displayName: string;
                sortOrder: number;
                optionId: string;
            }[];
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            sortOrder: number;
            productId: string;
        })[];
    } & {
        description: string | null;
        id: string;
        tenantId: string;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        tags: import("@prisma/client/runtime/client").JsonValue;
        status: string;
        slug: string;
        basePrice: import("@prisma/client-runtime-utils").Decimal;
        categoryId: string | null;
        sortOrder: number;
        brandId: string | null;
        shortDescription: string | null;
        images: import("@prisma/client/runtime/client").JsonValue;
        salePrice: import("@prisma/client-runtime-utils").Decimal | null;
        costPrice: import("@prisma/client-runtime-utils").Decimal | null;
        weight: import("@prisma/client-runtime-utils").Decimal | null;
        dimensions: import("@prisma/client/runtime/client").JsonValue | null;
        publishedAt: Date | null;
        deletedAt: Date | null;
    }>;
}
