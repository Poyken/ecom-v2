import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCategoryDto, CreateProductDto } from './dto/catalog.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';

@ApiTags('catalog')
@ApiHeader({
  name: 'X-Tenant-ID',
  description: 'Tenant ID for isolation context',
  required: true,
})
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('categories')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.catalogService.createCategory(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all active categories' })
  async getCategories() {
    return this.catalogService.findAllCategories();
  }

  @Post('products')
  @ApiOperation({ summary: 'Create a new product with SKUs' })
  @ApiResponse({ status: 201, description: 'Product created' })
  async createProduct(@Body() dto: CreateProductDto) {
    return this.catalogService.createProduct(dto);
  }

  @Get('products')
  @ApiOperation({ summary: 'List all active products' })
  async getProducts() {
    return this.catalogService.findAllProducts();
  }

  @Get('products/:slug')
  @ApiOperation({ summary: 'Get product detail by slug' })
  async getProduct(@Param('slug') slug: string) {
    return this.catalogService.findProductBySlug(slug);
  }
}
