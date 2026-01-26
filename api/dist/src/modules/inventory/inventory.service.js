"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const tenant_storage_1 = require("../../common/tenant/tenant.storage");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getTenantId() {
        const context = tenant_storage_1.tenantStorage.getStore();
        const tenantId = context?.tenantId;
        if (!tenantId) {
            throw new common_1.UnauthorizedException('Tenant ID is missing in context');
        }
        return tenantId;
    }
    async createWarehouse(dto) {
        const tenantId = this.getTenantId();
        const existing = await this.prisma.warehouse.findUnique({
            where: {
                tenantId_code: { tenantId, code: dto.code },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Warehouse code already exists');
        }
        return this.prisma.warehouse.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }
    async findAllWarehouses() {
        const tenantId = this.getTenantId();
        return this.prisma.warehouse.findMany({
            where: { tenantId, isActive: true },
        });
    }
    async updateStock(dto) {
        const tenantId = this.getTenantId();
        return this.prisma.inventoryItem.upsert({
            where: {
                skuId_warehouseId: {
                    skuId: dto.skuId,
                    warehouseId: dto.warehouseId,
                },
            },
            update: {
                quantity: dto.quantity,
                reorderPoint: dto.reorderPoint,
            },
            create: {
                skuId: dto.skuId,
                warehouseId: dto.warehouseId,
                quantity: dto.quantity,
                reorderPoint: dto.reorderPoint ?? 0,
                tenantId,
            },
        });
    }
    async getInventorySnapshot() {
        const tenantId = this.getTenantId();
        return this.prisma.inventoryItem.findMany({
            where: { tenantId },
            include: {
                sku: {
                    include: { product: true },
                },
                warehouse: true,
            },
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map