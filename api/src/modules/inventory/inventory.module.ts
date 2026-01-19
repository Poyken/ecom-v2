import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { WarehousesController } from './warehouses.controller';

@Module({
  controllers: [InventoryController, WarehousesController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
