import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import type { Request } from 'express';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(dto: CreateOrderDto, req: Request): Promise<{
        id: string;
        orderNumber: string;
        total: number;
        status: string;
        paymentUrl: string | undefined;
    }>;
    listOrders(status?: string): Promise<({
        items: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            skuId: string;
            quantity: number;
            productName: string;
            skuString: string;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            totalPrice: import("@prisma/client-runtime-utils").Decimal;
            attributes: import("@prisma/client/runtime/client").JsonValue;
            orderId: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        shippingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        orderNumber: string;
        currency: string;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        shippingAmount: import("@prisma/client-runtime-utils").Decimal;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        notes: string | null;
        userId: string | null;
    })[]>;
    getOrder(id: string): Promise<{
        items: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            skuId: string;
            quantity: number;
            productName: string;
            skuString: string;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            totalPrice: import("@prisma/client-runtime-utils").Decimal;
            attributes: import("@prisma/client/runtime/client").JsonValue;
            orderId: string;
        }[];
        payments: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            currency: string;
            orderId: string;
            gateway: string;
            transactionId: string | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
            gatewayResponse: import("@prisma/client/runtime/client").JsonValue | null;
            processedAt: Date | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        shippingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        orderNumber: string;
        currency: string;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        shippingAmount: import("@prisma/client-runtime-utils").Decimal;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        notes: string | null;
        userId: string | null;
    }>;
    handleVnpayIpn(query: any): Promise<{
        RspCode: string;
        Message: string;
    }>;
}
