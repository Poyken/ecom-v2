import { PrismaService } from '../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import type { AddToCartDto, UpdateCartItemDto } from '@ecommerce/shared';
import { PromotionsService } from '../promotions/promotions.service';
export declare class CartService {
    private readonly prisma;
    private readonly cls;
    private readonly promotionsService;
    constructor(prisma: PrismaService, cls: ClsService, promotionsService: PromotionsService);
    private get tenantId();
    getCart(userId: string, voucherCode?: string): Promise<{
        subTotal: number;
        totalAmount: number;
        discountAmount: number;
        appliedPromotions: any[];
        items: ({
            sku: {
                product: {
                    id: string;
                    name: string;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    tenantId: string;
                    description: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    metaTitle: string | null;
                    slug: string;
                    brandId: string;
                    metadata: import("@prisma/client/runtime/library").JsonValue | null;
                    maxPrice: import("@prisma/client/runtime/library").Decimal | null;
                    minPrice: import("@prisma/client/runtime/library").Decimal | null;
                    avgRating: number | null;
                    reviewCount: number;
                    commissionRate: import("@prisma/client/runtime/library").Decimal;
                };
                optionValues: ({
                    optionValue: {
                        id: string;
                        value: string;
                        tenantId: string;
                        imageId: string | null;
                        imageUrl: string | null;
                        optionId: string;
                    };
                } & {
                    tenantId: string;
                    skuId: string;
                    optionValueId: string;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                tenantId: string;
                imageUrl: string | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                productId: string;
                skuCode: string;
                price: import("@prisma/client/runtime/library").Decimal | null;
                salePrice: import("@prisma/client/runtime/library").Decimal | null;
                stock: number;
                reservedStock: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            skuId: string;
            quantity: number;
            cartId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        userId: string;
    }>;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<{
        subTotal: number;
        totalAmount: number;
        discountAmount: number;
        appliedPromotions: any[];
        items: ({
            sku: {
                product: {
                    id: string;
                    name: string;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    tenantId: string;
                    description: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    metaTitle: string | null;
                    slug: string;
                    brandId: string;
                    metadata: import("@prisma/client/runtime/library").JsonValue | null;
                    maxPrice: import("@prisma/client/runtime/library").Decimal | null;
                    minPrice: import("@prisma/client/runtime/library").Decimal | null;
                    avgRating: number | null;
                    reviewCount: number;
                    commissionRate: import("@prisma/client/runtime/library").Decimal;
                };
                optionValues: ({
                    optionValue: {
                        id: string;
                        value: string;
                        tenantId: string;
                        imageId: string | null;
                        imageUrl: string | null;
                        optionId: string;
                    };
                } & {
                    tenantId: string;
                    skuId: string;
                    optionValueId: string;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                tenantId: string;
                imageUrl: string | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                productId: string;
                skuCode: string;
                price: import("@prisma/client/runtime/library").Decimal | null;
                salePrice: import("@prisma/client/runtime/library").Decimal | null;
                stock: number;
                reservedStock: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            skuId: string;
            quantity: number;
            cartId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        userId: string;
    }>;
    updateCartItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<{
        subTotal: number;
        totalAmount: number;
        discountAmount: number;
        appliedPromotions: any[];
        items: ({
            sku: {
                product: {
                    id: string;
                    name: string;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    tenantId: string;
                    description: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    metaTitle: string | null;
                    slug: string;
                    brandId: string;
                    metadata: import("@prisma/client/runtime/library").JsonValue | null;
                    maxPrice: import("@prisma/client/runtime/library").Decimal | null;
                    minPrice: import("@prisma/client/runtime/library").Decimal | null;
                    avgRating: number | null;
                    reviewCount: number;
                    commissionRate: import("@prisma/client/runtime/library").Decimal;
                };
                optionValues: ({
                    optionValue: {
                        id: string;
                        value: string;
                        tenantId: string;
                        imageId: string | null;
                        imageUrl: string | null;
                        optionId: string;
                    };
                } & {
                    tenantId: string;
                    skuId: string;
                    optionValueId: string;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                tenantId: string;
                imageUrl: string | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                productId: string;
                skuCode: string;
                price: import("@prisma/client/runtime/library").Decimal | null;
                salePrice: import("@prisma/client/runtime/library").Decimal | null;
                stock: number;
                reservedStock: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            skuId: string;
            quantity: number;
            cartId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        userId: string;
    }>;
    removeCartItem(userId: string, itemId: string): Promise<{
        subTotal: number;
        totalAmount: number;
        discountAmount: number;
        appliedPromotions: any[];
        items: ({
            sku: {
                product: {
                    id: string;
                    name: string;
                    deletedAt: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                    tenantId: string;
                    description: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    metaTitle: string | null;
                    slug: string;
                    brandId: string;
                    metadata: import("@prisma/client/runtime/library").JsonValue | null;
                    maxPrice: import("@prisma/client/runtime/library").Decimal | null;
                    minPrice: import("@prisma/client/runtime/library").Decimal | null;
                    avgRating: number | null;
                    reviewCount: number;
                    commissionRate: import("@prisma/client/runtime/library").Decimal;
                };
                optionValues: ({
                    optionValue: {
                        id: string;
                        value: string;
                        tenantId: string;
                        imageId: string | null;
                        imageUrl: string | null;
                        optionId: string;
                    };
                } & {
                    tenantId: string;
                    skuId: string;
                    optionValueId: string;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                tenantId: string;
                imageUrl: string | null;
                metadata: import("@prisma/client/runtime/library").JsonValue | null;
                productId: string;
                skuCode: string;
                price: import("@prisma/client/runtime/library").Decimal | null;
                salePrice: import("@prisma/client/runtime/library").Decimal | null;
                stock: number;
                reservedStock: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            skuId: string;
            quantity: number;
            cartId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        userId: string;
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
}
