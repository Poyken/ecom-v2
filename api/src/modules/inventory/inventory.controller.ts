import { Controller, Get, Post, Body, UseGuards, Param, UsePipes } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdjustInventorySchema, TransferInventorySchema } from '@ecommerce/shared';
import type { AdjustInventoryDto, TransferInventoryDto } from '@ecommerce/shared';

import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('sku/:id')
  getAvailableStock(@Param('id') skuId: string) {
    return this.inventoryService.getAvailableStock(skuId);
  }

  @Post('adjust/:skuId')
  @Roles('OWNER', 'ADMIN')
  @UsePipes(new ZodValidationPipe(AdjustInventorySchema))
  adjustStock(
      @Param('skuId') skuId: string, 
      @Body() dto: AdjustInventoryDto
  ) {
    return this.inventoryService.adjustStock(skuId, dto);
  }

  @Post('transfer/:skuId')
  @Roles('OWNER', 'ADMIN')
  @UsePipes(new ZodValidationPipe(TransferInventorySchema))
  transferStock(
      @Param('skuId') skuId: string,
      @Body() dto: TransferInventoryDto
  ) {
    const { fromWarehouseId, toWarehouseId, quantity, reason } = dto;
    return this.inventoryService.transferStock(skuId, fromWarehouseId, toWarehouseId, quantity, reason);
  }
}

