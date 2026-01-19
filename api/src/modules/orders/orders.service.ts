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
    return this.cls.get('tenantId');
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
        // 1. Create Order
        const newOrder = await tx.order.create({
            data: {
                userId,
                tenantId: this.tenantId,
                status: 'PENDING',
                paymentStatus: 'UNPAID',
                paymentMethod,
                totalAmount,
                // shippingFee: 0, // Default 0 for now
                // recipientName: ... need address to fill this. 
                // For MVP, if addressId is missing, we might fail or mock.
                // Schema requires: recipientName, phoneNumber, street, city...
                // So we MUST have an address.
                
                // Workaround: Look up Address or User Profile?
                // Plan said "addressId, paymentMethod, note".
                // Let's assume addressId is provided OR fetch default address.
                
                ...await this.getAddressData(tx, userId, addressId), // Function to get address details

                items: {
                    create: orderItemsData
                }
            }
        });

        // 2. Reduce Stock (Using InventoryService)
        for (const item of cart.items) {
            await this.inventoryService.adjustStock(
                item.skuId,
                {
                    quantity: -item.quantity, // Negative for sale
                    type: 'SALE',
                    reason: `Order #${newOrder.id}`,
                    // warehouseId: undefined (Service picks Default)
                },
                tx // Pass transaction
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
        include: { items: true, address: true }
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new BadRequestException('Not authorized'); // Simple check
    return order;
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
}
