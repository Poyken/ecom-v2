import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import { startOfDay, endOfDay, subDays, format, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  private get tenantId() {
    return this.cls.get('TENANT_ID');
  }

  async getOverview(range: 'today' | '7d' | '30d' | 'this_month' = '7d') {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = endOfDay(now);

    switch (range) {
      case 'today':
        startDate = startOfDay(now);
        break;
      case '7d':
        startDate = startOfDay(subDays(now, 6));
        break;
      case '30d':
        startDate = startOfDay(subDays(now, 29));
        break;
      case 'this_month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
    }

    // Previous range for comparison
    const duration = endDate.getTime() - startDate.getTime();
    const prevStartDate = new Date(startDate.getTime() - duration - 1000);
    const prevEndDate = new Date(startDate.getTime() - 1000);

    const [currentStats, prevStats] = await Promise.all([
      this.getBasicStats(startDate, endDate),
      this.getBasicStats(prevStartDate, prevEndDate),
    ]);

    // Data for charts (daily breakdown)
    const chartData = await this.getDailyRevenue(startDate, endDate);

    return {
      stats: {
        revenue: {
          current: Number(currentStats._sum.totalAmount || 0),
          previous: Number(prevStats._sum.totalAmount || 0),
        },
        orders: {
          current: currentStats._count.id || 0,
          previous: prevStats._count.id || 0,
        },
        aov: {
          current: currentStats._count.id > 0 ? Number(currentStats._sum.totalAmount || 0) / currentStats._count.id : 0,
          previous: prevStats._count.id > 0 ? Number(prevStats._sum.totalAmount || 0) / prevStats._count.id : 0,
        },
        customers: await this.getNewCustomersCount(startDate, endDate),
      },
      chartData,
    };
  }

  private async getBasicStats(start: Date, end: Date) {
    return this.prisma.order.aggregate({
      where: {
        tenantId: this.tenantId,
        createdAt: { gte: start, lte: end },
        status: { not: 'CANCELLED' },
      },
      _sum: { totalAmount: true },
      _count: { id: true },
    });
  }

  private async getNewCustomersCount(start: Date, end: Date) {
    return this.prisma.user.count({
      where: {
        tenantId: this.tenantId,
        createdAt: { gte: start, lte: end },
        roles: {
          some: {
            role: {
              name: 'CUSTOMER'
            }
          }
        },
      },
    });
  }

  private async getDailyRevenue(start: Date, end: Date) {
    const orders = await this.prisma.order.findMany({
      where: {
        tenantId: this.tenantId,
        createdAt: { gte: start, lte: end },
        status: { not: 'CANCELLED' },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Aggregate by day
    const dailyMap = new Map<string, number>();
    orders.forEach((o: { createdAt: Date; totalAmount: any }) => {
      const day = format(o.createdAt, 'yyyy-MM-dd');
      dailyMap.set(day, (dailyMap.get(day) || 0) + Number(o.totalAmount));
    });

    const result = [];
    let current = start;
    while (current <= end) {
      const day = format(current, 'yyyy-MM-dd');
      result.push({
        date: day,
        revenue: dailyMap.get(day) || 0,
      });
      current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    }
    return result;
  }

  async getTopProducts(limit = 5) {
      // Aggregate order items to find top products
      const topItems = await this.prisma.orderItem.groupBy({
          by: ['skuId'],
          where: {
              order: {
                  tenantId: this.tenantId,
                  status: { not: 'CANCELLED' }
              }
          },
          _sum: {
              quantity: true,
              priceAtPurchase: true,
          },
          orderBy: {
              _sum: { quantity: 'desc' }
          },
          take: limit
      });

      // Get product details
      const products = await Promise.all(topItems.map(async (item: any) => {
          const sku = await this.prisma.sku.findUnique({
              where: { id: item.skuId },
              include: { product: true }
          });
          return {
              id: item.skuId,
              name: sku?.product.name || 'Unknown',
              variant: sku?.skuCode || '',
              sales: item._sum.quantity,
              revenue: Number(item._sum.priceAtPurchase || 0)
          }
      }));

      return products;
  }
}
