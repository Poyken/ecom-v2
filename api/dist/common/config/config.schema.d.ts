import { z } from 'zod';
export declare const ConfigValidationSchema: z.ZodObject<{
    DATABASE_URL: z.ZodString;
    REDIS_URL: z.ZodString;
    PORT: z.ZodDefault<z.ZodNumber>;
    JWT_SECRET: z.ZodString;
    JWT_REFRESH_SECRET: z.ZodString;
    FRONTEND_URL: z.ZodString;
}, "strip", z.ZodTypeAny, {
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: number;
    FRONTEND_URL: string;
}, {
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    FRONTEND_URL: string;
    PORT?: number | undefined;
}>;
export declare const validate: (config: Record<string, unknown>) => {
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: number;
    FRONTEND_URL: string;
};
