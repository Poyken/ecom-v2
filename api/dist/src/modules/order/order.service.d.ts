import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';
import { VnpayService } from './vnpay.service';
export declare class OrderService {
    private prisma;
    private vnpayService;
    constructor(prisma: PrismaService, vnpayService: VnpayService);
    private getTenantId;
    createOrder(dto: CreateOrderDto, ipAddr: string): Promise<{
        id: string;
        orderNumber: string;
        total: number;
        status: string;
        paymentUrl: string | undefined;
    }>;
    getOrderDetails(id: string): Promise<{
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
    listTenantOrdersByStatus(status?: string): Promise<({
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
    handleVnpayIpn(query: any): Promise<{
        RspCode: string;
        Message: string;
    }>;
}
