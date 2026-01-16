import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

/**
 * Extract tenantId from request
 * First checks user.tenantId, then headers['x-tenant-id']
 * Usage: @TenantId() tenantId: string
 */
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    
    // First try to get from authenticated user
    const userTenantId = request.user?.tenantId;
    if (userTenantId) {
      return userTenantId;
    }
    
    // Then try header
    const headerTenantId = request.headers['x-tenant-id'];
    if (headerTenantId) {
      return headerTenantId as string;
    }
    
    throw new BadRequestException('Tenant ID is required');
  },
);
