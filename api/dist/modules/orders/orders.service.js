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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const nestjs_cls_1 = require("nestjs-cls");
const cart_service_1 = require("../cart/cart.service");
const inventory_service_1 = require("../inventory/inventory.service");
let OrdersService = class OrdersService {
    prisma;
    cls;
    cartService;
    inventoryService;
    constructor(prisma, cls, cartService, inventoryService) {
        this.prisma = prisma;
        this.cls = cls;
        this.cartService = cartService;
        this.inventoryService = inventoryService;
    }
    get tenantId() {
        return this.cls.get('tenantId');
    }
    async create(userId, createOrderDto) {
        const { addressId, paymentMethod, note } = createOrderDto;
        const cart = await this.cartService.getCart(userId);
        if (!cart.items || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        let totalAmount = 0;
        const orderItemsData = [];
        for (const item of cart.items) {
            if (item.sku.stock < item.quantity) {
                throw new common_1.BadRequestException(`Product ${item.sku.product.name} (SKU: ${item.sku.skuCode}) is out of stock`);
            }
            const price = Number(item.sku.price);
            if (!price)
                throw new common_1.BadRequestException(`SKU ${item.sku.skuCode} has no price`);
            const lineTotal = price * item.quantity;
            totalAmount += lineTotal;
            orderItemsData.push({
                skuId: item.skuId,
                productName: item.sku.product.name,
                skuCode: item.sku.skuCode,
                quantity: item.quantity,
                price: price,
                total: lineTotal,
                tenantId: this.tenantId
            });
        }
        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    tenantId: this.tenantId,
                    status: 'PENDING',
                    paymentStatus: 'UNPAID',
                    paymentMethod,
                    totalAmount,
                    ...await this.getAddressData(tx, userId, addressId),
                    items: {
                        create: orderItemsData
                    }
                }
            });
            for (const item of cart.items) {
                await this.inventoryService.adjustStock(item.skuId, {
                    quantity: -item.quantity,
                    type: 'SALE',
                    reason: `Order #${newOrder.id}`,
                }, tx);
            }
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
            return newOrder;
        });
        return order;
    }
    async findAll(userId) {
        return this.prisma.order.findMany({
            where: { userId, tenantId: this.tenantId },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, id) {
        const order = await this.prisma.order.findUnique({
            where: { id, tenantId: this.tenantId },
            include: { items: true, address: true }
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== userId)
            throw new common_1.BadRequestException('Not authorized');
        return order;
    }
    async getAddressData(tx, userId, addressId) {
        let address;
        if (addressId) {
            address = await tx.address.findUnique({ where: { id: addressId } });
        }
        else {
            address = await tx.address.findFirst({ where: { userId, isDefault: true } });
            if (!address) {
                address = await tx.address.findFirst({ where: { userId } });
            }
        }
        if (!address) {
            throw new common_1.BadRequestException('Please provide a delivery address');
        }
        return {
            recipientName: address.recipientName,
            phoneNumber: address.phoneNumber,
            shippingAddress: address.street,
            shippingCity: address.city,
            shippingDistrict: address.district,
            shippingWard: address.ward,
            shippingPhone: address.phoneNumber,
            addressId: address.id
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nestjs_cls_1.ClsService,
        cart_service_1.CartService,
        inventory_service_1.InventoryService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map