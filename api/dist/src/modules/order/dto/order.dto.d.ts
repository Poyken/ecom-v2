export declare class OrderItemDto {
    skuId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    shippingAddress?: any;
    paymentGateway: string;
}
export declare class OrderResponseDto {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    paymentUrl?: string;
}
