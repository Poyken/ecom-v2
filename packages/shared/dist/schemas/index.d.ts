import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    name?: string | undefined;
}, {
    id: string;
    email: string;
    name?: string | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const TenantSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    slug: string;
}, {
    id: string;
    name: string;
    slug: string;
}>;
export * from './catalog/category.schema';
export * from './catalog/brand.schema';
export * from './catalog/product.schema';
export * from './catalog/sku.schema';
export * from './cart.schema';
export * from './order.schema';
export * from './inventory.schema';
export * from './payment.schema';
export * from './promotion.schema';
