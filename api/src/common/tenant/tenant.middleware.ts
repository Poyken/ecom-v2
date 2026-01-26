import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantStorage } from './tenant.storage';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;
    const path = req.originalUrl || req.url;

    if (this.isPublicRoute(path)) {
      return tenantStorage.run({ tenantId: tenantId || '' }, () => {
        next();
      });
    }

    if (!tenantId) {
      throw new UnauthorizedException({
        code: 'TENANT_ID_REQUIRED',
        message: 'Tenant ID is required',
      });
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(tenantId)) {
      throw new BadRequestException({
        code: 'INVALID_TENANT_ID',
        message: 'Invalid Tenant ID format',
      });
    }

    tenantStorage.run({ tenantId }, () => {
      next();
    });
  }

  private isPublicRoute(path: string): boolean {
    const publicRoutes = [
      '/health',
      '/metrics',
      '/api/v1/tenants/onboard',
      '/api/v1/auth/login',
      '/api/v1/auth/register',
    ];
    // Check if path starts with any of the public routes
    return publicRoutes.some((route) => path.startsWith(route));
  }
}
