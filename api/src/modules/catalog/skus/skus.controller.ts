import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { SkusService } from './skus.service';
import { CreateSkuSchema, UpdateSkuSchema } from '@ecommerce/shared';
import type { CreateSkuDto, UpdateSkuDto } from '@ecommerce/shared';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@Controller('skus')
export class SkusController {
  constructor(private readonly skusService: SkusService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateSkuSchema))
  create(@Body() createSkuDto: CreateSkuDto) {
    return this.skusService.create(createSkuDto);
  }

  @Get()
  findAll() {
    return this.skusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skusService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateSkuSchema))
  update(@Param('id') id: string, @Body() updateSkuDto: UpdateSkuDto) {
    return this.skusService.update(id, updateSkuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skusService.remove(id);
  }
}
