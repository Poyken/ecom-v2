import { Controller, Get, Post, Body, Param, UseGuards, Request, UsePipes, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateOrderSchema, UpdateOrderStatusSchema } from '@ecommerce/shared';
import type { CreateOrderDto, UpdateOrderStatusDto } from '@ecommerce/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateOrderSchema))
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.ordersService.findAll(req.user.id);
  }

  @Get('admin/all')
  @Roles('OWNER')
  findAllAdmin() {
    return this.ordersService.findAllTenant();
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.findOne(req.user.id, id);
  }

  @Post(':id/status')
  @Roles('OWNER')
  @UsePipes(new ZodValidationPipe(UpdateOrderStatusSchema))
  updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto.status, dto.notes || '', req.user.id);
  }
}


