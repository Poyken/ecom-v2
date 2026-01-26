import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { OnboardTenantDto } from './dto/tenant.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tenants')
@Controller('tenants')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Post('onboard')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Provision a new tenant and admin user' })
  @ApiResponse({ status: 201, description: 'Tenant successfully provisioned' })
  @ApiResponse({ status: 409, description: 'Domain already exists' })
  async onboard(@Body() dto: OnboardTenantDto) {
    return this.tenantService.onboard(dto);
  }
}
