import { z } from 'zod';
export declare const ProcessPaymentSchema: z.ZodObject<{
    orderId: z.ZodString;
    method: z.ZodEnum<["COD", "BANK_TRANSFER", "MOMO", "STRIPE", "ZALOPAY"]>;
}, "strip", z.ZodTypeAny, {
    orderId: string;
    method: "COD" | "BANK_TRANSFER" | "MOMO" | "STRIPE" | "ZALOPAY";
}, {
    orderId: string;
    method: "COD" | "BANK_TRANSFER" | "MOMO" | "STRIPE" | "ZALOPAY";
}>;
export declare const PaymentResponseSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "COMPLETED", "FAILED"]>;
    transactionId: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["REDIRECT", "DISPLAY_INFO", "NONE"]>;
        payload: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        type: "REDIRECT" | "DISPLAY_INFO" | "NONE";
        payload?: any;
    }, {
        type: "REDIRECT" | "DISPLAY_INFO" | "NONE";
        payload?: any;
    }>>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "COMPLETED" | "FAILED";
    message?: string | undefined;
    transactionId?: string | undefined;
    action?: {
        type: "REDIRECT" | "DISPLAY_INFO" | "NONE";
        payload?: any;
    } | undefined;
}, {
    status: "PENDING" | "COMPLETED" | "FAILED";
    message?: string | undefined;
    transactionId?: string | undefined;
    action?: {
        type: "REDIRECT" | "DISPLAY_INFO" | "NONE";
        payload?: any;
    } | undefined;
}>;
export type ProcessPaymentDto = z.infer<typeof ProcessPaymentSchema>;
export type PaymentResponseDto = z.infer<typeof PaymentResponseSchema>;
