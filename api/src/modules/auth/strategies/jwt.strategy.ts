import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (!payload.sub || !payload.tenantId) {
        throw new UnauthorizedException();
    }

    // Load permissions for RBAC
    const userRolePermissions = await this.prisma.userRole.findMany({
        where: { userId: payload.sub },
        include: {
            role: {
                include: {
                    permissions: {
                        include: { permission: true }
                    }
                }
            }
        }
    });

    const userDirectPermissions = await this.prisma.userPermission.findMany({
        where: { userId: payload.sub },
        include: { permission: true }
    });

    const permissions = new Set<string>();

    // 1. Add permissions from Roles
    userRolePermissions.forEach(ur => {
        ur.role.permissions.forEach(rp => {
            permissions.add(rp.permission.name);
        });
    });

    // 2. Add direct permissions
    userDirectPermissions.forEach(up => {
        permissions.add(up.permission.name);
    });

    return { 
        userId: payload.sub, 
        email: payload.email, 
        tenantId: payload.tenantId, 
        role: payload.role,
        permissions: Array.from(permissions) 
    };
  }
}
