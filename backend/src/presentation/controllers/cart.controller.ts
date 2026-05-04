import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  UseGuards, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AddToCartDto, UpdateCartItemDto } from '../../application/dto/cart.dto';
import { AddToCartUseCase } from '../../application/use-cases/cart/add-to-cart.use-case';
import { GetCartUseCase } from '../../application/use-cases/cart/get-cart.use-case';
import { UpdateCartItemUseCase } from '../../application/use-cases/cart/update-cart-item.use-case';
import { RemoveFromCartUseCase } from '../../application/use-cases/cart/remove-from-cart.use-case';
import { ClearCartUseCase } from '../../application/use-cases/cart/clear-cart.use-case';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(
    private readonly addToCart: AddToCartUseCase,
    private readonly getCart: GetCartUseCase,
    private readonly updateCartItem: UpdateCartItemUseCase,
    private readonly removeFromCart: RemoveFromCartUseCase,
    private readonly clearCart: ClearCartUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart with items and totals' })
  async get(@Req() req: any) {
    const result = await this.getCart.execute(req.user.id);
    return { success: true, data: result };
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @HttpCode(HttpStatus.CREATED)
  async add(@Req() req: any, @Body() dto: AddToCartDto) {
    const item = await this.addToCart.execute({
      userId: req.user.id,
      productId: dto.productId,
      quantity: dto.quantity,
    });
    return { success: true, data: item };
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const item = await this.updateCartItem.execute(req.user.id, id, dto.quantity);
    return { success: true, data: item };
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.removeFromCart.execute(req.user.id, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  async clear(@Req() req: any) {
    const result = await this.clearCart.execute(req.user.id);
    return { success: true, data: result };
  }
}

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class WishlistController {
  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  async getWishlist() {
    return { success: true, message: 'Wishlist - TODO: Implement' };
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add item to wishlist' })
  async addToWishlist(@Body() body: { productId: string }) {
    return { success: true, message: 'Add to wishlist - TODO: Implement' };
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  async removeFromWishlist(@Param('productId') productId: string) {
    return { success: true, message: 'Remove from wishlist - TODO: Implement' };
  }
}
