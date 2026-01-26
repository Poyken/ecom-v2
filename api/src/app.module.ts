import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantMiddleware } from './common/tenant/tenant.middleware';
import { TenantModule } from './modules/tenant/tenant.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TenantModule,
    CatalogModule,
    InventoryModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*path');
  }
}
