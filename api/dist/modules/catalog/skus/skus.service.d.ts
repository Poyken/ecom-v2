import { PrismaService } from '../../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import type { CreateSkuDto, UpdateSkuDto } from '@ecommerce/shared';
import { InventoryService } from '../../inventory/inventory.service';
export declare class SkusService {
    private readonly prisma;
    private readonly cls;
    private readonly inventoryService;
    constructor(prisma: PrismaService, cls: ClsService, inventoryService: InventoryService);
    private get tenantId();
    create(createSkuDto: CreateSkuDto): Promise<{
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
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        productId: string;
        skuCode: string;
        price: import("@prisma/client/runtime/library").Decimal | null;
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
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        productId: string;
        skuCode: string;
        price: import("@prisma/client/runtime/library").Decimal | null;
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
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        productId: string;
        skuCode: string;
        price: import("@prisma/client/runtime/library").Decimal | null;
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
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        productId: string;
        skuCode: string;
        price: import("@prisma/client/runtime/library").Decimal | null;
        salePrice: import("@prisma/client/runtime/library").Decimal | null;
        stock: number;
        reservedStock: number;
    }>;
}
