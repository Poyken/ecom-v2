import { z } from 'zod';
export declare const SkuOptionValueSchema: z.ZodObject<{
    optionName: z.ZodString;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    optionName: string;
}, {
    value: string;
    optionName: string;
}>;
export declare const CreateSkuSchema: z.ZodObject<{
    productId: z.ZodString;
    skuCode: z.ZodString;
    price: z.ZodNumber;
    stock: z.ZodDefault<z.ZodNumber>;
    optionValues: z.ZodOptional<z.ZodArray<z.ZodObject<{
        optionName: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        optionName: string;
    }, {
        value: string;
        optionName: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    productId: string;
    skuCode: string;
    price: number;
    stock: number;
    optionValues?: {
        value: string;
        optionName: string;
    }[] | undefined;
}, {
    productId: string;
    skuCode: string;
    price: number;
    stock?: number | undefined;
    optionValues?: {
        value: string;
        optionName: string;
    }[] | undefined;
}>;
export declare const UpdateSkuSchema: z.ZodObject<Omit<{
    productId: z.ZodOptional<z.ZodString>;
    skuCode: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    stock: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    optionValues: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        optionName: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        optionName: string;
    }, {
        value: string;
        optionName: string;
    }>, "many">>>;
}, "productId" | "skuCode">, "strip", z.ZodTypeAny, {
    price?: number | undefined;
    stock?: number | undefined;
    optionValues?: {
        value: string;
        optionName: string;
    }[] | undefined;
}, {
    price?: number | undefined;
    stock?: number | undefined;
    optionValues?: {
        value: string;
        optionName: string;
    }[] | undefined;
}>;
export type CreateSkuDto = z.infer<typeof CreateSkuSchema>;
export type UpdateSkuDto = z.infer<typeof UpdateSkuSchema>;
