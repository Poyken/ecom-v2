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

export class CreateOptionValueDto {
  @ApiProperty({ example: 'Blue' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: 'Ocean Blue' })
  @IsString()
  @IsNotEmpty()
  displayName: string;
}

export class CreateProductOptionDto {
  @ApiProperty({ example: 'Color' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => CreateOptionValueDto)
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ type: [CreateOptionValueDto] })
  values: CreateOptionValueDto[];
}

export class CreateSkuValueDto {
  @ApiProperty({ description: 'The value of the option, e.g., Blue' })
  @IsString()
  @IsNotEmpty()
  optionName: string;

  @ApiProperty({ description: 'The specific value selected, e.g., Blue' })
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateSkuDto {
  @ApiProperty({ example: 'IPHONE-15-PRO-BLUE-256' })
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

  @ApiProperty({
    type: [CreateSkuValueDto],
    description: 'Mapping of this SKU to specific option values',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkuValueDto)
  optionValues: CreateSkuValueDto[];
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

  @ApiPropertyOptional({ example: 'The latest iPhone' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  basePrice: number;

  @ApiPropertyOptional({ example: 'category-uuid' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ type: [CreateProductOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionDto)
  options: CreateProductOptionDto[];

  @ApiProperty({ type: [CreateSkuDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkuDto)
  skus: CreateSkuDto[];
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'electronics' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'Gadgets and more' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'parent-uuid' })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
