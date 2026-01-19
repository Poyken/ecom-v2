import { Controller, Post, Body, Req, UseGuards, HttpCode } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ClsService } from 'nestjs-cls';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly cls: ClsService
  ) {}

  @Post('chat')
  @HttpCode(200)
  async chat(@Body() body: { message: string, history?: any[] }) {
    const tenantId = this.cls.get('TENANT_ID');
    return this.aiService.chat(tenantId, body.message, body.history || []);
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(200)
  async syncAllEmbeddings() {
    const tenantId = this.cls.get('TENANT_ID');
    // Start in background
    this.aiService.syncAllEmbeddings(tenantId).catch(e => {});
    return { message: `Embedding synchronization started in background.` };
  }
}
