"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const tenant_storage_1 = require("../../common/tenant/tenant.storage");
const vnpay_service_1 = require("./vnpay.service");
let OrderService = class OrderService {
    prisma;
    vnpayService;
    constructor(prisma, vnpayService) {
        this.prisma = prisma;
        this.vnpayService = vnpayService;
    }
    getTenantId() {
        const context = tenant_storage_1.tenantStorage.getStore();
        const tenantId = context?.tenantId;
        if (!tenantId) {
            throw new common_1.UnauthorizedException('Tenant ID is missing in context');
        }
        return tenantId;
    }
    async createOrder(dto, ipAddr) {
        const tenantId = this.getTenantId();
        const skuIds = dto.items.map(item => item.skuId);
        const skus = await this.prisma.sku.findMany({
            where: { id: { in: skuIds }, tenantId },
            include: { product: true },
        });
        if (skus.length !== skuIds.length) {
            throw new common_1.NotFoundException('One or more SKUs not found or belong to another tenant');
        }
        let subtotal = 0;
        const orderItemsData = dto.items.map(item => {
            const sku = skus.find(s => s.id === item.skuId);
            if (!sku)
                throw new common_1.NotFoundException('SKU not found');
            const price = Number(sku.price);
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;
            return {
                tenantId,
                skuId: sku.id,
                productName: sku.product.name,
                skuString: sku.sku,
                quantity: item.quantity,
                unitPrice: price,
                totalPrice: itemTotal,
            };
        });
        const total = subtotal;
        const orderNumber = `ORD-${Date.now()}`;
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    tenantId,
                    orderNumber,
                    subtotal,
                    total,
                    shippingAddress: dto.shippingAddress || {},
                    items: {
                        create: orderItemsData,
                    },
                },
            });
            await tx.payment.create({
                data: {
                    tenantId,
                    orderId: order.id,
                    gateway: dto.paymentGateway,
                    amount: total,
                    status: 'pending',
                },
            });
            let paymentUrl;
            if (dto.paymentGateway === 'vnpay') {
                paymentUrl = this.vnpayService.createPaymentUrl(order.id, total, ipAddr);
            }
            return {
                id: order.id,
                orderNumber: order.orderNumber,
                total: Number(order.total),
                status: order.status,
                paymentUrl,
            };
        });
    }
    async getOrderDetails(id) {
        const tenantId = this.getTenantId();
        const order = await this.prisma.order.findUnique({
            where: { id, tenantId },
            include: {
                items: true,
                payments: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async listTenantOrdersByStatus(status) {
        const tenantId = this.getTenantId();
        return this.prisma.order.findMany({
            where: {
                tenantId,
                ...(status ? { status } : {})
            },
            orderBy: { createdAt: 'desc' },
            include: { items: true },
        });
    }
    async handleVnpayIpn(query) {
        const orderId = query.vnp_TxnRef;
        const vnp_ResponseCode = query.vnp_ResponseCode;
        if (vnp_ResponseCode === '00') {
            await this.prisma.$transaction([
                this.prisma.payment.updateMany({
                    where: { orderId, gateway: 'vnpay' },
                    data: { status: 'completed', processedAt: new Date(), gatewayResponse: query },
                }),
                this.prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'processing' },
                }),
            ]);
        }
        else {
            await this.prisma.payment.updateMany({
                where: { orderId, gateway: 'vnpay' },
                data: { status: 'failed', gatewayResponse: query },
            });
        }
        return { RspCode: '00', Message: 'Confirm Success' };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vnpay_service_1.VnpayService])
], OrderService);
//# sourceMappingURL=order.service.js.map