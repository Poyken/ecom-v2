import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OnboardTenantDto } from './dto/tenant.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async onboard(dto: OnboardTenantDto) {
    // 1. Check if domain already exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { domain: dto.domain },
    });

    if (existingTenant) {
      throw new ConflictException({
        code: 'DOMAIN_ALREADY_EXISTS',
        message: 'This store domain is already taken',
      });
    }

    try {
      // 2. Start transaction
      return await this.prisma.$transaction(async (tx) => {
        // Create Tenant
        const tenant = await tx.tenant.create({
          data: {
            name: dto.storeName,
            domain: dto.domain,
            subscriptionPlan: dto.plan,
            status: 'active',
          },
        });

        // Create Admin User
        const passwordHash = await bcrypt.hash(dto.adminPassword, 10);
        const admin = await tx.user.create({
          data: {
            tenantId: tenant.id,
            email: dto.adminEmail,
            passwordHash,
            firstName: 'Store',
            lastName: 'Admin',
            role: 'ADMIN',
            isActive: true,
            acceptTerms: true,
          },
        });

        return {
          tenant: {
            id: tenant.id,
            name: tenant.name,
            domain: tenant.domain,
            plan: tenant.subscriptionPlan,
          },
          admin: {
            id: admin.id,
            email: admin.email,
          },
        };
      });
    } catch (error) {
      console.error('Onboarding failed:', error);
      throw new InternalServerErrorException('Failed to onboard tenant');
    }
  }

  async getTenantByDomain(domain: string) {
    return this.prisma.tenant.findUnique({
      where: { domain },
    });
  }
}
