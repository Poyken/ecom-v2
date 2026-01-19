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
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma/prisma.service");
const nestjs_cls_1 = require("nestjs-cls");
const slugify_1 = __importDefault(require("slugify"));
let BrandsService = class BrandsService {
    prisma;
    cls;
    constructor(prisma, cls) {
        this.prisma = prisma;
        this.cls = cls;
    }
    get tenantId() {
        return this.cls.get('tenantId');
    }
    async create(createBrandDto) {
        const { name, ...rest } = createBrandDto;
        const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        let uniqueSlug = slug;
        let counter = 1;
        while (await this.checkSlugExists(uniqueSlug)) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }
        return this.prisma.brand.create({
            data: {
                ...rest,
                name,
                slug: uniqueSlug,
                tenantId: this.tenantId,
            },
        });
    }
    async findAll() {
        return this.prisma.brand.findMany({
            where: { tenantId: this.tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const brand = await this.prisma.brand.findUnique({
            where: { id, tenantId: this.tenantId },
        });
        if (!brand)
            throw new common_1.BadRequestException('Brand not found');
        return brand;
    }
    async update(id, updateBrandDto) {
        await this.findOne(id);
        let data = { ...updateBrandDto };
        if (updateBrandDto.name) {
            const slug = (0, slugify_1.default)(updateBrandDto.name, { lower: true, strict: true });
            const current = await this.findOne(id);
            if (slug !== current.slug) {
                let uniqueSlug = slug;
                let counter = 1;
                while (await this.checkSlugExists(uniqueSlug, id)) {
                    uniqueSlug = `${slug}-${counter}`;
                    counter++;
                }
                data.slug = uniqueSlug;
            }
        }
        return this.prisma.brand.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.brand.update({
            where: { id, tenantId: this.tenantId },
            data: { deletedAt: new Date() }
        });
    }
    async checkSlugExists(slug, excludeId) {
        const existing = await this.prisma.brand.findFirst({
            where: {
                slug,
                tenantId: this.tenantId,
                id: excludeId ? { not: excludeId } : undefined,
            }
        });
        return !!existing;
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nestjs_cls_1.ClsService])
], BrandsService);
//# sourceMappingURL=brands.service.js.map