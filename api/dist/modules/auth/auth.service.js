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
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    config;
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    async register(dto) {
        return this.prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: dto.storeName,
                    domain: `${dto.storeName.toLowerCase().replace(/\s+/g, '-')}.localhost`,
                    plan: 'BASIC',
                },
            });
            const hashedPassword = await bcrypt.hash(dto.password, 10);
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    tenantId: tenant.id,
                    roles: {
                        create: {
                            role: {
                                create: {
                                    name: 'OWNER',
                                    tenantId: tenant.id,
                                    description: 'Tenant Owner',
                                }
                            }
                        }
                    }
                },
            });
            await tx.tenant.update({
                where: { id: tenant.id },
                data: { ownerId: user.id },
            });
            return this.generateTokens(user.id, user.email, tenant.id, 'OWNER');
        });
    }
    async login(dto, tenantId) {
        const users = await this.prisma.user.findMany({
            where: { email: dto.email },
            include: { tenant: true },
        });
        if (users.length === 0) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        let user = users[0];
        if (tenantId) {
            const found = users.find(u => u.tenantId === tenantId);
            if (!found)
                throw new common_1.UnauthorizedException('User not found in this tenant');
            user = found;
        }
        else if (users.length > 1) {
            throw new common_1.BadRequestException('Multiple accounts found. Please specify Tenant ID.');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials (no password set)');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateTokens(user.id, user.email, user.tenantId, 'USER');
    }
    async generateTokens(userId, email, tenantId, role) {
        const payload = { sub: userId, email, tenantId, role };
        const secret = this.config.getOrThrow('JWT_SECRET');
        const refreshSecret = this.config.getOrThrow('JWT_REFRESH_SECRET');
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { secret, expiresIn: '15m' }),
            this.jwtService.signAsync(payload, { secret: refreshSecret, expiresIn: '7d' }),
        ]);
        return {
            accessToken,
            refreshToken,
            user: { id: userId, email, tenantId, role },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map