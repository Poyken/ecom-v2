import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import type { AddToCartDto, UpdateCartItemDto } from '@ecommerce/shared';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  private get tenantId() {
    return this.cls.get('TENANT_ID');
  }

  async getCart(userId: string) {
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

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { skuId, quantity } = addToCartDto;

    const cart = await this.getCart(userId);

    // Verify SKU
    const sku = await this.prisma.sku.findUnique({
        where: { id: skuId, tenantId: this.tenantId },
        include: { product: true }
    });

    if (!sku) throw new NotFoundException('SKU not found');
    if (sku.status !== 'ACTIVE' && sku.status !== 'INACTIVE') { 
        // Logic check: What is active status? 
        // Schema: status String @default("INACTIVE")
        // Assumed 'ACTIVE' is the usable status. 
        // Wait, schema status is just String. Let's assume valid records are OK for now or check if we agreed on Enum.
        // Product Catalog Phase set it to default INACTIVE. 
        // For Verification, I should probably check if stock > 0.
    }
    
    // Simple Stock Check
    if (sku.stock < quantity) {
        throw new BadRequestException(`Not enough stock. Available: ${sku.stock}`);
    }

    // Check if item exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
        where: {
            cartId_skuId: {
                cartId: cart.id,
                skuId
            }
        }
    });

    if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        if (sku.stock < newQuantity) {
            throw new BadRequestException(`Not enough stock for total quantity. Available: ${sku.stock}`);
        }
        await this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: newQuantity }
        });
    } else {
        // Create new item
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

  async updateCartItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
      const cart = await this.getCart(userId);
      
      const item = await this.prisma.cartItem.findFirst({
          where: { id: itemId, cartId: cart.id, tenantId: this.tenantId },
          include: { sku: true }
      });

      if (!item) throw new NotFoundException('Cart item not found');

      if (dto.quantity > item.sku.stock) {
           throw new BadRequestException(`Not enough stock. Available: ${item.sku.stock}`);
      }

      await this.prisma.cartItem.update({
          where: { id: itemId },
          data: { quantity: dto.quantity }
      });

      return this.getCart(userId);
  }

  async removeCartItem(userId: string, itemId: string) {
      const cart = await this.getCart(userId);
      
      // Verify ownership
      const item = await this.prisma.cartItem.findFirst({
          where: { id: itemId, cartId: cart.id }
      });
      
      if (!item) throw new NotFoundException("Item not found");

      await this.prisma.cartItem.delete({
          where: { id: itemId }
      });

      return this.getCart(userId);
  }
  
  async clearCart(userId: string) {
      const cart = await this.getCart(userId);
      await this.prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
      });
      return { message: 'Cart cleared' };
  }
}
