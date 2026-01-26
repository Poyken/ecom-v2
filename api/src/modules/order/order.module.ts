import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { VnpayService } from './vnpay.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, VnpayService],
  exports: [OrderService],
})
export class OrderModule {}
