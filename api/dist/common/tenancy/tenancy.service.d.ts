import { ClsService } from 'nestjs-cls';
export declare class TenancyService {
    private readonly cls;
    constructor(cls: ClsService);
    get currentTenantId(): string;
    get currentTenant(): any;
}
