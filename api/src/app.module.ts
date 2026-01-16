import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Core modules
import { PrismaModule } from './core/prisma/prisma.module';
import { RedisModule } from './core/redis/redis.module';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';

// Feature modules
import { AuthModule } from './auth/auth.module';

// Legacy (can be removed later)
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1 minute
          limit: 100, // 100 requests per minute
        },
      ],
    }),

    // Domain events
    EventEmitterModule.forRoot(),

    // Core modules
    PrismaModule,
    RedisModule,

    // Feature modules
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Global guards
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // Global filters
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },

    // Global interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
