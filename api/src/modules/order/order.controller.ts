import { Controller, Post, Get, Body, Param, Query, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('orders')
@ApiHeader({
  name: 'X-Tenant-ID',
  description: 'Tenant ID for isolation context',
  required: true,
})
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order and generate payment URL' })
  @ApiResponse({ status: 201, description: 'Order created' })
  async createOrder(@Body() dto: CreateOrderDto, @Req() req: Request) {
    const ipAddr = req.ip || '127.0.0.1';
    return this.orderService.createOrder(dto, ipAddr);
  }

  @Get('tenant')
  @ApiOperation({ summary: 'List all orders for the current tenant' })
  async listOrders(@Query('status') status?: string) {
    return this.orderService.listTenantOrdersByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrderDetails(id);
  }

  @Get('vnpay-ipn')
  @ApiOperation({ summary: 'VNPay IPN Webhook (Internal use)' })
  async handleVnpayIpn(@Query() query: any) {
    return this.orderService.handleVnpayIpn(query);
  }
}
