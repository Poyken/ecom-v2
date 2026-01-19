import { PaymentResponseDto } from '@ecommerce/shared';
export interface PaymentProvider {
    process(orderId: string, amount: number, metadata?: any): Promise<PaymentResponseDto>;
    getProviderName(): string;
}
