import { Module, Global } from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { TenancyMiddleware } from './tenancy.middleware';
import { PrismaModule } from '../prisma/prisma.module';
import { ClsModule } from 'nestjs-cls';

@Global()
@Module({
  imports: [PrismaModule, ClsModule],
  providers: [TenancyService, TenancyMiddleware],
  exports: [TenancyService],
})
export class TenancyModule {}
