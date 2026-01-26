import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateWarehouseDto, UpdateStockDto } from './dto/inventory.dto';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    private getTenantId;
    createWarehouse(dto: CreateWarehouseDto): Promise<{
        id: string;
        tenantId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        address: string | null;
    }>;
    findAllWarehouses(): Promise<{
        id: string;
        tenantId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
        address: string | null;
    }[]>;
    updateStock(dto: UpdateStockDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        skuId: string;
        warehouseId: string;
        quantity: number;
        reorderPoint: number;
        reserved: number;
    }>;
    getInventorySnapshot(): Promise<({
        sku: {
            product: {
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
            };
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
        };
        warehouse: {
            id: string;
            tenantId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            address: string | null;
        };
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        skuId: string;
        warehouseId: string;
        quantity: number;
        reorderPoint: number;
        reserved: number;
    })[]>;
}
