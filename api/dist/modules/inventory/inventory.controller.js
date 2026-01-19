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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const shared_1 = require("@ecommerce/shared");
const zod_validation_pipe_1 = require("../../common/pipes/zod-validation.pipe");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    getAvailableStock(skuId) {
        return this.inventoryService.getAvailableStock(skuId);
    }
    adjustStock(skuId, dto) {
        return this.inventoryService.adjustStock(skuId, dto);
    }
    transferStock(skuId, dto) {
        const { fromWarehouseId, toWarehouseId, quantity, reason } = dto;
        return this.inventoryService.transferStock(skuId, fromWarehouseId, toWarehouseId, quantity, reason);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('sku/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getAvailableStock", null);
__decorate([
    (0, common_1.Post)('adjust/:skuId'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.AdjustInventorySchema)),
    __param(0, (0, common_1.Param)('skuId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Post)('transfer/:skuId'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(shared_1.TransferInventorySchema)),
    __param(0, (0, common_1.Param)('skuId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "transferStock", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map