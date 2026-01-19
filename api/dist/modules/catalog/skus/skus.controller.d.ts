import { SkusService } from './skus.service';
import type { CreateSkuDto, UpdateSkuDto } from '@ecommerce/shared';
export declare class SkusController {
    private readonly skusService;
    constructor(skusService: SkusService);
    create(createSkuDto: CreateSkuDto): Promise<{
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
    }>;
    findAll(): Promise<({
        product: {
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
        };
        optionValues: ({
            optionValue: {
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
        price: import("@prisma/client/runtime/library").Decimal | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        productId: string;
        skuCode: string;
        salePrice: import("@prisma/client/runtime/library").Decimal | null;
        stock: number;
        reservedStock: number;
    })[]>;
    findOne(id: string): Promise<{
        product: {
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
        };
        optionValues: ({
            optionValue: {
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
        price: import("@prisma/client/runtime/library").Decimal | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        productId: string;
        skuCode: string;
        salePrice: import("@prisma/client/runtime/library").Decimal | null;
        stock: number;
        reservedStock: number;
    }>;
    update(id: string, updateSkuDto: UpdateSkuDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
