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
const prisma_module_1 = require("./common/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const tenant_middleware_1 = require("./common/tenant/tenant.middleware");
const tenant_module_1 = require("./modules/tenant/tenant.module");
const catalog_module_1 = require("./modules/catalog/catalog.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(tenant_middleware_1.TenantMiddleware).forRoutes('*path');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            tenant_module_1.TenantModule,
            catalog_module_1.CatalogModule,
            inventory_module_1.InventoryModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map