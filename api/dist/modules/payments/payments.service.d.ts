import { PrismaService } from '../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import type { ProcessPaymentDto, PaymentResponseDto } from '@ecommerce/shared';
export declare class PaymentsService {
    private readonly prisma;
    private readonly cls;
    private providers;
    constructor(prisma: PrismaService, cls: ClsService);
    private registerProvider;
    private get tenantId();
    processPayment(dto: ProcessPaymentDto): Promise<PaymentResponseDto>;
}
