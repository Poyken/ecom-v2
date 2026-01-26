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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const inventory_dto_1 = require("./dto/inventory.dto");
const swagger_1 = require("@nestjs/swagger");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async createWarehouse(dto) {
        return this.inventoryService.createWarehouse(dto);
    }
    async getWarehouses() {
        return this.inventoryService.findAllWarehouses();
    }
    async updateStock(dto) {
        return this.inventoryService.updateStock(dto);
    }
    async getSnapshot() {
        return this.inventoryService.getInventorySnapshot();
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('warehouses'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new warehouse' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_dto_1.CreateWarehouseDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "createWarehouse", null);
__decorate([
    (0, common_1.Get)('warehouses'),
    (0, swagger_1.ApiOperation)({ summary: 'List all warehouses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getWarehouses", null);
__decorate([
    (0, common_1.Post)('stock'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update or initialize stock for a specific SKU in a warehouse',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_dto_1.UpdateStockDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Get)('snapshot'),
    (0, swagger_1.ApiOperation)({ summary: 'Get full inventory snapshot for the tenant' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getSnapshot", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('inventory'),
    (0, swagger_1.ApiHeader)({
        name: 'X-Tenant-ID',
        description: 'Tenant ID for isolation context',
        required: true,
    }),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map