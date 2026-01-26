export declare class CreateWarehouseDto {
    name: string;
    code: string;
    address?: string;
}
export declare class UpdateStockDto {
    skuId: string;
    warehouseId: string;
    quantity: number;
    reorderPoint?: number;
}
