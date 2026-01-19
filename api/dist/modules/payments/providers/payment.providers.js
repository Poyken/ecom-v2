"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankTransferProvider = exports.CodProvider = void 0;
class CodProvider {
    getProviderName() {
        return 'COD';
    }
    async process(orderId, amount) {
        return {
            status: 'PENDING',
            message: 'Order placed with Cash on Delivery',
            action: { type: 'NONE' }
        };
    }
}
exports.CodProvider = CodProvider;
class BankTransferProvider {
    getProviderName() {
        return 'BANK_TRANSFER';
    }
    async process(orderId, amount) {
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
exports.BankTransferProvider = BankTransferProvider;
//# sourceMappingURL=payment.providers.js.map