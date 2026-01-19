import { InventoryService } from './inventory.service';
import type { CreateWarehouseDto } from '@ecommerce/shared';
export declare class WarehousesController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(dto: CreateWarehouseDto): Promise<{
        address: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isDefault: boolean;
    }>;
    findAll(): Promise<{
        address: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isDefault: boolean;
    }[]>;
}
