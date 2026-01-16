import { z } from 'zod';
import { TenantPlan } from '../constants/enums.js';

/**
 * Tenant Schema
 */
export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100),
  subdomain: z.string().min(1).max(100),
  customDomain: z.string().max(255).nullable(),
  plan: z.nativeEnum(TenantPlan).default(TenantPlan.BASIC),
  logoUrl: z.string().url().nullable(),
  faviconUrl: z.string().url().nullable(),
  primaryColor: z.string().max(7).nullable(),
  onboardingStep: z.number().int().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});
export type Tenant = z.infer<typeof TenantSchema>;

/**
 * Tenant Settings Schema
 */
export const TenantSettingsSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  
  // Currency & Locale
  currency: z.string().max(3).default('VND'),
  locale: z.string().max(10).default('vi-VN'),
  timezone: z.string().max(50).default('Asia/Ho_Chi_Minh'),
  
  // Shipping
  freeShippingThreshold: z.number().nonnegative().nullable(),
  defaultShippingFee: z.number().nonnegative().default(30000),
  
  // Loyalty
  loyaltyPointRatio: z.number().positive().default(1000), // 1 point per 1000 VND
  loyaltyPointExpireDays: z.number().int().positive().nullable(),
  
  // Email
  orderConfirmationEmail: z.boolean().default(true),
  shippingNotificationEmail: z.boolean().default(true),
  
  // SEO
  googleAnalyticsId: z.string().max(50).nullable(),
  facebookPixelId: z.string().max(50).nullable(),
  
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TenantSettings = z.infer<typeof TenantSettingsSchema>;

/**
 * Create Tenant Schema (Onboarding)
 */
export const CreateTenantSchema = z.object({
  name: z.string().min(1, 'Store name is required').max(200),
  subdomain: z
    .string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
});
export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;

/**
 * Update Tenant Schema
 */
export const UpdateTenantSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  customDomain: z.string().max(255).optional(),
  logoUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
  primaryColor: z.string().max(7).optional(),
});
export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>;
