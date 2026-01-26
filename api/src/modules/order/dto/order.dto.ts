import { IsString, IsNotEmpty, IsArray, ValidateNested, IsUUID, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 'sku-uuid' })
  @IsUUID()
  @IsNotEmpty()
  skuId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({ example: { street: '123 Main St', city: 'Hanoi' } })
  @IsOptional()
  shippingAddress?: any;

  @ApiProperty({ example: 'vnpay', enum: ['vnpay', 'cod'] })
  @IsString()
  @IsNotEmpty()
  paymentGateway: string;
}

export class OrderResponseDto {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentUrl?: string;
}
