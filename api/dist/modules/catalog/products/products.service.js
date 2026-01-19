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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma/prisma.service");
const nestjs_cls_1 = require("nestjs-cls");
const slugify_1 = __importDefault(require("slugify"));
let ProductsService = class ProductsService {
    prisma;
    cls;
    constructor(prisma, cls) {
        this.prisma = prisma;
        this.cls = cls;
    }
    get tenantId() {
        return this.cls.get('tenantId');
    }
    async create(createProductDto) {
        const { name, categoryIds, options, ...rest } = createProductDto;
        const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        let uniqueSlug = slug;
        let counter = 1;
        while (await this.checkSlugExists(uniqueSlug)) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }
        return this.prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    ...rest,
                    name,
                    slug: uniqueSlug,
                    tenantId: this.tenantId,
                    categories: {
                        create: categoryIds.map(catId => ({
                            categoryId: catId,
                            tenantId: this.tenantId,
                        }))
                    }
                }
            });
            const createdOptionValues = {};
            if (options && options.length > 0) {
                for (const opt of options) {
                    const createdOpt = await tx.productOption.create({
                        data: {
                            name: opt.name,
                            productId: product.id,
                            tenantId: this.tenantId,
                            values: {
                                create: opt.values.map(val => ({
                                    value: val,
                                    tenantId: this.tenantId,
                                }))
                            }
                        },
                        include: { values: true }
                    });
                    createdOpt.values.forEach((v) => {
                        createdOptionValues[`${createdOpt.name}:${v.value}`] = v.id;
                    });
                }
            }
            if (createProductDto.skus && createProductDto.skus.length > 0) {
                for (const sku of createProductDto.skus) {
                    await tx.sKU.create({
                        data: {
                            productId: product.id,
                            price: sku.price,
                            stock: sku.stock,
                            tenantId: this.tenantId,
                            optionValues: {
                                create: sku.optionValues.map((ov) => ({
                                    productOptionValueId: createdOptionValues[`${ov.optionName}:${ov.value}`],
                                    tenantId: this.tenantId
                                }))
                            }
                        }
                    });
                }
            }
            return product;
        });
    }
    async findAll() {
        return this.prisma.product.findMany({
            where: { tenantId: this.tenantId },
            include: { brand: true, categories: true, options: { include: { values: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id, tenantId: this.tenantId },
            include: {
                brand: true,
                categories: { include: { category: true } },
                options: { include: { values: true } },
                skus: { include: { optionValues: { include: { optionValue: { include: { option: true } } } } } }
            },
        });
        if (!product)
            throw new common_1.BadRequestException('Product not found');
        return product;
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findFirst({
            where: { slug, tenantId: this.tenantId },
            include: {
                brand: true,
                categories: { include: { category: true } },
                options: { include: { values: true } },
                skus: { include: { optionValues: { include: { optionValue: { include: { option: true } } } } } }
            },
        });
        if (!product)
            throw new common_1.BadRequestException('Product not found');
        return product;
    }
    async update(id, updateProductDto) {
        const { categoryIds, options, ...rest } = updateProductDto;
        const product = await this.findOne(id);
        let data = { ...rest };
        if (updateProductDto.name) {
            const slug = (0, slugify_1.default)(updateProductDto.name, { lower: true, strict: true });
            if (slug !== product.slug) {
                let uniqueSlug = slug;
                let counter = 1;
                while (await this.checkSlugExists(uniqueSlug, id)) {
                    uniqueSlug = `${slug}-${counter}`;
                    counter++;
                }
                data.slug = uniqueSlug;
            }
        }
        return this.prisma.product.update({
            where: { id },
            data
        });
    }
    async remove(id) {
        return this.prisma.product.update({
            where: { id, tenantId: this.tenantId },
            data: { deletedAt: new Date() }
        });
    }
    async checkSlugExists(slug, excludeId) {
        const existing = await this.prisma.product.findFirst({
            where: {
                slug,
                tenantId: this.tenantId,
                id: excludeId ? { not: excludeId } : undefined,
            }
        });
        return !!existing;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nestjs_cls_1.ClsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map