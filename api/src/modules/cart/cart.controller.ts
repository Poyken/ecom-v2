import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UsePipes } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { AddToCartSchema, UpdateCartItemSchema } from '@ecommerce/shared';
import type { AddToCartDto, UpdateCartItemDto } from '@ecommerce/shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(AddToCartSchema))
  addToCart(@Request() req: any, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Patch('items/:id')
  @UsePipes(new ZodValidationPipe(UpdateCartItemSchema))
  updateCartItem(@Request() req: any, @Param('id') itemId: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateCartItem(req.user.id, itemId, dto);
  }

  @Delete('items/:id')
  removeCartItem(@Request() req: any, @Param('id') itemId: string) {
    return this.cartService.removeCartItem(req.user.id, itemId);
  }
  
  @Delete()
  clearCart(@Request() req: any) {
      return this.cartService.clearCart(req.user.id);
  }
}
