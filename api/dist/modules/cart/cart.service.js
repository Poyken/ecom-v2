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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const nestjs_cls_1 = require("nestjs-cls");
let CartService = class CartService {
    prisma;
    cls;
    constructor(prisma, cls) {
        this.prisma = prisma;
        this.cls = cls;
    }
    get tenantId() {
        return this.cls.get('tenantId');
    }
    async getCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: {
                userId_tenantId: {
                    userId,
                    tenantId: this.tenantId,
                },
            },
            include: {
                items: {
                    include: {
                        sku: {
                            include: {
                                product: true,
                                optionValues: { include: { optionValue: true } }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    userId,
                    tenantId: this.tenantId,
                },
                include: { items: { include: { sku: { include: { product: true, optionValues: { include: { optionValue: true } } } } } } }
            });
        }
        return cart;
    }
    async addToCart(userId, addToCartDto) {
        const { skuId, quantity } = addToCartDto;
        const cart = await this.getCart(userId);
        const sku = await this.prisma.sku.findUnique({
            where: { id: skuId, tenantId: this.tenantId },
            include: { product: true }
        });
        if (!sku)
            throw new common_1.NotFoundException('SKU not found');
        if (sku.status !== 'ACTIVE' && sku.status !== 'INACTIVE') {
        }
        if (sku.stock < quantity) {
            throw new common_1.BadRequestException(`Not enough stock. Available: ${sku.stock}`);
        }
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_skuId: {
                    cartId: cart.id,
                    skuId
                }
            }
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (sku.stock < newQuantity) {
                throw new common_1.BadRequestException(`Not enough stock for total quantity. Available: ${sku.stock}`);
            }
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity }
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    skuId,
                    quantity,
                    tenantId: this.tenantId
                }
            });
        }
        return this.getCart(userId);
    }
    async updateCartItem(userId, itemId, dto) {
        const cart = await this.getCart(userId);
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id, tenantId: this.tenantId },
            include: { sku: true }
        });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        if (dto.quantity > item.sku.stock) {
            throw new common_1.BadRequestException(`Not enough stock. Available: ${item.sku.stock}`);
        }
        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: dto.quantity }
        });
        return this.getCart(userId);
    }
    async removeCartItem(userId, itemId) {
        const cart = await this.getCart(userId);
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id }
        });
        if (!item)
            throw new common_1.NotFoundException("Item not found");
        await this.prisma.cartItem.delete({
            where: { id: itemId }
        });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getCart(userId);
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });
        return { message: 'Cart cleared' };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nestjs_cls_1.ClsService])
], CartService);
//# sourceMappingURL=cart.service.js.map