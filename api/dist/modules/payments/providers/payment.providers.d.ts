import { PaymentProvider } from '../interfaces/payment-provider.interface';
import { PaymentResponseDto } from '@ecommerce/shared';
export declare class CodProvider implements PaymentProvider {
    getProviderName(): string;
    process(orderId: string, amount: number): Promise<PaymentResponseDto>;
}
export declare class BankTransferProvider implements PaymentProvider {
    getProviderName(): string;
    process(orderId: string, amount: number): Promise<PaymentResponseDto>;
}
