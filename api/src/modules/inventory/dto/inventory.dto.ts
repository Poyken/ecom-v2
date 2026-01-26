import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({ example: 'Main Warehouse' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'WH-MAIN' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: '123 Business St, Hanoi' })
  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateStockDto {
  @ApiProperty({ example: 'sku-uuid' })
  @IsUUID()
  @IsNotEmpty()
  skuId: string;

  @ApiProperty({ example: 'warehouse-uuid' })
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty({ example: 50, description: 'Absolute quantity to set' })
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({ example: 5, description: 'Reorder point' })
  @IsNumber()
  @IsOptional()
  reorderPoint?: number;
}
