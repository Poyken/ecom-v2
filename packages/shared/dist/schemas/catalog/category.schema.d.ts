import { z } from 'zod';
export declare const CreateCategorySchema: z.ZodObject<{
    name: z.ZodString;
    parentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
    metaDescription: z.ZodOptional<z.ZodString>;
    metaKeywords: z.ZodOptional<z.ZodString>;
    metaTitle: z.ZodOptional<z.ZodString>;
    imageId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    metaTitle?: string | undefined;
    imageId?: string | undefined;
    parentId?: string | null | undefined;
}, {
    name: string;
    description?: string | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    metaTitle?: string | undefined;
    imageId?: string | undefined;
    parentId?: string | null | undefined;
}>;
export declare const UpdateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaKeywords: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaTitle: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    imageId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    metaTitle?: string | undefined;
    imageId?: string | undefined;
    parentId?: string | null | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    metaDescription?: string | undefined;
    metaKeywords?: string | undefined;
    metaTitle?: string | undefined;
    imageId?: string | undefined;
    parentId?: string | null | undefined;
}>;
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
