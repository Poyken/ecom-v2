import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import { CartService } from '../cart/cart.service';
import type { CreateOrderDto } from '@ecommerce/shared';

import { InventoryService } from '../inventory/inventory.service';
import { PromotionsService } from '../promotions/promotions.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
    private readonly cartService: CartService,
    private readonly inventoryService: InventoryService,
    private readonly promotionsService: PromotionsService,
    private readonly loyaltyService: LoyaltyService,
    private readonly notificationsService: NotificationsService,
  ) {}

  private get tenantId() {
    return this.cls.get('TENANT_ID');
  }

  async create(createOrderDto: CreateOrderDto) {
    const userId = this.cls.get('USER_ID');
    const tenantId = this.cls.get('TENANT_ID');
    const { addressId, paymentMethod, voucherCode } = createOrderDto;

    // Get Cart (Calculates subTotal and discounts)
    const cartData = await this.cartService.getCart(userId, voucherCode);
    if (!cartData.items || cartData.items.length === 0) {
        throw new BadRequestException('Cart is empty');
    }

    const { subTotal, totalAmount, discountAmount, appliedPromotions } = cartData;
    const orderItemsData: any[] = [];

    // Verify Stock & Prepare Item Data
    for (const item of cartData.items) {
        if (item.sku.stock < item.quantity) {
             throw new BadRequestException(`Product ${item.sku.product.name} (SKU: ${item.sku.skuCode}) is out of stock`);
        }
        
        const price = Number(item.sku.price); 
        if (!price) throw new BadRequestException(`SKU ${item.sku.skuCode} has no price`);

        const lineTotal = price * item.quantity;

        orderItemsData.push({
            skuId: item.skuId,
            productName: item.sku.product.name,
            skuCode: item.sku.skuCode,
            quantity: item.quantity,
            priceAtPurchase: price,
            tenantId: this.tenantId
        });
    }

    // Create Order with Transaction
    const order = await this.prisma.$transaction(async (tx) => {
        const addressData = await this.getAddressData(tx, userId, addressId);

        // 1. Create Order
        const newOrder = await tx.order.create({
            data: {
                userId,
                tenantId: this.tenantId,
                status: 'PENDING',
                paymentStatus: 'UNPAID',
                paymentMethod,
                subTotal,
                totalAmount,
                discountAmount,
                recipientName: addressData.recipientName,
                phoneNumber: addressData.phoneNumber,
                shippingAddress: addressData.shippingAddress,
                shippingCity: addressData.shippingCity,
                shippingDistrict: addressData.shippingDistrict,
                shippingWard: addressData.shippingWard,
                shippingPhone: addressData.shippingPhone,
                addressId: addressData.addressId,
                items: {
                    create: orderItemsData
                }
            }
        });

        // 2. Reserve Stock (Using InventoryService)
        // For MVP, we reserve from the default warehouse
        const defaultWh = await this.inventoryService.findDefaultWarehouse(tx);
        
        for (const item of cartData.items) {
            await this.inventoryService.reserveStock(
                item.skuId,
                defaultWh.id,
                item.quantity,
                tx
            );
        }

        // 3. Record Promotion Usage
        for (const applied of appliedPromotions) {
            await tx.promotionUsage.create({
                data: {
                    promotionId: applied.id,
                    userId,
                    orderId: newOrder.id,
                    discountAmount: applied.discount,
                    tenantId: this.tenantId
                }
            });
            
            // 4. Update usedCount
            await tx.promotion.update({
                where: { id: applied.id },
                data: { usedCount: { increment: 1 } }
            });
        }

        // 5. Clear Cart
        await tx.cartItem.deleteMany({
            where: { cartId: cartData.id }
        });

        return newOrder;
    });

    return order;
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId, tenantId: this.tenantId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id, tenantId: this.tenantId },
      include: { items: true, address: true, logs: { orderBy: { createdAt: 'desc' }, include: { user: { select: { firstName: true, lastName: true } } } } }
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(orderId: string, status: any, notes: string, userId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId, tenantId: this.tenantId },
        include: { items: true }
      });

      if (!order) throw new NotFoundException('Order not found');

      // 1. Logic Check (Transitions)
      if (order.status === 'CANCELLED') throw new BadRequestException('Cannot update a cancelled order');
      if (order.status === 'COMPLETED') throw new BadRequestException('Cannot update a completed order');

      // 2. Inventory Side Effects
      if (status === 'SHIPPED' && order.status !== 'SHIPPED') {
        // Fulfill Stock: Deduct physical, release committed
        const defaultWh = await this.inventoryService.findDefaultWarehouse(tx);
        for (const item of order.items) {
          await this.inventoryService.fulfillStock(item.skuId, defaultWh.id, item.quantity, tx);
        }
      } else if (status === 'CANCELLED') {
        // Release Stock: Release committed, physical stays same
        // Only if it was reserved but not yet fulfilled (PENDING, PROCESSING)
        if (order.status === 'PENDING' || order.status === 'PROCESSING') {
          const defaultWh = await this.inventoryService.findDefaultWarehouse(tx);
          for (const item of order.items) {
            await this.inventoryService.releaseStock(item.skuId, defaultWh.id, item.quantity, tx);
          }
        }
      }

      // 3. Update Order
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { 
          status,
          // If status is SHIPPED, maybe set shipping info? 
          // For now just status.
        }
      });

      // 4. Create Log
      await this.prisma.orderLog.create({
      data: {
        orderId,
        status,
        notes: notes,
        userId: userId,
      },
    });

    // Loyalty Points Logic
    if (status === 'DELIVERED' || status === 'COMPLETED') {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (order && order.userId) {
            // Get program rate. Default 1000 VND = 1 Point if not configured? 
            // Or let LoyaltyService handle calculation.
            // Current LoyaltyService.earnPoints takes amount.
            // Let's assume 1000:1 for now or fetching program details.
            
            // Fetch program to value rate
            const program = await this.loyaltyService.getProgram(this.tenantId);
            const rate = Number(program?.ratePerUnitCurrency) || 1000;
            const points = Math.floor(Number(order.totalAmount) / rate);

            if (points > 0) {
                 // Check if already earned? (This is a simple check, in robust system check tx)
                 // For now just call earn.
                 await this.loyaltyService.earnPoints(
                     this.tenantId, 
                     order.userId, 
                     points, 
                     order.id, 
                     `Points for order #${order.id}`
                 );
            }
        }
    }

    // Notification Logic
    if (order.userId) {
        let title = '';
        let body = '';
        
        switch (status) {
            case 'CONFIRMED':
                title = 'Order Confirmed';
                body = `Your order #${order.id.slice(0, 8).toUpperCase()} has been confirmed!`;
                break;
            case 'SHIPPED':
                title = 'Order Shipped';
                body = `Your order #${order.id.slice(0, 8).toUpperCase()} checks out our warehouse and is on its way.`;
                break;
            case 'DELIVERED':
                title = 'Order Delivered';
                body = `Your order #${order.id.slice(0, 8).toUpperCase()} has been delivered. Enjoy!`;
                break;
            case 'CANCELLED':
                 title = 'Order Cancelled';
                 body = `Your order #${order.id.slice(0, 8).toUpperCase()} has been cancelled.`;
                 break;
        }

        if (title) {
            await this.notificationsService.create(
                order.userId,
                NotificationType.ORDER,
                title,
                body,
                { orderId: order.id }
            );
        }
    }

    return updatedOrder;
    });
  }

  // Helper to get address data
  private async getAddressData(tx: any, userId: string, addressId?: string) {
      let address;
      if (addressId) {
          address = await tx.address.findUnique({ where: { id: addressId } });
      } else {
          // Get default
          address = await tx.address.findFirst({ where: { userId, isDefault: true } });
          if (!address) {
              // Get any address
               address = await tx.address.findFirst({ where: { userId } });
          }
      }

      if (!address) {
          // Fallback / Error?
          // Schema requires recipientName, phoneNumber, etc. not null.
          // If no address, we can't create order.
          throw new BadRequestException('Please provide a delivery address');
      }

      return {
          recipientName: address.recipientName,
          phoneNumber: address.phoneNumber,
          shippingAddress: address.street,
          shippingCity: address.city,
          shippingDistrict: address.district,
          shippingWard: address.ward,
          shippingPhone: address.phoneNumber, // redundant but in schema
          addressId: address.id
      };
  }

  async findAllTenant() {
    return this.prisma.order.findMany({
      where: { tenantId: this.tenantId },
      include: {
        items: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

