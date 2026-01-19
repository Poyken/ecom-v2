import { PaymentResponseDto } from '@ecommerce/shared';

// Interface for Strategy Pattern
export interface PaymentProvider {
    process(orderId: string, amount: number, metadata?: any): Promise<PaymentResponseDto>;
    getProviderName(): string;
}
