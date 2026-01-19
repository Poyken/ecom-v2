import { Controller, Post, Body, UseGuards, UsePipes } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProcessPaymentSchema } from '@ecommerce/shared';
import type { ProcessPaymentDto } from '@ecommerce/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  @UsePipes(new ZodValidationPipe(ProcessPaymentSchema))
  process(@Body() dto: ProcessPaymentDto) {
    return this.paymentsService.processPayment(dto);
  }
}
