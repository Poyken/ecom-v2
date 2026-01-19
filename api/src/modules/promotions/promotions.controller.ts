import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import type { CreatePromotionDto, UpdatePromotionDto } from '@ecommerce/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('promotions')
@UseGuards(JwtAuthGuard)
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(id);
  }

  // Public/Customer endpoint to check voucher
  @Post('validate')
  @HttpCode(200)
  async validateVoucher(@Body() body: { code?: string, items: any[], subTotal: number }) {
      const result = await this.promotionsService.calculateDiscount(body.items, body.subTotal, body.code);
      return result;
  }
}
