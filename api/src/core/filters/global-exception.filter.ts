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

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';
    let details: Record<string, unknown> | undefined;

    // Handle HTTP Exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res.message as string) || message;
        code = this.getErrorCode(status);
        if (Array.isArray(res.message)) {
          details = { errors: res.message };
        }
      }
    }
    // Handle Prisma Errors
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = this.handlePrismaError(exception);
      status = prismaError.status;
      code = prismaError.code;
      message = prismaError.message;
    }
    // Handle Prisma Validation Errors
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      code = 'VALIDATION_ERROR';
      message = 'Invalid data provided';
    }
    // Handle other Errors
    else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log error
    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url}`, exception);
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${message}`);
    }

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_ERROR',
    };
    return codeMap[status] || 'UNKNOWN_ERROR';
  }

  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
    status: number;
    code: string;
    message: string;
  } {
    switch (error.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          code: 'DUPLICATE_ENTRY',
          message: `Duplicate value for ${(error.meta?.target as string[])?.join(', ') || 'field'}`,
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          code: 'NOT_FOUND',
          message: 'Record not found',
        };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          code: 'FOREIGN_KEY_ERROR',
          message: 'Related record not found',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          code: 'DATABASE_ERROR',
          message: 'Database operation failed',
        };
    }
  }
}
