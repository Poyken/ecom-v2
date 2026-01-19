import { PaymentProvider } from '../interfaces/payment-provider.interface';
import { PaymentResponseDto } from '@ecommerce/shared';

export class CodProvider implements PaymentProvider {
    getProviderName(): string {
        return 'COD';
    }

    async process(orderId: string, amount: number): Promise<PaymentResponseDto> {
        // COD always returns success immediately but status is PENDING (unpaid until delivery)
        // Wait, current schema says `PaymentResponseSchema` has PENDING, COMPLETED, FAILED.
        // For COD, the "Process" is successful (we recorded the intent).
        return {
            status: 'PENDING',
            message: 'Order placed with Cash on Delivery',
            action: { type: 'NONE' }
        };
    }
}

export class BankTransferProvider implements PaymentProvider {
    getProviderName(): string {
        return 'BANK_TRANSFER';
    }

    async process(orderId: string, amount: number): Promise<PaymentResponseDto> {
        // Generate QR Code or Bank Info
        const bankInfo = {
            bankName: 'VCB',
            accountNumber: '1234567890',
            accountName: 'ECOMMERCE SHOP',
            amount: amount,
            content: `PAY ORDER ${orderId}`
        };
        
        return {
            status: 'PENDING',
            message: 'Please transfer money to the following bank account',
            action: {
                type: 'DISPLAY_INFO',
                payload: bankInfo
            }
        };
    }
}
