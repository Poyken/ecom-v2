import { z } from 'zod';

export const ConfigValidationSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  PORT: z.coerce.number().default(8080),
  JWT_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  FRONTEND_URL: z.string().url(),
});

export const validate = (config: Record<string, unknown>) => {
  const result = ConfigValidationSchema.safeParse(config);
  if (!result.success) {
    throw new Error('Config validation error: ' + result.error.message);
  }
  return result.data;
};
