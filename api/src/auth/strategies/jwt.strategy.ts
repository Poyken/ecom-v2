import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../core/prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  tenantId: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const secretOrKey = configService.get<string>('JWT_ACCESS_SECRET');
    if (!secretOrKey) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: JwtPayload) {
    // Verify user still exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, tenantId: true, email: true, deletedAt: true },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found or deactivated');
    }

    // Return user info to be attached to request
    return {
      id: payload.sub,
      tenantId: payload.tenantId,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
