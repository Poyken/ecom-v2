import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { SkusModule } from './skus/skus.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [CategoriesModule, BrandsModule, ProductsModule, SkusModule, PrismaModule, AiModule]
})
export class CatalogModule {}
