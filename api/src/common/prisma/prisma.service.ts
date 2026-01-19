import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly cls: ClsService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      const tenantId = this.cls.get('TENANT_ID');
      const modelsToExclude = ['Tenant', 'TenantSettings', 'SubscriptionPlan', 'PlatformSetting', 'Region', 'Country']; // Add global models

      if (tenantId && params.model && !modelsToExclude.includes(params.model)) {
        if (params.action === 'findUnique' || params.action === 'findFirst' || params.action === 'findMany') {
          if (!params.args) params.args = {};
          if (!params.args.where) params.args.where = {};
          
          if (params.args.where.tenantId === undefined) {
             params.args.where.tenantId = tenantId;
          }
        }
        
        // Safety: Prevent creating/updating data for other tenants
        if (params.action === 'create' || params.action === 'createMany' || params.action === 'update' || params.action === 'updateMany' || params.action === 'delete' || params.action === 'deleteMany') {
           if (!params.args) params.args = {};
           if (params.action === 'create') {
             params.args.data = { ...params.args.data, tenantId };
           }
           if (params.action === 'createMany') {
              if (Array.isArray(params.args.data)) {
                 params.args.data = params.args.data.map((d: any) => ({ ...d, tenantId }));
              }
           }
           if (['update', 'updateMany', 'delete', 'deleteMany'].includes(params.action)) {
              if (!params.args.where) params.args.where = {};
              if (params.args.where.tenantId === undefined) {
                params.args.where.tenantId = tenantId;
              }
           }
        }
      }
      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
