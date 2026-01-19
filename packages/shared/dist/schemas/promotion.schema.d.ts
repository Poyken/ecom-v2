import { z } from 'zod';
export declare const PromotionTypeSchema: z.ZodEnum<["AUTOMATIC", "VOUCHER"]>;
export declare const PromotionRuleTypeSchema: z.ZodEnum<["MIN_ORDER_VALUE", "SPECIFIC_PRODUCT", "SPECIFIC_CATEGORY", "SPECIFIC_BRAND"]>;
export declare const PromotionActionTypeSchema: z.ZodEnum<["DISCOUNT_PERCENT", "DISCOUNT_FIXED", "FREE_SHIPPING"]>;
export declare const CreatePromotionRuleSchema: z.ZodObject<{
    type: z.ZodEnum<["MIN_ORDER_VALUE", "SPECIFIC_PRODUCT", "SPECIFIC_CATEGORY", "SPECIFIC_BRAND"]>;
    operator: z.ZodDefault<z.ZodString>;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "MIN_ORDER_VALUE" | "SPECIFIC_PRODUCT" | "SPECIFIC_CATEGORY" | "SPECIFIC_BRAND";
    operator: string;
    value: string;
}, {
    type: "MIN_ORDER_VALUE" | "SPECIFIC_PRODUCT" | "SPECIFIC_CATEGORY" | "SPECIFIC_BRAND";
    value: string;
    operator?: string | undefined;
}>;
export declare const CreatePromotionActionSchema: z.ZodObject<{
    type: z.ZodEnum<["DISCOUNT_PERCENT", "DISCOUNT_FIXED", "FREE_SHIPPING"]>;
    value: z.ZodString;
    maxDiscountAmount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "DISCOUNT_PERCENT" | "DISCOUNT_FIXED" | "FREE_SHIPPING";
    value: string;
    maxDiscountAmount?: number | undefined;
}, {
    type: "DISCOUNT_PERCENT" | "DISCOUNT_FIXED" | "FREE_SHIPPING";
    value: string;
    maxDiscountAmount?: number | undefined;
}>;
export declare const CreatePromotionSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    startDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    endDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    priority: z.ZodDefault<z.ZodNumber>;
    usageLimit: z.ZodOptional<z.ZodNumber>;
    rules: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["MIN_ORDER_VALUE", "SPECIFIC_PRODUCT", "SPECIFIC_CATEGORY", "SPECIFIC_BRAND"]>;
        operator: z.ZodDefault<z.ZodString>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "MIN_ORDER_VALUE" | "SPECIFIC_PRODUCT" | "SPECIFIC_CATEGORY" | "SPECIFIC_BRAND";
        operator: string;
        value: string;
    }, {
        type: "MIN_ORDER_VALUE" | "SPECIFIC_PRODUCT" | "SPECIFIC_CATEGORY" | "SPECIFIC_BRAND";
        value: string;
        operator?: string | undefined;
    }>, "many">;
    actions: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["DISCOUNT_PERCENT", "DISCOUNT_FIXED", "FREE_SHIPPING"]>;
        value: z.ZodString;
        maxDiscountAmount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "DISCOUNT_PERCENT" | "DISCOUNT_FIXED" | "FREE_SHIPPING";
        value: string;
        maxDiscountAmount?: number | undefined;
    }, {
        type: "DISCOUNT_PERCENT" | "DISCOUNT_FIXED" | "FREE_SHIPPING";
        value: string;
        maxDiscountAmount?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    startDate: string | Date;
    endDate: string | Date;
    isActive: boolean;
    priority: number;
    rules: {
        type: "MIN_ORDER_VALUE" | "SPECIFIC_PRODUCT" | "SPECIFIC_CATEGORY" | "SPECIFIC_BRAND";
        operator: string;
        value: string;
    }[];
    actions: {
        type: "DISCOUNT_PERCENT" | "DISCOUNT_FIXED" | "FREE_SHIPPING";
        value: string;
        maxDiscountAmount?: number | undefined;
    }[];
    code?: string | undefined;
    description?: string | undefined;
    usageLimit?: number | undefined;
}, {
    name: string;
    startDate: string | Date;
    endDate: string | Date;
    rules: {
        type: "MIN_ORDER_VALUE" | "SPECIFIC_PRODUCT" | "SPECIFIC_CATEGORY" | "SPECIFIC_BRAND";
        value: string;
        operator?: string | undefined;
    }[];
    actions: {
        type: "DISCOUNT_PERCENT" | "DISCOUNT_FIXED" | "FREE_SHIPPING";
        value: string;
        maxDiscountAmount?: number | undefined;
    }[];
    code?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    priority?: number | undefined;
    usageLimit?: number | undefined;
}>;
export declare const UpdatePromotionSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    startDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    priority: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    usageLimit: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["MIN_ORDER_VALUE", "SPECIFIC_PRODUCT", "SPECIFIC_CATEGORY", "SPECIFIC_BRAND"]>;
        operator: z.ZodDefault<z.ZodString>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "MIN_ORDER_VALUE" | "SPECIFIC_PRODUCT" | "SPECIFIC_CATEGORY" | "SPECIFIC_BRAND";
        operator: string;
        value: string;
    }, {
        type: "MIN_ORDER_VALUE" | "SPECIFIC_PRODUCT" | "SPECIFIC_CATEGORY" | "SPECIFIC_BRAND";
        value: string;
        operator?: string | undefined;
    }>, "many">>;
    actions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["DISCOUNT_PERCENT", "DISCOUNT_FIXED", "FREE_SHIPPING"]>;
        value: z.ZodString;
        maxDiscountAmount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "DISCOUNT_PERCENT" | "DISCOUNT_FIXED" | "FREE_SHIPPING";
        value: string;
        maxDiscountAmount?: number | undefined;
    }, {
        type: "DISCOUNT_PERCENT" | "DISCOUNT_FIXED" | "FREE_SHIPPING";
        value: string;
        maxDiscountAmount?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
    isActive?: boolean | undefined;
    priority?: number | undefined;
    usageLimit?: number | undefined;
    rules?: {
        type: "MIN_ORDER_VALUE" | "SPECIFIC_PRODUCT" | "SPECIFIC_CATEGORY" | "SPECIFIC_BRAND";
        operator: string;
        value: string;
    }[] | undefined;
    actions?: {
        type: "DISCOUNT_PERCENT" | "DISCOUNT_FIXED" | "FREE_SHIPPING";
        value: string;
        maxDiscountAmount?: number | undefined;
    }[] | undefined;
}, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
    isActive?: boolean | undefined;
    priority?: number | undefined;
    usageLimit?: number | undefined;
    rules?: {
        type: "MIN_ORDER_VALUE" | "SPECIFIC_PRODUCT" | "SPECIFIC_CATEGORY" | "SPECIFIC_BRAND";
        value: string;
        operator?: string | undefined;
    }[] | undefined;
    actions?: {
        type: "DISCOUNT_PERCENT" | "DISCOUNT_FIXED" | "FREE_SHIPPING";
        value: string;
        maxDiscountAmount?: number | undefined;
    }[] | undefined;
}>;
export type CreatePromotionDto = z.infer<typeof CreatePromotionSchema>;
export type UpdatePromotionDto = z.infer<typeof UpdatePromotionSchema>;
export type PromotionResponseDto = any;
