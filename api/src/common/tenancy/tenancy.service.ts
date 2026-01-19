import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TenancyService {
  constructor(private readonly cls: ClsService) {}

  get currentTenantId(): string {
    return this.cls.get('TENANT_ID');
  }

  get currentTenant() {
    return this.cls.get('TENANT');
  }
}
