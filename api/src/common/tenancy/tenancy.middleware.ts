import { Injectable, NestMiddleware, NotFoundException, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  constructor(
    private readonly cls: ClsService,
    private readonly prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
       // For public routes (like login/register specific endpoint), we might might skip this?
       // But for a strict multi-tenant system, usually we need to know the context.
       // Let's assume for now 400 if missing, except maybe for health checks.
       // Or simpler: Just proceed with undefined if it's not a protected route, 
       // but Guards will enforce it later. 
       // Better: Enforce it here for simplicity of Phase 3.
       throw new BadRequestException('X-Tenant-Id header is required');
    }

    // Verify Tenant
    // Optimization: Cache this lookup in Redis in Phase 4.
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Set Context
    this.cls.set('TENANT_ID', tenant.id);
    this.cls.set('TENANT', tenant);

    next();
  }
}
