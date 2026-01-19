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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/prisma/prisma.service");
const nestjs_cls_1 = require("nestjs-cls");
const slugify_1 = __importDefault(require("slugify"));
let CategoriesService = class CategoriesService {
    prisma;
    cls;
    constructor(prisma, cls) {
        this.prisma = prisma;
        this.cls = cls;
    }
    get tenantId() {
        return this.cls.get('tenantId');
    }
    async create(createCategoryDto) {
        const { name, ...rest } = createCategoryDto;
        const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        let uniqueSlug = slug;
        let counter = 1;
        while (await this.checkSlugExists(uniqueSlug)) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }
        return this.prisma.category.create({
            data: {
                ...rest,
                name,
                slug: uniqueSlug,
                tenantId: this.tenantId,
            },
        });
    }
    async findAll() {
        return this.prisma.category.findMany({
            where: { tenantId: this.tenantId },
            include: {
                children: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id, tenantId: this.tenantId },
            include: { children: true, parent: true },
        });
        if (!category) {
            throw new common_1.BadRequestException('Category not found');
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        await this.findOne(id);
        let data = { ...updateCategoryDto };
        if (updateCategoryDto.name) {
            const slug = (0, slugify_1.default)(updateCategoryDto.name, { lower: true, strict: true });
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
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.category.update({
            where: { id, tenantId: this.tenantId },
            data: { deletedAt: new Date() }
        });
    }
    async checkSlugExists(slug, excludeId) {
        const existing = await this.prisma.category.findFirst({
            where: {
                slug,
                tenantId: this.tenantId,
                id: excludeId ? { not: excludeId } : undefined,
            }
        });
        return !!existing;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        nestjs_cls_1.ClsService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map