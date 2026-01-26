import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { tenantStorage } from '../../common/tenant/tenant.storage';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const context = tenantStorage.getStore();
    const tenantId = context?.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is missing');
    }

    if (!dto.acceptTerms) {
      throw new BadRequestException({
        code: 'TERMS_NOT_ACCEPTED',
        message: 'Must accept terms',
      });
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: tenantId,
          email: dto.email,
        },
      },
    });

    if (existingUser) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        tenantId: tenantId,
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        acceptTerms: dto.acceptTerms,
        marketingConsent: dto.marketingConsent ?? false,
        metadata: {},
      },
    });

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.tenantId,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const context = tenantStorage.getStore();
    const tenantId = context?.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is missing');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        tenantId_email: {
          tenantId: tenantId,
          email: dto.email,
        },
      },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException({
        code: 'ACCOUNT_INACTIVE',
        message: 'Account is inactive',
      });
    }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.tenantId,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: [],
        tenantId: user.tenantId,
      },
      tokens,
    };
  }

  private async generateTokens(
    userId: string,
    email: string,
    tenantId: string,
  ) {
    const payload = { sub: userId, email, tenantId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }
}
