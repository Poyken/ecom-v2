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
const nestjs_cls_1 = require("nestjs-cls");
let InventoryService = class InventoryService {
    prisma;
    cls;
    constructor(prisma, cls) {
        this.prisma = prisma;
        this.cls = cls;
    }
    get tenantId() {
        return this.cls.get('tenantId');
    }
    async createWarehouse(dto) {
        if (dto.isDefault) {
            await this.prisma.warehouse.updateMany({
                where: { tenantId: this.tenantId, isDefault: true },
                data: { isDefault: false }
            });
        }
        return this.prisma.warehouse.create({
            data: {
                ...dto,
                tenantId: this.tenantId,
            }
        });
    }
    async findAllWarehouses() {
        return this.prisma.warehouse.findMany({
            where: { tenantId: this.tenantId }
        });
    }
    async findDefaultWarehouse(tx) {
        const client = tx || this.prisma;
        let warehouse = await client.warehouse.findFirst({
            where: { tenantId: this.tenantId, isDefault: true }
        });
        if (!warehouse) {
            warehouse = await client.warehouse.findFirst({
                where: { tenantId: this.tenantId }
            });
            if (!warehouse) {
                warehouse = await client.warehouse.create({
                    data: {
                        tenantId: this.tenantId,
                        name: 'Default Warehouse',
                        isDefault: true
                    }
                });
            }
        }
        return warehouse;
    }
    async getAvailableStock(skuId) {
        const sku = await this.prisma.sku.findUnique({
            where: { id: skuId, tenantId: this.tenantId }
        });
        if (!sku)
            throw new common_1.NotFoundException('SKU not found');
        return sku.stock;
    }
    async getInventoryItems(skuId) {
        return this.prisma.inventoryItem.findMany({
            where: { skuId, tenantId: this.tenantId },
            include: { warehouse: true }
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
                throw new common_1.BadRequestException(`Insufficient stock in warehouse ${targetWarehouseId}. Current: ${inventoryItem.quantity}, Request: ${quantity}`);
            }
            await tx.inventoryItem.update({
                where: { id: inventoryItem.id },
                data: { quantity: newQuantity }
            });
            await tx.inventoryLog.create({
                data: {
                    tenantId: this.tenantId,
                    skuId,
                    changeAmount: quantity,
                    previousStock: inventoryItem.quantity - quantity,
                    newStock: newQuantity,
                    reason: reason || type,
                    userId: this.cls.get('user')?.id,
                }
            });
            await tx.sku.update({
                where: { id: skuId },
                data: {
                    stock: { increment: quantity }
                }
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nestjs_cls_1.ClsService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map