import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Require specific permissions to access a route
 * Usage: @Permissions('PRODUCT_CREATE', 'PRODUCT_UPDATE')
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
