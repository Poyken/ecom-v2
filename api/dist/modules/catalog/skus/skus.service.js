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
exports.SkusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma/prisma.service");
const nestjs_cls_1 = require("nestjs-cls");
const inventory_service_1 = require("../../inventory/inventory.service");
let SkusService = class SkusService {
    prisma;
    cls;
    inventoryService;
    constructor(prisma, cls, inventoryService) {
        this.prisma = prisma;
        this.cls = cls;
        this.inventoryService = inventoryService;
    }
    get tenantId() {
        return this.cls.get('TENANT_ID');
    }
    async create(createSkuDto) {
        const { productId, optionValues, skuCode, ...rest } = createSkuDto;
        const existing = await this.prisma.sku.findUnique({
            where: { tenantId_skuCode: { tenantId: this.tenantId, skuCode } }
        });
        if (existing) {
            throw new common_1.BadRequestException(`SKU code '${skuCode}' already exists`);
        }
        const product = await this.prisma.product.findUnique({ where: { id: productId, tenantId: this.tenantId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const resolvedOptionValueIds = [];
        if (optionValues && optionValues.length > 0) {
            for (const ov of optionValues) {
                const optionValue = await this.prisma.optionValue.findFirst({
                    where: {
                        value: ov.value,
                        tenantId: this.tenantId,
                        option: {
                            productId: productId,
                            name: ov.optionName
                        }
                    }
                });
                if (!optionValue) {
                    throw new common_1.BadRequestException(`Option Value '${ov.value}' for Option '${ov.optionName}' not found in Product`);
                }
                resolvedOptionValueIds.push(optionValue.id);
            }
        }
        const newSku = await this.prisma.sku.create({
            data: {
                ...rest,
                skuCode,
                productId,
                stock: 0,
                tenantId: this.tenantId,
                optionValues: {
                    create: resolvedOptionValueIds.map(ovId => ({
                        optionValueId: ovId,
                        tenantId: this.tenantId
                    }))
                }
            }
        });
        if (rest.stock && rest.stock > 0) {
            await this.inventoryService.adjustStock(newSku.id, {
                quantity: rest.stock,
                type: 'IMPORT',
                reason: 'Initial Import on SKU Create'
            });
        }
        return newSku;
    }
    async findAll() {
        return this.prisma.sku.findMany({
            where: { tenantId: this.tenantId },
            include: { product: true, optionValues: { include: { optionValue: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const sku = await this.prisma.sku.findUnique({
            where: { id, tenantId: this.tenantId },
            include: { product: true, optionValues: { include: { optionValue: true } } },
        });
        if (!sku)
            throw new common_1.NotFoundException('SKU not found');
        return sku;
    }
    async update(id, updateSkuDto) {
        const { optionValues, ...rest } = updateSkuDto;
        const sku = await this.findOne(id);
        return this.prisma.sku.update({
            where: { id },
            data: {
                ...rest
            }
        });
    }
    async remove(id) {
        return this.prisma.sku.update({
            where: { id, tenantId: this.tenantId },
            data: { status: 'INACTIVE' }
        });
    }
};
exports.SkusService = SkusService;
exports.SkusService = SkusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nestjs_cls_1.ClsService,
        inventory_service_1.InventoryService])
], SkusService);
//# sourceMappingURL=skus.service.js.map