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
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const tenant_storage_1 = require("../../common/tenant/tenant.storage");
let CatalogService = class CatalogService {
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
    async createCategory(dto) {
        const tenantId = this.getTenantId();
        const existing = await this.prisma.category.findUnique({
            where: { tenantId_slug: { tenantId, slug: dto.slug } },
        });
        if (existing) {
            throw new common_1.ConflictException('Category slug already exists');
        }
        return this.prisma.category.create({
            data: { ...dto, tenantId },
        });
    }
    async findAllCategories() {
        const tenantId = this.getTenantId();
        return this.prisma.category.findMany({
            where: { tenantId, isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async createProduct(dto) {
        const tenantId = this.getTenantId();
        const { options, skus, ...productData } = dto;
        const existing = await this.prisma.product.findUnique({
            where: { tenantId_slug: { tenantId, slug: dto.slug } },
        });
        if (existing) {
            throw new common_1.ConflictException('Product slug already exists');
        }
        return this.prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    ...productData,
                    tenantId,
                    options: {
                        create: options.map((opt) => ({
                            name: opt.name,
                            tenantId,
                            values: {
                                create: opt.values.map((v) => ({
                                    value: v.value,
                                    displayName: v.displayName,
                                    tenantId,
                                })),
                            },
                        })),
                    },
                },
                include: {
                    options: {
                        include: { values: true },
                    },
                },
            });
            const valueMap = new Map();
            product.options.forEach((opt) => {
                opt.values.forEach((val) => {
                    valueMap.set(`${opt.name}:${val.value}`, val.id);
                });
            });
            for (const skuDto of skus) {
                const sku = await tx.sku.create({
                    data: {
                        sku: skuDto.sku,
                        price: skuDto.price,
                        comparePrice: skuDto.comparePrice,
                        stock: skuDto.stock,
                        tenantId,
                        productId: product.id,
                    },
                });
                for (const ov of skuDto.optionValues) {
                    const optionValueId = valueMap.get(`${ov.optionName}:${ov.value}`);
                    if (!optionValueId) {
                        throw new common_1.NotFoundException(`Option value ${ov.optionName}:${ov.value} not found`);
                    }
                    await tx.skuValue.create({
                        data: {
                            tenantId,
                            skuId: sku.id,
                            optionValueId,
                        },
                    });
                }
            }
            return this.findProductBySlug(product.slug);
        });
    }
    async findAllProducts() {
        const tenantId = this.getTenantId();
        return this.prisma.product.findMany({
            where: { tenantId, isActive: true },
            include: {
                category: true,
                skus: {
                    include: {
                        skuValues: {
                            include: {
                                optionValue: {
                                    include: { option: true },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async findProductBySlug(slug) {
        const tenantId = this.getTenantId();
        const product = await this.prisma.product.findUnique({
            where: { tenantId_slug: { tenantId, slug } },
            include: {
                category: true,
                options: {
                    include: { values: true },
                },
                skus: {
                    include: {
                        skuValues: {
                            include: {
                                optionValue: {
                                    include: { option: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogService);
//# sourceMappingURL=catalog.service.js.map