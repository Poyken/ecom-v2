"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const tenant_storage_1 = require("../../common/tenant/tenant.storage");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const context = tenant_storage_1.tenantStorage.getStore();
        const tenantId = context?.tenantId;
        if (!tenantId) {
            throw new common_1.UnauthorizedException('Tenant ID is missing');
        }
        if (!dto.acceptTerms) {
            throw new common_1.BadRequestException({
                code: 'TERMS_NOT_ACCEPTED',
                message: 'Must accept terms',
            });
        }
        const existingUser = await this.prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId: tenantId,
                    email: dto.email,
                },
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException({
                code: 'EMAIL_ALREADY_EXISTS',
                message: 'Email already exists',
            });
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                tenantId: tenantId,
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                acceptTerms: dto.acceptTerms,
                marketingConsent: dto.marketingConsent ?? false,
                metadata: {},
            },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.tenantId);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt,
            },
            tokens,
        };
    }
    async login(dto) {
        const context = tenant_storage_1.tenantStorage.getStore();
        const tenantId = context?.tenantId;
        if (!tenantId) {
            throw new common_1.UnauthorizedException('Tenant ID is missing');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                tenantId_email: {
                    tenantId: tenantId,
                    email: dto.email,
                },
            },
        });
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException({
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid credentials',
            });
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException({
                code: 'ACCOUNT_INACTIVE',
                message: 'Account is inactive',
            });
        }
        const tokens = await this.generateTokens(user.id, user.email, user.tenantId);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                permissions: [],
                tenantId: user.tenantId,
            },
            tokens,
        };
    }
    async generateTokens(userId, email, tenantId) {
        const payload = { sub: userId, email, tenantId };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, { expiresIn: '7d' }),
        ]);
        return {
            accessToken,
            refreshToken,
            expiresIn: 3600,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map