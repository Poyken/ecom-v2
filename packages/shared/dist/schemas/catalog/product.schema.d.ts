import { z } from 'zod';
export declare const ProductOptionSchema: z.ZodObject<{
    name: z.ZodString;
    values: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    values: string[];
}, {
    name: string;
    values: string[];
}>;
export declare const CreateProductSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    brandId: z.ZodString;
    categoryIds: z.ZodArray<z.ZodString, "many">;
    metaDescription: z.ZodOptional<z.ZodString>;
    metaKeywords: z.ZodOptional<z.ZodString>;
    metaTitle: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        values: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        values: string[];
    }, {
        name: string;
        values: string[];
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    brandId: string;
    categoryIds: string[];
    options?: {
        name: string;
        values: string[];
    }[] | undefined;
    price?: number | undefined;
    description?: string | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    metaTitle?: string | undefined;
}, {
    name: string;
    brandId: string;
    categoryIds: string[];
    options?: {
        name: string;
        values: string[];
    }[] | undefined;
    price?: number | undefined;
    description?: string | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    metaTitle?: string | undefined;
}>;
export declare const UpdateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    brandId: z.ZodOptional<z.ZodString>;
    categoryIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    metaDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaKeywords: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaTitle: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    price: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    options: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        values: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        values: string[];
    }, {
        name: string;
        values: string[];
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    options?: {
        name: string;
        values: string[];
    }[] | undefined;
    price?: number | undefined;
    description?: string | undefined;
    brandId?: string | undefined;
    categoryIds?: string[] | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    metaTitle?: string | undefined;
}, {
    name?: string | undefined;
    options?: {
        name: string;
        values: string[];
    }[] | undefined;
    price?: number | undefined;
    description?: string | undefined;
    brandId?: string | undefined;
    categoryIds?: string[] | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    metaTitle?: string | undefined;
}>;
export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
