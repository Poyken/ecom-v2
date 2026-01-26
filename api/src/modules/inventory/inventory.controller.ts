import { Controller, Post, Get, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateWarehouseDto, UpdateStockDto } from './dto/inventory.dto';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('inventory')
@ApiHeader({
  name: 'X-Tenant-ID',
  description: 'Tenant ID for isolation context',
  required: true,
})
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('warehouses')
  @ApiOperation({ summary: 'Create a new warehouse' })
  async createWarehouse(@Body() dto: CreateWarehouseDto) {
    return this.inventoryService.createWarehouse(dto);
  }

  @Get('warehouses')
  @ApiOperation({ summary: 'List all warehouses' })
  async getWarehouses() {
    return this.inventoryService.findAllWarehouses();
  }

  @Post('stock')
  @ApiOperation({
    summary: 'Update or initialize stock for a specific SKU in a warehouse',
  })
  async updateStock(@Body() dto: UpdateStockDto) {
    return this.inventoryService.updateStock(dto);
  }

  @Get('snapshot')
  @ApiOperation({ summary: 'Get full inventory snapshot for the tenant' })
  async getSnapshot() {
    return this.inventoryService.getInventorySnapshot();
  }
}
