import { InventoryService } from './inventory.service';
import type { AdjustInventoryDto, TransferInventoryDto } from '@ecommerce/shared';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getAvailableStock(skuId: string): Promise<number>;
    adjustStock(skuId: string, dto: AdjustInventoryDto): Promise<{
        newStock: any;
        warehouseId: string | undefined;
    }>;
    transferStock(skuId: string, dto: TransferInventoryDto): Promise<{
        success: boolean;
    }>;
}
