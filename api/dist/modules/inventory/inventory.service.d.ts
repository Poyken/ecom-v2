import { PrismaService } from '../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import type { AdjustInventoryDto, CreateWarehouseDto } from '@ecommerce/shared';
export declare class InventoryService {
    private readonly prisma;
    private readonly cls;
    constructor(prisma: PrismaService, cls: ClsService);
    private get tenantId();
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
    findDefaultWarehouse(tx?: any): Promise<any>;
    getAvailableStock(skuId: string): Promise<number>;
    getInventoryItems(skuId: string): Promise<({
        warehouse: {
            address: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isDefault: boolean;
        };
    } & {
        id: string;
        tenantId: string;
        warehouseId: string;
        skuId: string;
        quantity: number;
        minStockLevel: number;
    })[]>;
    adjustStock(skuId: string, adjustDto: AdjustInventoryDto, externalTx?: any): Promise<{
        newStock: any;
        warehouseId: string | undefined;
    }>;
}
