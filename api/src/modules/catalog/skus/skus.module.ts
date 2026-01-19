import { Module } from '@nestjs/common';
import { SkusService } from './skus.service';
import { SkusController } from './skus.controller';

import { InventoryModule } from '../../inventory/inventory.module';

@Module({
  imports: [InventoryModule],
  controllers: [SkusController],
  providers: [SkusService],
})
export class SkusModule {}
