import { Controller, Get, Post, Body, UseGuards, Param, UsePipes } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdjustInventorySchema } from '@ecommerce/shared';
import type { AdjustInventoryDto } from '@ecommerce/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('sku/:id')
  getAvailableStock(@Param('id') skuId: string) {
    return this.inventoryService.getAvailableStock(skuId);
  }

  @Post('adjust/:skuId')
  @UsePipes(new ZodValidationPipe(AdjustInventorySchema))
  adjustStock(
      @Param('skuId') skuId: string, 
      @Body() dto: AdjustInventoryDto
  ) {
    // Note: Transaction management handled in Service
    return this.inventoryService.adjustStock(skuId, dto);
  }
}
