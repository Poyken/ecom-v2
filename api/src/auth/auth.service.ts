import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../core/prisma/prisma.service';
import { LoginDto, RegisterDto, AuthTokensDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto, tenantId: string): Promise<AuthTokensDto> {
    // Check if email already exists in tenant
    const existingUser = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email: dto.email } },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Generate tokens
    return this.generateTokens(user);
  }

  async login(dto: LoginDto, tenantId: string): Promise<AuthTokensDto> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email: dto.email } },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if deleted
    if (user.deletedAt) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokensDto> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user || user.deletedAt) {
        throw new UnauthorizedException('User not found');
      }

      // Verify stored refresh token matches
      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    // Clear refresh token
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  private async generateTokens(user: {
    id: string;
    tenantId: string;
    email: string;
    userRoles: { role: { name: string } }[];
  }): Promise<AuthTokensDto> {
    const roles = user.userRoles.map((ur) => ur.role.name);

    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      roles,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    // Store refresh token
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
