import { Injectable, Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import type { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async onModuleDestroy() {
    await this.redis.quit();
    this.logger.log('Redis connection closed');
  }

  /**
   * Get value by key
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  /**
   * Set value with optional TTL (seconds)
   */
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.setex(key, ttlSeconds, stringValue);
    } else {
      await this.redis.set(key, stringValue);
    }
  }

  /**
   * Delete key(s)
   */
  async del(...keys: string[]): Promise<number> {
    return this.redis.del(...keys);
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }

  /**
   * Get TTL of key (seconds)
   */
  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  /**
   * Set expiration on key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    return (await this.redis.expire(key, seconds)) === 1;
  }

  /**
   * Increment value
   */
  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  /**
   * Delete keys by pattern (use with caution in production)
   */
  async delByPattern(pattern: string): Promise<number> {
    const keys = await this.redis.keys(pattern);
    if (keys.length === 0) return 0;
    return this.redis.del(...keys);
  }

  /**
   * Get raw Redis client for advanced operations
   */
  getClient(): Redis {
    return this.redis;
  }
}
