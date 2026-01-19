import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') // Dashboard is for store owners
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(@Query('range') range?: any) {
    return this.analyticsService.getOverview(range);
  }

  @Get('top-products')
  async getTopProducts(@Query('limit') limit?: string) {
    return this.analyticsService.getTopProducts(limit ? parseInt(limit) : 5);
  }
}
