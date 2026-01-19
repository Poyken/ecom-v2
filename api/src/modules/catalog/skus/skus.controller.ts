import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards } from '@nestjs/common';
import { SkusService } from './skus.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CreateSkuSchema, UpdateSkuSchema } from '@ecommerce/shared';
import type { CreateSkuDto, UpdateSkuDto } from '@ecommerce/shared';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@Controller('skus')
export class SkusController {
  constructor(private readonly skusService: SkusService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @UsePipes(new ZodValidationPipe(UpdateSkuSchema))
  update(@Param('id') id: string, @Body() updateSkuDto: UpdateSkuDto) {
    return this.skusService.update(id, updateSkuDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  remove(@Param('id') id: string) {
    return this.skusService.remove(id);
  }
}
