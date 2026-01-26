import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'electronics' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'All electronic gadgets' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'uuid-of-parent-category' })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}

export class CreateSkuDto {
  @ApiProperty({ example: 'IPHONE-15-PRO-BLUE' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 1099.99 })
  @IsNumber()
  @IsOptional()
  comparePrice?: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  stock: number;

  @ApiProperty({ example: { Color: 'Blue', Capacity: '256GB' } })
  @IsOptional()
  attributes?: Record<string, any>;
}

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'iphone-15-pro' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'The latest iPhone with titanium' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 899.99 })
  @IsNumber()
  basePrice: number;

  @ApiPropertyOptional({ example: 'category-uuid' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ type: [CreateSkuDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkuDto)
  skus: CreateSkuDto[];
}
