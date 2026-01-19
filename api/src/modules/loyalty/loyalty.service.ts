import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateLoyaltyProgramSchema, CreateLoyaltyTierSchema, CreateLoyaltyRewardSchema, LoyaltyTransactionType } from '@ecommerce/shared';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async getProgram(tenantId: string) {
    return this.prisma.loyaltyProgram.findUnique({
      where: { tenantId },
      include: {
        tiers: { orderBy: { minSpend: 'asc' } },
        rewards: { where: { isActive: true } },
      },
    });
  }

  async createProgram(tenantId: string, data: z.infer<typeof CreateLoyaltyProgramSchema>) {
    const exists = await this.prisma.loyaltyProgram.findUnique({ where: { tenantId } });
    if (exists) throw new BadRequestException('Loyalty program already exists for this tenant');

    return this.prisma.loyaltyProgram.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async createTier(tenantId: string, data: z.infer<typeof CreateLoyaltyTierSchema>) {
    const program = await this.prisma.loyaltyProgram.findUnique({ where: { tenantId } });
    if (!program) throw new NotFoundException('Loyalty program not found');

    if (program.id !== data.programId) throw new BadRequestException('Invalid program ID');

    return this.prisma.loyaltyTier.create({
      data: {
        name: data.name,
        minSpend: data.minSpend,
        benefits: data.benefits ?? [],
        programId: data.programId,
      },
    });
  }

  async createReward(tenantId: string, data: z.infer<typeof CreateLoyaltyRewardSchema>) {
     const program = await this.prisma.loyaltyProgram.findUnique({ where: { tenantId } });
    if (!program) throw new NotFoundException('Loyalty program not found');
    
    if (program.id !== data.programId) throw new BadRequestException('Invalid program ID');

    return this.prisma.loyaltyReward.create({
      data,
    });
  }

  async earnPoints(tenantId: string, userId: string, amount: number, sourceId: string, description?: string) {
    if (amount <= 0) return;

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Create Log
        await tx.loyaltyPointTransaction.create({
            data: {
                userId,
                amount,
                type: 'EARN_ORDER',
                sourceId,
                description,
            }
        });

        // Update User Balance
        await tx.user.update({
            where: { id: userId },
            data: {
                loyaltyPoints: { increment: amount }
            }
        });
    });

    // Check Upgrade
    await this.checkTierUpgrade(tenantId, userId);
  }

  async redeemReward(tenantId: string, userId: string, rewardId: string) {
    const reward = await this.prisma.loyaltyReward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new NotFoundException('Reward not found');
    if (!reward.isActive) throw new BadRequestException('Reward is inactive');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.loyaltyPoints < reward.pointsCost) {
        throw new BadRequestException('Not enough points');
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.loyaltyPointTransaction.create({
            data: {
                userId,
                amount: -reward.pointsCost,
                type: 'REDEEM_REWARD',
                sourceId: rewardId,
                description: `Redeemed ${reward.name}`,
            }
        });

        await tx.user.update({
            where: { id: userId },
            data: {
                loyaltyPoints: { decrement: reward.pointsCost }
            }
        });

        // Create Redemption Record
        const redemption = await tx.loyaltyRewardRedemption.create({
            data: {
                userId,
                rewardId,
                status: 'COMPLETED',
                code: this.generateVoucherCode(), // Simple generator
            }
        });
        
        return redemption;
    });
  }

  async checkTierUpgrade(tenantId: string, userId: string) {
    // Calculate total spend (based on Order with status DELIVERED/COMPLETED)
    // NOTE: In a real system, we might cache this or read from store_metrics
    const orders = await this.prisma.order.findMany({
        where: {
            tenantId,
            userId,
            status: { in: ['DELIVERED', 'COMPLETED'] }
        },
        select: { totalAmount: true }
    });

    const totalSpend = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    // Get Tiers
    const program = await this.prisma.loyaltyProgram.findUnique({
        where: { tenantId },
        include: { tiers: { orderBy: { minSpend: 'desc' } } }
    });

    if (!program || !program.tiers.length) return;

    // Find highest eligible tier
    const eligibleTier = program.tiers.find(tier => totalSpend >= Number(tier.minSpend));

    if (eligibleTier) {
        // Update user tier if different
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user && user.loyaltyTierId !== eligibleTier.id) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { loyaltyTierId: eligibleTier.id }
            });
            // Could send notification here
            console.log(`User ${userId} upgraded to ${eligibleTier.name}`);
        }
    }
  }

  async getHistory(userId: string) {
    return this.prisma.loyaltyPointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  private generateVoucherCode() {
    return 'VOUCHER-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
