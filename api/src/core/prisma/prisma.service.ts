import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development') {
      this.$on('query', (e) => {
        if (e.duration > 100) {
          this.logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
        }
      });
    }

    this.$on('error', (e) => {
      this.logger.error(`Prisma error: ${e.message}`);
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected from database');
  }

  /**
   * Execute operations in a transaction
   */
  async executeInTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(fn);
  }

  /**
   * Soft delete extension
   * Use: prisma.user.softDelete({ where: { id } })
   */
  get softDelete() {
    return {
      user: (args: Prisma.UserUpdateArgs) =>
        this.user.update({ ...args, data: { ...args.data, deletedAt: new Date() } }),
      product: (args: Prisma.ProductUpdateArgs) =>
        this.product.update({ ...args, data: { ...args.data, deletedAt: new Date() } }),
      order: (args: Prisma.OrderUpdateArgs) =>
        this.order.update({ ...args, data: { ...args.data, deletedAt: new Date() } }),
      tenant: (args: Prisma.TenantUpdateArgs) =>
        this.tenant.update({ ...args, data: { ...args.data, deletedAt: new Date() } }),
    };
  }

  /**
   * Restore soft deleted entity
   */
  get restore() {
    return {
      user: (args: Prisma.UserUpdateArgs) =>
        this.user.update({ ...args, data: { ...args.data, deletedAt: null } }),
      product: (args: Prisma.ProductUpdateArgs) =>
        this.product.update({ ...args, data: { ...args.data, deletedAt: null } }),
      order: (args: Prisma.OrderUpdateArgs) =>
        this.order.update({ ...args, data: { ...args.data, deletedAt: null } }),
      tenant: (args: Prisma.TenantUpdateArgs) =>
        this.tenant.update({ ...args, data: { ...args.data, deletedAt: null } }),
    };
  }
}
