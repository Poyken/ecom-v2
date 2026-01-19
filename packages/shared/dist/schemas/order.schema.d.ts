import { z } from 'zod';
export declare const CreateOrderSchema: z.ZodObject<{
    addressId: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodDefault<z.ZodEnum<["COD", "BANK_TRANSFER"]>>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    paymentMethod: "COD" | "BANK_TRANSFER";
    addressId?: string | undefined;
    note?: string | undefined;
}, {
    addressId?: string | undefined;
    paymentMethod?: "COD" | "BANK_TRANSFER" | undefined;
    note?: string | undefined;
}>;
export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
