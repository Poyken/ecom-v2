import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = (resObj.message as string | string[]) || exception.message;
        code = (resObj.code as string) || 'VALIDATION_ERROR';
        details = resObj.details || null;
      } else if (typeof res === 'string') {
        message = res;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors (P2002, etc.)
      status = HttpStatus.BAD_REQUEST;
      code = `PRISMA_${exception.code}`;
      message = 'Database error';
      details = exception.meta;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Error: ${exception.message}`,
        exception.stack,
        `${request.method} ${request.originalUrl}`,
      );
    } else {
      this.logger.error(
        'Unhandled exception',
        JSON.stringify(exception),
        `${request.method} ${request.originalUrl}`,
      );
    }

    response.status(status).json({
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
        path: request.originalUrl || request.url,
        requestId: request.headers['x-request-id'] || 'system',
      },
    });
  }
}
