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
    brandId: z.ZodString;
    categoryIds: z.ZodArray<z.ZodString, "many">;
    description: z.ZodOptional<z.ZodString>;
    metaTitle: z.ZodOptional<z.ZodString>;
    metaDescription: z.ZodOptional<z.ZodString>;
    metaKeywords: z.ZodOptional<z.ZodString>;
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
    skus: z.ZodOptional<z.ZodArray<z.ZodObject<{
        price: z.ZodNumber;
        stock: z.ZodNumber;
        optionValues: z.ZodArray<z.ZodObject<{
            optionName: z.ZodString;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            optionName: string;
        }, {
            value: string;
            optionName: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        price: number;
        stock: number;
        optionValues: {
            value: string;
            optionName: string;
        }[];
    }, {
        price: number;
        stock: number;
        optionValues: {
            value: string;
            optionName: string;
        }[];
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    brandId: string;
    categoryIds: string[];
    options?: {
        name: string;
        values: string[];
    }[] | undefined;
    description?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    skus?: {
        price: number;
        stock: number;
        optionValues: {
            value: string;
            optionName: string;
        }[];
    }[] | undefined;
}, {
    name: string;
    brandId: string;
    categoryIds: string[];
    options?: {
        name: string;
        values: string[];
    }[] | undefined;
    description?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    skus?: {
        price: number;
        stock: number;
        optionValues: {
            value: string;
            optionName: string;
        }[];
    }[] | undefined;
}>;
export declare const UpdateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    brandId: z.ZodOptional<z.ZodString>;
    categoryIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaTitle: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaKeywords: z.ZodOptional<z.ZodOptional<z.ZodString>>;
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
    skus: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        price: z.ZodNumber;
        stock: z.ZodNumber;
        optionValues: z.ZodArray<z.ZodObject<{
            optionName: z.ZodString;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            optionName: string;
        }, {
            value: string;
            optionName: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        price: number;
        stock: number;
        optionValues: {
            value: string;
            optionName: string;
        }[];
    }, {
        price: number;
        stock: number;
        optionValues: {
            value: string;
            optionName: string;
        }[];
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    options?: {
        name: string;
        values: string[];
    }[] | undefined;
    brandId?: string | undefined;
    categoryIds?: string[] | undefined;
    description?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    skus?: {
        price: number;
        stock: number;
        optionValues: {
            value: string;
            optionName: string;
        }[];
    }[] | undefined;
}, {
    name?: string | undefined;
    options?: {
        name: string;
        values: string[];
    }[] | undefined;
    brandId?: string | undefined;
    categoryIds?: string[] | undefined;
    description?: string | undefined;
    metaTitle?: string | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    skus?: {
        price: number;
        stock: number;
        optionValues: {
            value: string;
            optionName: string;
        }[];
    }[] | undefined;
}>;
export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
