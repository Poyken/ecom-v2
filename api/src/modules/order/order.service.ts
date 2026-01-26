import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { tenantStorage } from '../../common/tenant/tenant.storage';
import { CreateOrderDto } from './dto/order.dto';
import { VnpayService } from './vnpay.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private vnpayService: VnpayService,
  ) {}

  private getTenantId(): string {
    const context = tenantStorage.getStore();
    const tenantId = context?.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is missing in context');
    }
    return tenantId;
  }

  async createOrder(dto: CreateOrderDto, ipAddr: string) {
    const tenantId = this.getTenantId();
    
    // 1. Validate SKUs and Inventory
    const skuIds = dto.items.map(item => item.skuId);
    const skus = await this.prisma.sku.findMany({
      where: { id: { in: skuIds }, tenantId },
      include: { product: true },
    });

    if (skus.length !== skuIds.length) {
      throw new NotFoundException('One or more SKUs not found or belong to another tenant');
    }

    // Check inventory (Simple version: take from primary warehouse or first available)
    // In real B2B, you'd specify warehouse or use a strategy.
    
    let subtotal = 0;
    const orderItemsData = dto.items.map(item => {
      const sku = skus.find(s => s.id === item.skuId);
      if (!sku) throw new NotFoundException('SKU not found'); // Should not happen due to check above
      
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

    const total = subtotal; // Simplified (no tax/shipping logic yet)
    const orderNumber = `ORD-${Date.now()}`;

    return this.prisma.$transaction(async (tx) => {
      // 2. Create Order
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

      // 3. Create Payment record
      await tx.payment.create({
        data: {
          tenantId,
          orderId: order.id,
          gateway: dto.paymentGateway,
          amount: total,
          status: 'pending',
        },
      });

      // 4. Generate VNPay URL if needed
      let paymentUrl: string | undefined;
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

  async getOrderDetails(id: string) {
    const tenantId = this.getTenantId();
    const order = await this.prisma.order.findUnique({
      where: { id, tenantId },
      include: {
        items: true,
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async listTenantOrdersByStatus(status?: string) {
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

  // --- Webhook / IPN Logic ---
  async handleVnpayIpn(query: any) {
    // In a real app, you would verify the secure hash here using VnpayService
    const orderId = query.vnp_TxnRef;
    const vnp_ResponseCode = query.vnp_ResponseCode;

    if (vnp_ResponseCode === '00') {
      // Success
      await this.prisma.$transaction([
        this.prisma.payment.updateMany({
          where: { orderId, gateway: 'vnpay' },
          data: { status: 'completed', processedAt: new Date(), gatewayResponse: query },
        }),
        this.prisma.order.update({
          where: { id: orderId },
          data: { status: 'processing' }, // Order moves from pending to processing
        }),
      ]);
    } else {
      // Failed
      await this.prisma.payment.updateMany({
        where: { orderId, gateway: 'vnpay' },
        data: { status: 'failed', gatewayResponse: query },
      });
    }

    return { RspCode: '00', Message: 'Confirm Success' };
  }
}
