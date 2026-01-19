import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import type { ProcessPaymentDto, PaymentResponseDto } from '@ecommerce/shared';
import { PaymentProvider } from './interfaces/payment-provider.interface';
import { CodProvider, BankTransferProvider } from './providers/payment.providers';

@Injectable()
export class PaymentsService {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {
      // Register Providers
      this.registerProvider(new CodProvider());
      this.registerProvider(new BankTransferProvider());
      // potentially inject more providers later
  }

  private registerProvider(provider: PaymentProvider) {
      this.providers.set(provider.getProviderName(), provider);
  }

  private get tenantId() {
    return this.cls.get('tenantId');
  }

  async processPayment(dto: ProcessPaymentDto): Promise<PaymentResponseDto> {
    const { orderId, method } = dto;

    // 1. Get Order
    const order = await this.prisma.order.findUnique({
        where: { id: orderId, tenantId: this.tenantId }
    });
    if (!order) throw new BadRequestException('Order not found');
    if (order.paymentStatus === 'PAID') throw new BadRequestException('Order already paid');

    // 2. Select Provider
    const provider = this.providers.get(method);
    if (!provider) throw new BadRequestException(`Payment method ${method} not supported`);

    // 3. Process
    const result = await provider.process(orderId, Number(order.totalAmount));

    // 4. Save Payment Record
    await this.prisma.payment.create({
        data: {
            tenantId: this.tenantId,
            orderId: orderId,
            amount: order.totalAmount,
            paymentMethod: method, // Fixed field name
            status: result.status as any, // Cast to Enum (PENDING/COMPLETED/FAILED)
            providerTransactionId: result.transactionId || `TX-${Date.now()}`, // Fixed field name
            metadata: result.action?.payload || {},
            // paymentDate: new Date() // Field removed in schema? Check schema. 
            // Schema has `paidAt`, `createdAt`.
            paidAt: result.status === 'COMPLETED' ? new Date() : null
        }
    });

    // 5. Update Order Payment Status if Completed (e.g. Wallet)
    if (result.status === 'COMPLETED') {
        await this.prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'PAID' }
        });
    }

    return result;
  }
}
