import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from '../prisma/prisma.service';
export declare class TenancyMiddleware implements NestMiddleware {
    private readonly cls;
    private readonly prisma;
    constructor(cls: ClsService, prisma: PrismaService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
