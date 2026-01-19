import { Controller, Get, Post, Body, Param, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateLoyaltyProgramSchema, CreateLoyaltyTierSchema, CreateLoyaltyRewardSchema, RedeemRewardSchema } from '@ecommerce/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ClsService } from 'nestjs-cls';

@Controller('loyalty')
export class LoyaltyController {
  constructor(
    private readonly loyaltyService: LoyaltyService,
    private readonly cls: ClsService,
  ) {}

  @Get('program')
  async getProgram() {
    const tenantId = this.cls.get('TENANT_ID');
    return this.loyaltyService.getProgram(tenantId);
  }

  @Post('program')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER')
  async createProgram(@Body(new ZodValidationPipe(CreateLoyaltyProgramSchema)) body: any) {
    const tenantId = this.cls.get('TENANT_ID');
    return this.loyaltyService.createProgram(tenantId, body);
  }

  @Post('tiers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER')
  async createTier(@Body(new ZodValidationPipe(CreateLoyaltyTierSchema)) body: any) {
    const tenantId = this.cls.get('TENANT_ID');
    return this.loyaltyService.createTier(tenantId, body);
  }

  @Post('rewards')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER')
  async createReward(@Body(new ZodValidationPipe(CreateLoyaltyRewardSchema)) body: any) {
    const tenantId = this.cls.get('TENANT_ID');
    return this.loyaltyService.createReward(tenantId, body);
  }

  // Customer endpoints
  
  @Post('redeem')
  @UseGuards(JwtAuthGuard)
  async redeemReward(@Req() req: any, @Body(new ZodValidationPipe(RedeemRewardSchema)) body: any) {
     const tenantId = this.cls.get('TENANT_ID');
     const userId = req.user.id;
     return this.loyaltyService.redeemReward(tenantId, userId, body.rewardId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req: any) {
    return this.loyaltyService.getHistory(req.user.id);
  }
}
