import { AuthService } from './auth.service';
import type { LoginDto, RegisterDto } from './dto/auth.dto';
import type { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            tenantId: string;
            role: string;
        };
    }>;
    login(dto: LoginDto, req: Request, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            tenantId: string;
            role: string;
        };
    }>;
}
