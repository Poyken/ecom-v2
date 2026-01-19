import { z } from 'zod';
export declare const CreateOrderSchema: z.ZodObject<{
    addressId: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodEnum<["COD", "BANK_TRANSFER", "STRIPE", "PAYPAL"]>;
    voucherCode: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    paymentMethod: "COD" | "BANK_TRANSFER" | "STRIPE" | "PAYPAL";
    addressId?: string | undefined;
    voucherCode?: string | undefined;
    note?: string | undefined;
}, {
    paymentMethod: "COD" | "BANK_TRANSFER" | "STRIPE" | "PAYPAL";
    addressId?: string | undefined;
    voucherCode?: string | undefined;
    note?: string | undefined;
}>;
export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
export declare const UpdateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "COMPLETED"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED" | "COMPLETED";
    notes?: string | undefined;
}, {
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED" | "COMPLETED";
    notes?: string | undefined;
}>;
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>;
