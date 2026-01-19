import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
        return false;
    }

    // 1. Fetch user roles from DB (with tenant isolation enforced by Prisma middleware)
    const userRoles = await this.prisma.userRole.findMany({
        where: { userId: user.sub },
        include: { role: true }
    });

    const roles = userRoles.map(ur => ur.role.name);

    // 2. Check if Superadmin (Self-Correction: Superadmin might not have tenantId? 
    // Or belongs to a specific platform tenant? 
    // Usually Superadmin role is global. 
    // For now, check if any role is 'SUPER_ADMIN')
    if (roles.includes('SUPER_ADMIN')) {
        return true;
    }

    const hasRole = requiredRoles.some((role) => roles.includes(role));
    if (!hasRole) {
        throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
