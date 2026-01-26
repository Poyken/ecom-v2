import { TenantService } from './tenant.service';
import { OnboardTenantDto } from './dto/tenant.dto';
export declare class TenantController {
    private tenantService;
    constructor(tenantService: TenantService);
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
}
