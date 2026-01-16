import { Injectable, CanActivate, ExecutionContext, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Try to get tenantId from user or header
    let tenantId = request.user?.tenantId;
    
    if (!tenantId) {
      tenantId = request.headers['x-tenant-id'];
    }

    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }

    // Verify tenant exists and is active
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, isActive: true, deletedAt: true },
    });

    if (!tenant) {
      throw new ForbiddenException('Invalid tenant');
    }

    if (!tenant.isActive || tenant.deletedAt) {
      throw new ForbiddenException('Tenant is not active');
    }

    // Attach tenantId to request for later use
    request.tenantId = tenantId;

    return true;
  }
}
