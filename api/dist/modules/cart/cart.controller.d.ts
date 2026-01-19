import { CartService } from './cart.service';
import type { AddToCartDto, UpdateCartItemDto } from '@ecommerce/shared';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<{
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
    addToCart(req: any, addToCartDto: AddToCartDto): Promise<{
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
    updateCartItem(req: any, itemId: string, dto: UpdateCartItemDto): Promise<{
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
    removeCartItem(req: any, itemId: string): Promise<{
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
    clearCart(req: any): Promise<{
        message: string;
    }>;
}
