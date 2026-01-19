import { z } from 'zod';
export declare const ConfigValidationSchema: z.ZodObject<{
    DATABASE_URL: z.ZodString;
    REDIS_URL: z.ZodString;
    PORT: z.ZodDefault<z.ZodNumber>;
    JWT_SECRET: z.ZodString;
    JWT_REFRESH_SECRET: z.ZodString;
    FRONTEND_URL: z.ZodString;
}, "strip", z.ZodTypeAny, {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: number;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    FRONTEND_URL: string;
}, {
    DATABASE_URL: string;
    REDIS_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    FRONTEND_URL: string;
    PORT?: number | undefined;
}>;
