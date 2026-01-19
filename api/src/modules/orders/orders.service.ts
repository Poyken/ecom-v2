import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import { CartService } from '../cart/cart.service';
import type { CreateOrderDto } from '@ecommerce/shared';

import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
    private readonly cartService: CartService,
    private readonly inventoryService: InventoryService,
  ) {}

  private get tenantId() {
    return this.cls.get('TENANT_ID');
  }

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { addressId, paymentMethod, note } = createOrderDto;

    // Get Cart
    const cart = await this.cartService.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
    }

    // Calculate Totals
    let totalAmount = 0;
    const orderItemsData: any[] = [];

    // Verify Stock & Calculate
    for (const item of cart.items) {
        if (item.sku.stock < item.quantity) {
             throw new BadRequestException(`Product ${item.sku.product.name} (SKU: ${item.sku.skuCode}) is out of stock`);
        }
        
        const price = Number(item.sku.price); 
        // Note: Prisma Schema says price is Decimal?. Shared Schema says number. 
        // We need to handle this carefully.
        // Assuming price exists.
        
        if (!price) throw new BadRequestException(`SKU ${item.sku.skuCode} has no price`);

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
                totalAmount,
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
        
        for (const item of cart.items) {
            await this.inventoryService.reserveStock(
                item.skuId,
                defaultWh.id,
                item.quantity,
                tx
            );
        }

        // 3. Clear Cart
        await tx.cartItem.deleteMany({
            where: { cartId: cart.id }
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
      await tx.orderLog.create({
        data: {
          orderId,
          status,
          notes,
          userId,
        }
      });

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

