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
exports.CatalogController = void 0;
const common_1 = require("@nestjs/common");
const catalog_service_1 = require("./catalog.service");
const catalog_dto_1 = require("./dto/catalog.dto");
const swagger_1 = require("@nestjs/swagger");
let CatalogController = class CatalogController {
    catalogService;
    constructor(catalogService) {
        this.catalogService = catalogService;
    }
    async createCategory(dto) {
        return this.catalogService.createCategory(dto);
    }
    async getCategories() {
        return this.catalogService.findAllCategories();
    }
    async createProduct(dto) {
        return this.catalogService.createProduct(dto);
    }
    async getProducts() {
        return this.catalogService.findAllProducts();
    }
    async getProduct(slug) {
        return this.catalogService.findProductBySlug(slug);
    }
};
exports.CatalogController = CatalogController;
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'List all active categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product with SKUs' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'List all active products' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('products/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product detail by slug' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogController.prototype, "getProduct", null);
exports.CatalogController = CatalogController = __decorate([
    (0, swagger_1.ApiTags)('catalog'),
    (0, swagger_1.ApiHeader)({
        name: 'X-Tenant-ID',
        description: 'Tenant ID for isolation context',
        required: true,
    }),
    (0, common_1.Controller)('catalog'),
    __metadata("design:paramtypes", [catalog_service_1.CatalogService])
], CatalogController);
//# sourceMappingURL=catalog.controller.js.map