import { z } from 'zod';
export declare const AddToCartSchema: z.ZodObject<{
    skuId: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    skuId: string;
    quantity: number;
}, {
    skuId: string;
    quantity: number;
}>;
export declare const UpdateCartItemSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
}, {
    quantity: number;
}>;
export type AddToCartDto = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemDto = z.infer<typeof UpdateCartItemSchema>;
