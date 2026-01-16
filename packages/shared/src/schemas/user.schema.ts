import { z } from 'zod';

/**
 * User Schema - Represents a user in the system
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1).max(100).nullable(),
  lastName: z.string().min(1).max(100).nullable(),
  phone: z.string().max(20).nullable(),
  avatarUrl: z.string().url().nullable(),
  isEmailVerified: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
  loyaltyPoints: z.number().int().default(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});
export type User = z.infer<typeof UserSchema>;

/**
 * Create User Schema - For registration
 */
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

/**
 * Login Schema
 */
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  twoFactorCode: z.string().length(6).optional(),
});
export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Update User Schema
 */
export const UpdateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
  avatarUrl: z.string().url().optional(),
});
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

/**
 * Address Schema
 */
export const AddressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fullName: z.string().min(1).max(200),
  phone: z.string().max(20),
  street: z.string().min(1).max(500),
  ward: z.string().max(100).nullable(),
  district: z.string().max(100),
  province: z.string().max(100),
  postalCode: z.string().max(20).nullable(),
  country: z.string().max(100).default('Vietnam'),
  isDefault: z.boolean().default(false),
});
export type Address = z.infer<typeof AddressSchema>;

/**
 * Create Address Schema
 */
export const CreateAddressSchema = AddressSchema.omit({ id: true, userId: true });
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;
