import { Controller, Get, Post, Body, Param, UseGuards, UsePipes } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateWarehouseSchema } from '@ecommerce/shared';
import type { CreateWarehouseDto } from '@ecommerce/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('warehouses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'ADMIN')
export class WarehousesController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateWarehouseSchema))
  create(@Body() dto: CreateWarehouseDto) {
    return this.inventoryService.createWarehouse(dto);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAllWarehouses();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findWarehouse(id);
  }



  @Get(':id/stock')
  getStock(@Param('id') id: string) {
    return this.inventoryService.getWarehouseStock(id);
  }

  @Get(':id/logs')
  getLogs(@Param('id') id: string) {
    return this.inventoryService.getWarehouseLogs(id);
  }
}

