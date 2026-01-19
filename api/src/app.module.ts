import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { PrismaModule } from './common/prisma/prisma.module';
import { TenancyModule } from './common/tenancy/tenancy.module';
import { TenancyMiddleware } from './common/tenancy/tenancy.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { validate } from './common/config/config.schema';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AiModule } from './modules/ai/ai.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PaymentsModule } from './modules/payments/payments.module';

import { RolesGuard } from './common/guards/roles.guard';
import { PromotionsModule } from './modules/promotions/promotions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    PrismaModule,
    TenancyModule,
    AuthModule,
    CatalogModule,
    CartModule,
    OrdersModule,
    AiModule,
    InventoryModule,
    AnalyticsModule,
    PaymentsModule,
    PromotionsModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    RolesGuard,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenancyMiddleware)
      .exclude(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'health', method: RequestMethod.GET },
        { path: 'api/health', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
