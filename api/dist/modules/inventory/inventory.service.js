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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const core_1 = require("@nestjs/core");
let InventoryService = class InventoryService {
    prisma;
    request;
    tenantId;
    constructor(prisma, request) {
        this.prisma = prisma;
        this.request = request;
        this.tenantId = this.request.user?.tenantId;
    }
    get currentTenantId() {
        return this.tenantId;
    }
    async findDefaultWarehouse(tx) {
        const prisma = tx || this.prisma;
        const warehouse = await prisma.warehouse.findFirst({
            where: { tenantId: this.tenantId, isDefault: true }
        });
        if (!warehouse)
            throw new common_1.NotFoundException('Default warehouse not found');
        return warehouse;
    }
    async getAvailableStock(skuId) {
        const sku = await this.prisma.sku.findUnique({
            where: { id: skuId },
            select: { stock: true }
        });
        if (!sku)
            throw new common_1.NotFoundException('SKU not found');
        return sku.stock;
    }
    async createWarehouse(dto) {
        return this.prisma.warehouse.create({
            data: {
                ...dto,
                tenantId: this.tenantId,
            },
        });
    }
    async findAllWarehouses() {
        return this.prisma.warehouse.findMany({
            where: { tenantId: this.tenantId },
        });
    }
    async findWarehouse(id) {
        return this.prisma.warehouse.findUnique({
            where: { id, tenantId: this.tenantId }
        });
    }
    async getWarehouseStock(warehouseId) {
        return this.prisma.inventoryItem.findMany({
            where: { warehouseId, tenantId: this.tenantId },
            include: {
                sku: {
                    include: {
                        product: true,
                        optionValues: {
                            include: { optionValue: true }
                        }
                    }
                }
            }
        });
    }
    async getWarehouseLogs(warehouseId) {
        return this.prisma.inventoryLog.findMany({
            where: {
                tenantId: this.tenantId,
                sku: {
                    inventoryItems: {
                        some: { warehouseId }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sku: { include: { product: true } },
                user: { select: { firstName: true, lastName: true, email: true } }
            },
            take: 50
        });
    }
    async adjustStock(skuId, adjustDto, externalTx) {
        const { quantity, type, reason, warehouseId } = adjustDto;
        const action = async (tx) => {
            let targetWarehouseId = warehouseId;
            if (!targetWarehouseId) {
                const defaultWh = await this.findDefaultWarehouse(tx);
                targetWarehouseId = defaultWh.id;
            }
            let inventoryItem = await tx.inventoryItem.findUnique({
                where: {
                    warehouseId_skuId: {
                        warehouseId: targetWarehouseId,
                        skuId
                    }
                }
            });
            if (!inventoryItem) {
                inventoryItem = await tx.inventoryItem.create({
                    data: {
                        tenantId: this.tenantId,
                        warehouseId: targetWarehouseId,
                        skuId,
                        quantity: 0
                    }
                });
            }
            const newQuantity = inventoryItem.quantity + quantity;
            if (newQuantity < 0 && (type === 'SALE' || type === 'EXPORT')) {
                throw new common_1.BadRequestException(`Insufficient stock in warehouse ${targetWarehouseId}.`);
            }
            await tx.inventoryItem.update({
                where: { id: inventoryItem.id },
                data: { quantity: newQuantity }
            });
            const sku = await tx.sku.findUnique({
                where: { id: skuId },
                select: { stock: true }
            });
            const previousGlobalStock = sku?.stock || 0;
            const newGlobalStock = previousGlobalStock + quantity;
            await tx.inventoryLog.create({
                data: {
                    skuId,
                    type,
                    changeAmount: quantity,
                    previousStock: previousGlobalStock,
                    newStock: newGlobalStock,
                    reason: reason || `Inventory ${type}`,
                    tenantId: this.tenantId,
                    userId: this.request.user?.id
                }
            });
            await tx.sku.update({
                where: { id: skuId },
                data: { stock: newGlobalStock }
            });
            return { newStock: newQuantity, warehouseId: targetWarehouseId };
        };
        if (externalTx) {
            return action(externalTx);
        }
        else {
            return this.prisma.$transaction(action);
        }
    }
    async transferStock(skuId, fromWarehouseId, toWarehouseId, quantity, reason) {
        if (quantity <= 0)
            throw new common_1.BadRequestException('Transfer quantity must be positive');
        if (fromWarehouseId === toWarehouseId)
            throw new common_1.BadRequestException('Source and destination warehouses must be different');
        return this.prisma.$transaction(async (tx) => {
            const fromItem = await tx.inventoryItem.findUnique({
                where: { warehouseId_skuId: { warehouseId: fromWarehouseId, skuId } }
            });
            if (!fromItem || fromItem.quantity < quantity) {
                throw new common_1.BadRequestException(`Insufficient stock in source warehouse.`);
            }
            await tx.inventoryItem.update({
                where: { id: fromItem.id },
                data: { quantity: { decrement: quantity } }
            });
            let toItem = await tx.inventoryItem.findUnique({
                where: { warehouseId_skuId: { warehouseId: toWarehouseId, skuId } }
            });
            if (!toItem) {
                await tx.inventoryItem.create({
                    data: {
                        tenantId: this.tenantId,
                        warehouseId: toWarehouseId,
                        skuId,
                        quantity: quantity
                    }
                });
            }
            else {
                await tx.inventoryItem.update({
                    where: { id: toItem.id },
                    data: { quantity: { increment: quantity } }
                });
            }
            const currentSku = await tx.sku.findUnique({ where: { id: skuId }, select: { stock: true } });
            await tx.inventoryLog.create({
                data: {
                    skuId,
                    type: 'TRANSFER',
                    changeAmount: 0,
                    previousStock: currentSku.stock,
                    newStock: currentSku.stock,
                    reason: reason || `Transfer from ${fromWarehouseId} to ${toWarehouseId}`,
                    tenantId: this.tenantId,
                    userId: this.request.user?.id
                }
            });
            return { success: true };
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map