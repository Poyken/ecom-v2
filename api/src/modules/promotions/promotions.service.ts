import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import type { CreatePromotionDto, UpdatePromotionDto } from '@ecommerce/shared';

@Injectable()
export class PromotionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  private get tenantId() {
    return this.cls.get('TENANT_ID');
  }

  async create(dto: CreatePromotionDto) {
    const { rules, actions, ...rest } = dto;

    return this.prisma.promotion.create({
      data: {
        ...rest,
        tenantId: this.tenantId,
        rules: { create: rules.map((r: any) => ({ ...r, tenantId: this.tenantId })) },
        actions: { create: actions.map((a: any) => ({ ...a, tenantId: this.tenantId })) },
      },
      include: { rules: true, actions: true },
    });
  }

  async findAll() {
    return this.prisma.promotion.findMany({
      where: { tenantId: this.tenantId },
      include: { rules: true, actions: true },
      orderBy: { priority: 'desc' },
    });
  }

  async findOne(id: string) {
    const promo = await this.prisma.promotion.findUnique({
      where: { id, tenantId: this.tenantId },
      include: { rules: true, actions: true },
    });
    if (!promo) throw new NotFoundException('Promotion not found');
    return promo;
  }

  async update(id: string, dto: UpdatePromotionDto) {
    const { rules, actions, ...rest } = dto;

    // Simplified update: delete old rules/actions and recreate if provided
    return this.prisma.$transaction(async (tx) => {
        if (rules) {
            await tx.promotionRule.deleteMany({ where: { promotionId: id } });
        }
        if (actions) {
            await tx.promotionAction.deleteMany({ where: { promotionId: id } });
        }

        return tx.promotion.update({
            where: { id },
            data: {
                ...rest,
                rules: rules ? { create: rules.map((r: any) => ({ ...r, tenantId: this.tenantId })) } : undefined,
                actions: actions ? { create: actions.map((a: any) => ({ ...a, tenantId: this.tenantId })) } : undefined,
            },
            include: { rules: true, actions: true }
        });
    });
  }

  async remove(id: string) {
    return this.prisma.promotion.delete({ where: { id, tenantId: this.tenantId } });
  }

  /**
   * Calculate discount for a given cart and optional voucher code
   */
  async calculateDiscount(cartItems: any[], subTotal: number, voucherCode?: string) {
    const now = new Date();
    
    // 1. Get all active promotions
    const activePromos = await this.prisma.promotion.findMany({
        where: {
            tenantId: this.tenantId,
            isActive: true,
            startDate: { lte: now },
            endDate: { gte: now },
            OR: [
                { code: null }, // Automatic
                voucherCode ? { code: voucherCode } : { id: 'none' } // specific voucher
            ]
        },
        include: { rules: true, actions: true },
        orderBy: { priority: 'desc' }
    });

    let totalDiscount = 0;
    const appliedPromos: any[] = [];

    // For simplicity: 
    // - If it's a voucher, we check if it matches.
    // - If it's automatic, we evaluate all rules.
    // - We only allow one promotion for now (Priority-based) OR sum them if configured.
    // Let's implement Single Best Promotion logic.

    for (const promo of activePromos) {
        // Evaluate Rules
        let isEligible = true;
        for (const rule of promo.rules) {
            if (!this.evaluateRule(rule, cartItems, subTotal)) {
                isEligible = false;
                break;
            }
        }

        if (isEligible) {
            // Apply Actions
            let promoDiscount = 0;
            for (const action of promo.actions) {
                promoDiscount += this.calculateActionBenefit(action, subTotal);
            }

            // Cap discount at subTotal
            if (promoDiscount > subTotal) promoDiscount = subTotal;

            if (promoDiscount > 0) {
                totalDiscount = promoDiscount;
                appliedPromos.push({
                    id: promo.id,
                    name: promo.name,
                    code: promo.code,
                    discount: promoDiscount
                });
                
                // For MVP: Stop after first eligible promotion (highest priority)
                break;
            }
        }
    }

    return {
        totalDiscount,
        appliedPromos
    };
  }

  private evaluateRule(rule: any, cartItems: any[], subTotal: number): boolean {
    const val = JSON.parse(rule.value);

    switch (rule.type) {
        case 'MIN_ORDER_VALUE':
            return subTotal >= Number(val);
        case 'SPECIFIC_PRODUCT':
            return cartItems.some((item: any) => item.sku.productId === val);
        case 'SPECIFIC_CATEGORY':
            return cartItems.some((item: any) => item.sku.product.categories.some((c: any) => c.categoryId === val));
        case 'SPECIFIC_BRAND':
            return cartItems.some((item: any) => item.sku.product.brandId === val);
        default:
            return false;
    }
  }

  private calculateActionBenefit(action: any, subTotal: number): number {
    const val = Number(action.value);

    switch (action.type) {
        case 'DISCOUNT_PERCENT':
            let discount = (subTotal * val) / 100;
            if (action.maxDiscountAmount && discount > Number(action.maxDiscountAmount)) {
                discount = Number(action.maxDiscountAmount);
            }
            return discount;
        case 'DISCOUNT_FIXED':
            return val;
        case 'FREE_SHIPPING':
            // Logic handled in order processing for shipping fee
            return 0; 
        default:
            return 0;
    }
  }
}
