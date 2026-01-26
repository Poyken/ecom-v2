"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const tenant_storage_1 = require("./tenant.storage");
let TenantMiddleware = class TenantMiddleware {
    use(req, res, next) {
        const tenantId = req.headers['x-tenant-id'];
        const path = req.originalUrl || req.url;
        if (this.isPublicRoute(path)) {
            return tenant_storage_1.tenantStorage.run({ tenantId: tenantId || '' }, () => {
                next();
            });
        }
        if (!tenantId) {
            throw new common_1.UnauthorizedException({
                code: 'TENANT_ID_REQUIRED',
                message: 'Tenant ID is required',
            });
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(tenantId)) {
            throw new common_1.BadRequestException({
                code: 'INVALID_TENANT_ID',
                message: 'Invalid Tenant ID format',
            });
        }
        tenant_storage_1.tenantStorage.run({ tenantId }, () => {
            next();
        });
    }
    isPublicRoute(path) {
        const publicRoutes = [
            '/health',
            '/metrics',
            '/api/v1/tenants/onboard',
            '/api/v1/auth/login',
            '/api/v1/auth/register',
            '/api/v1/catalog',
            '/api/v1/orders/vnpay-ipn',
        ];
        return publicRoutes.some((route) => path.startsWith(route));
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)()
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map