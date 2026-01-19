import { z } from 'zod';
export declare const LoyaltyTransactionType: z.ZodEnum<["EARN_ORDER", "REDEEM_REWARD", "ADJUSTMENT", "EXPIRATION", "REFUND_DEDUCTION"]>;
export declare const LoyaltyRewardType: z.ZodEnum<["VOUCHER_DISCOUNT", "PHYSICAL_GIFT"]>;
export declare const CreateLoyaltyProgramSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    ratePerUnitCurrency: z.ZodNumber;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    ratePerUnitCurrency: number;
    description?: string | undefined;
    isActive?: boolean | undefined;
}, {
    name: string;
    ratePerUnitCurrency: number;
    description?: string | undefined;
    isActive?: boolean | undefined;
}>;
export declare const UpdateLoyaltyProgramSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    ratePerUnitCurrency: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    ratePerUnitCurrency?: number | undefined;
    isActive?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    ratePerUnitCurrency?: number | undefined;
    isActive?: boolean | undefined;
}>;
export declare const CreateLoyaltyTierSchema: z.ZodObject<{
    name: z.ZodString;
    minSpend: z.ZodNumber;
    benefits: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    programId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    minSpend: number;
    programId: string;
    benefits?: string[] | undefined;
}, {
    name: string;
    minSpend: number;
    programId: string;
    benefits?: string[] | undefined;
}>;
export declare const UpdateLoyaltyTierSchema: z.ZodObject<Omit<{
    name: z.ZodOptional<z.ZodString>;
    minSpend: z.ZodOptional<z.ZodNumber>;
    benefits: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    programId: z.ZodOptional<z.ZodString>;
}, "programId">, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    minSpend?: number | undefined;
    benefits?: string[] | undefined;
}, {
    name?: string | undefined;
    minSpend?: number | undefined;
    benefits?: string[] | undefined;
}>;
export declare const CreateLoyaltyRewardSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    pointsCost: z.ZodNumber;
    type: z.ZodEnum<["VOUCHER_DISCOUNT", "PHYSICAL_GIFT"]>;
    value: z.ZodOptional<z.ZodNumber>;
    maxRedemptionsPerUser: z.ZodOptional<z.ZodNumber>;
    programId: z.ZodString;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "VOUCHER_DISCOUNT" | "PHYSICAL_GIFT";
    programId: string;
    pointsCost: number;
    description?: string | undefined;
    isActive?: boolean | undefined;
    value?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
}, {
    name: string;
    type: "VOUCHER_DISCOUNT" | "PHYSICAL_GIFT";
    programId: string;
    pointsCost: number;
    description?: string | undefined;
    isActive?: boolean | undefined;
    value?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
}>;
export declare const UpdateLoyaltyRewardSchema: z.ZodObject<Omit<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    pointsCost: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodEnum<["VOUCHER_DISCOUNT", "PHYSICAL_GIFT"]>>;
    value: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    maxRedemptionsPerUser: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    programId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, "programId">, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    value?: number | undefined;
    type?: "VOUCHER_DISCOUNT" | "PHYSICAL_GIFT" | undefined;
    pointsCost?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    value?: number | undefined;
    type?: "VOUCHER_DISCOUNT" | "PHYSICAL_GIFT" | undefined;
    pointsCost?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
}>;
export declare const RedeemRewardSchema: z.ZodObject<{
    rewardId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rewardId: string;
}, {
    rewardId: string;
}>;
