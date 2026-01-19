import { PaymentsService } from './payments.service';
import type { ProcessPaymentDto } from '@ecommerce/shared';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    process(dto: ProcessPaymentDto): Promise<{
        status: "PENDING" | "COMPLETED" | "FAILED";
        message?: string | undefined;
        transactionId?: string | undefined;
        action?: {
            type: "REDIRECT" | "DISPLAY_INFO" | "NONE";
            payload?: any;
        } | undefined;
    }>;
}
