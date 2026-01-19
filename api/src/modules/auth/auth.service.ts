import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Check if email exists (Global check across tenants? Or per tenant? 
    // Usually email should be unique globally for the platform owner/admin, 
    // but users can be duplicated across tenants. 
    // However, for the "Owner" registering a new Tenant, they are creating a new isolated world.
    
    // For simplicity, we check if email is taken in any tenant? 
    // Actually, our schema has unique([tenantId, email]), so same email can exist in different tenants.
    // BUT, when creating a NEW Tenant, we are creating a new User who OWNS that tenant.
    
    // Transactional creation
    return this.prisma.$transaction(async (tx) => {
      // 1. Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: dto.storeName,
          // Generate a slug/domain based on name?
          domain: `${dto.storeName.toLowerCase().replace(/\s+/g, '-')}.localhost`, // Temp domain logic
          plan: 'BASIC',
        },
      });

      // 2. Hash Password
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // 3. Create User (Owner)
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          tenantId: tenant.id,
          roles: {
            create: {
                role: {
                    create: {
                        name: 'OWNER',
                        tenantId: tenant.id,
                        description: 'Tenant Owner',
                    }
                }
            }
          }
        },
      });

      // 4. Update Tenant Owner
      await tx.tenant.update({
        where: { id: tenant.id },
        data: { ownerId: user.id },
      });
      
      return this.generateTokens(user.id, user.email, tenant.id, 'OWNER');
    });
  }

  async login(dto: LoginDto, tenantId?: string) {
    // If tenantId is provided (e.g. from header), we look for user in that tenant.
    // If NOT provided, we might look for user across all tenants? 
    // For now, let's assume login requires identifying the tenant context OR 
    // we find the user by email if they only belong to one tenant.
    
    // Simplified: Require TenantId header for login, OR
    // support "Platform Login" where use provides email, and we list their tenants.
    
    // For Phase 3, let's assume we pass x-tenant-id matches the tenant.
    // OR we find the user first.
    
    // Let's try to find user by email.
    const users = await this.prisma.user.findMany({
      where: { email: dto.email },
      include: { tenant: true },
    });

    if (users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If multiple users found (same email, different tenants), valid scenario.
    // If tenantId is passed, filter.
    let user = users[0];
    if (tenantId) {
        const found = users.find(u => u.tenantId === tenantId);
        if (!found) throw new UnauthorizedException('User not found in this tenant');
        user = found;
    } else if (users.length > 1) {
        throw new BadRequestException('Multiple accounts found. Please specify Tenant ID.');
    }

    // Verify Password
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials (no password set)');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get Role (Simplified)
    // We need to fetch roles.
    // Ideally we include roles in the first query.
    
    return this.generateTokens(user.id, user.email, user.tenantId, 'USER');
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { loyaltyTier: true },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const { password, ...rest } = user;
    return rest;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      // Check if user exists (and still active)
      const user = await this.prisma.user.findUnique({
         where: { id: payload.sub }
      });
      if (!user) throw new UnauthorizedException('User no longer exists');

      // Generate new tokens (Rotation)
      return this.generateTokens(user.id, user.email, payload.tenantId, payload.role);

    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(userId: string, email: string, tenantId: string, role: string) {
    const payload = { sub: userId, email, tenantId, role };
    const secret = this.config.getOrThrow<string>('JWT_SECRET');
    const refreshSecret = this.config.getOrThrow<string>('JWT_REFRESH_SECRET');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { secret, expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { secret: refreshSecret, expiresIn: '7d' }),
    ]);

    return {
      accessToken,
      refreshToken,
      user: { id: userId, email, tenantId, role },
    };
  }
}
