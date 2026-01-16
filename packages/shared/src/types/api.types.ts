import { z } from 'zod';

/**
 * API Response wrapper
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

/**
 * Paginated Response
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
  });

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

/**
 * Pagination Query
 */
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

/**
 * ID Param
 */
export const IdParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});
export type IdParam = z.infer<typeof IdParamSchema>;

/**
 * Search Query
 */
export const SearchQuerySchema = z.object({
  q: z.string().min(1).max(200).optional(),
});
export type SearchQuery = z.infer<typeof SearchQuerySchema>;

/**
 * Auth Tokens Response
 */
export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int().positive(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
