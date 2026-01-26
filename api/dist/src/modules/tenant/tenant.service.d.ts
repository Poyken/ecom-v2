import { PrismaService } from '../../common/prisma/prisma.service';
import { OnboardTenantDto } from './dto/tenant.dto';
export declare class TenantService {
    private prisma;
    constructor(prisma: PrismaService);
    onboard(dto: OnboardTenantDto): Promise<{
        tenant: {
            id: string;
            name: string;
            domain: string;
            plan: string;
        };
        admin: {
            id: string;
            email: string;
        };
    }>;
    getTenantByDomain(domain: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        domain: string;
        status: string;
        settings: import("@prisma/client/runtime/client").JsonValue;
        subscriptionPlan: string;
        subscriptionExpiresAt: Date | null;
    } | null>;
}
