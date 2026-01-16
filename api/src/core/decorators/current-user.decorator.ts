import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserPayload {
  id: string;
  tenantId: string;
  email: string;
  roles: string[];
}

/**
 * Extract current user from request
 * Usage: @CurrentUser() user: CurrentUserPayload
 */
export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserPayload | undefined, ctx: ExecutionContext): CurrentUserPayload | unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserPayload;
    
    if (data) {
      return user?.[data];
    }
    return user;
  },
);
