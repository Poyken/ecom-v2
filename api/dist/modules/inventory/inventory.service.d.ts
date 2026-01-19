import { PrismaService } from '../../common/prisma/prisma.service';
import { AdjustInventoryDto, CreateWarehouseDto } from '@ecommerce/shared';
export declare class InventoryService {
    private prisma;
    private request;
    private tenantId;
    constructor(prisma: PrismaService, request: any);
    get currentTenantId(): string;
    findDefaultWarehouse(tx?: any): Promise<any>;
    getAvailableStock(skuId: string): Promise<number>;
    createWarehouse(dto: CreateWarehouseDto): Promise<{
        address: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isDefault: boolean;
    }>;
    findAllWarehouses(): Promise<{
        address: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isDefault: boolean;
    }[]>;
    findWarehouse(id: string): Promise<{
        address: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isDefault: boolean;
    } | null>;
    getWarehouseStock(warehouseId: string): Promise<({
        sku: {
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
        };
    } & {
        id: string;
        tenantId: string;
        skuId: string;
        warehouseId: string;
        quantity: number;
        minStockLevel: number;
    })[]>;
    getWarehouseLogs(warehouseId: string): Promise<({
        user: {
            email: string;
            firstName: string | null;
            lastName: string | null;
        } | null;
        sku: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.InventoryLogType;
        tenantId: string;
        userId: string | null;
        skuId: string;
        changeAmount: number;
        previousStock: number;
        newStock: number;
        reason: string | null;
    })[]>;
    adjustStock(skuId: string, adjustDto: AdjustInventoryDto, externalTx?: any): Promise<{
        newStock: any;
        warehouseId: string | undefined;
    }>;
    transferStock(skuId: string, fromWarehouseId: string, toWarehouseId: string, quantity: number, reason?: string): Promise<{
        success: boolean;
    }>;
}
