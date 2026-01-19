import { z } from 'zod';
export declare const CreateBrandSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    imageId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    imageId?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    imageId?: string | undefined;
}>;
export declare const UpdateBrandSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    imageId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    imageId?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    imageId?: string | undefined;
}>;
export type CreateBrandDto = z.infer<typeof CreateBrandSchema>;
export type UpdateBrandDto = z.infer<typeof UpdateBrandSchema>;
