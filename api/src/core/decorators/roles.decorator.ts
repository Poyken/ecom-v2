import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Require specific roles to access a route
 * Usage: @Roles('ADMIN', 'STAFF')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
