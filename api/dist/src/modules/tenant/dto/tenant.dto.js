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
exports.OnboardTenantDto = exports.SubscriptionPlan = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["STARTER"] = "starter";
    SubscriptionPlan["PROFESSIONAL"] = "professional";
    SubscriptionPlan["ENTERPRISE"] = "enterprise";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
class OnboardTenantDto {
    storeName;
    domain;
    plan;
    adminEmail;
    adminPassword;
}
exports.OnboardTenantDto = OnboardTenantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'My Awesome Store',
        description: 'Display name of the store',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OnboardTenantDto.prototype, "storeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'awesome-store',
        description: 'Unique domain slug for the tenant',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OnboardTenantDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: SubscriptionPlan,
        example: SubscriptionPlan.PROFESSIONAL,
    }),
    (0, class_validator_1.IsEnum)(SubscriptionPlan),
    __metadata("design:type", String)
], OnboardTenantDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@awesome.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], OnboardTenantDto.prototype, "adminEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Password123!', minLength: 8 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], OnboardTenantDto.prototype, "adminPassword", void 0);
//# sourceMappingURL=tenant.dto.js.map