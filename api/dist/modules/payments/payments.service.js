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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const nestjs_cls_1 = require("nestjs-cls");
const payment_providers_1 = require("./providers/payment.providers");
let PaymentsService = class PaymentsService {
    prisma;
    cls;
    providers = new Map();
    constructor(prisma, cls) {
        this.prisma = prisma;
        this.cls = cls;
        this.registerProvider(new payment_providers_1.CodProvider());
        this.registerProvider(new payment_providers_1.BankTransferProvider());
    }
    registerProvider(provider) {
        this.providers.set(provider.getProviderName(), provider);
    }
    get tenantId() {
        return this.cls.get('TENANT_ID');
    }
    async processPayment(dto) {
        const { orderId, method } = dto;
        const order = await this.prisma.order.findUnique({
            where: { id: orderId, tenantId: this.tenantId }
        });
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        if (order.paymentStatus === 'PAID')
            throw new common_1.BadRequestException('Order already paid');
        const provider = this.providers.get(method);
        if (!provider)
            throw new common_1.BadRequestException(`Payment method ${method} not supported`);
        const result = await provider.process(orderId, Number(order.totalAmount));
        await this.prisma.payment.create({
            data: {
                tenantId: this.tenantId,
                orderId: orderId,
                amount: order.totalAmount,
                paymentMethod: method,
                status: result.status,
                providerTransactionId: result.transactionId || `TX-${Date.now()}`,
                metadata: result.action?.payload || {},
                paidAt: result.status === 'COMPLETED' ? new Date() : null
            }
        });
        if (result.status === 'COMPLETED') {
            await this.prisma.order.update({
                where: { id: orderId },
                data: { paymentStatus: 'PAID' }
            });
        }
        return result;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nestjs_cls_1.ClsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map