"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_cls_1 = require("nestjs-cls");
const prisma_module_1 = require("./common/prisma/prisma.module");
const tenancy_module_1 = require("./common/tenancy/tenancy.module");
const tenancy_middleware_1 = require("./common/tenancy/tenancy.middleware");
const auth_module_1 = require("./modules/auth/auth.module");
const catalog_module_1 = require("./modules/catalog/catalog.module");
const core_1 = require("@nestjs/core");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const config_schema_1 = require("./common/config/config.schema");
const cart_module_1 = require("./modules/cart/cart.module");
const orders_module_1 = require("./modules/orders/orders.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const payments_module_1 = require("./modules/payments/payments.module");
const roles_guard_1 = require("./common/guards/roles.guard");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(tenancy_middleware_1.TenancyMiddleware)
            .exclude({ path: 'auth/register', method: common_1.RequestMethod.POST }, { path: 'health', method: common_1.RequestMethod.GET }, { path: 'api/health', method: common_1.RequestMethod.GET })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: config_schema_1.validate,
            }),
            nestjs_cls_1.ClsModule.forRoot({
                global: true,
                middleware: { mount: true },
            }),
            prisma_module_1.PrismaModule,
            tenancy_module_1.TenancyModule,
            auth_module_1.AuthModule,
            catalog_module_1.CatalogModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            inventory_module_1.InventoryModule,
            payments_module_1.PaymentsModule,
        ],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: global_exception_filter_1.GlobalExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            roles_guard_1.RolesGuard,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map