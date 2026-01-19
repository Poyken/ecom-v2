import { Controller, Get, Post, Body, Param, UseGuards, Request, UsePipes } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { CreateOrderSchema } from '@ecommerce/shared';
import type { CreateOrderDto } from '@ecommerce/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateOrderSchema))
  create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.ordersService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.findOne(req.user.id, id);
  }
}
