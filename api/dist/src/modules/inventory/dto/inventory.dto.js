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
exports.UpdateStockDto = exports.CreateWarehouseDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateWarehouseDto {
    name;
    code;
    address;
}
exports.CreateWarehouseDto = CreateWarehouseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Main Warehouse' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'WH-MAIN' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123 Business St, Hanoi' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "address", void 0);
class UpdateStockDto {
    skuId;
    warehouseId;
    quantity;
    reorderPoint;
}
exports.UpdateStockDto = UpdateStockDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sku-uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateStockDto.prototype, "skuId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'warehouse-uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateStockDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Absolute quantity to set' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateStockDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, description: 'Reorder point' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateStockDto.prototype, "reorderPoint", void 0);
//# sourceMappingURL=inventory.dto.js.map