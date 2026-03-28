// 🏗️ PRESENTATION CONTROLLERS - Carrito
// PROPÓSITO: Manejar requests HTTP de carrito

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import {
  AddToCartUseCase,
  UpdateCartItemUseCase,
  RemoveFromCartUseCase,
  GetCartUseCase,
} from '../../application/use-cases/cart/manage-cart.use-case';
import {
  AddToCartRequest,
  UpdateCartItemRequest,
  RemoveFromCartRequest,
  GetCartRequest,
} from '../../application/use-cases/cart/manage-cart.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

export class AddToCartDto implements AddToCartRequest {
  @IsString()
  productId: string;
  
  @IsNumber()
  quantity: number;
  
  @IsOptional()
  @IsString()
  sessionId?: string;
  
  @IsOptional()
  @IsString()
  userId?: string;
}

export class UpdateCartItemDto implements UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}

export class GetCartDto implements GetCartRequest {
  sessionId?: string;
  userId?: string;
}

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(
    private readonly addToCartUseCase: AddToCartUseCase,
    private readonly updateCartItemUseCase: UpdateCartItemUseCase,
    private readonly removeFromCartUseCase: RemoveFromCartUseCase,
    private readonly getCartUseCase: GetCartUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async getCart(@CurrentUser() user: any) {
    try {
      const result = await this.getCartUseCase.execute({ userId: user.id });

      return {
        success: true,
        data: result.cart,
        message: result.cart ? 'Cart retrieved successfully' : 'Cart not found',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addToCart(@CurrentUser() user: any, @Body() addToCartDto: AddToCartDto) {
    try {
      const result = await this.addToCartUseCase.execute({
        userId: user.id,
        productId: addToCartDto.productId,
        quantity: addToCartDto.quantity,
      });

      return {
        success: true,
        data: result.cart,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async updateCartItem(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    try {
      const result = await this.updateCartItemUseCase.execute({
        cartItemId: id,
        quantity: updateCartItemDto.quantity,
      });

      return {
        success: true,
        data: result.cart,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeFromCart(@Param('id') id: string) {
    try {
      const result = await this.removeFromCartUseCase.execute({ cartItemId: id });

      return {
        success: true,
        data: result.cart,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart(@Query() query: GetCartDto) {
    try {
      // This would need a ClearCartUseCase implementation
      return {
        success: true,
        message: 'Cart cleared - Implement ClearCartUseCase',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('total')
  @ApiOperation({ summary: 'Get cart total' })
  @ApiResponse({ status: 200, description: 'Cart total calculated successfully' })
  async getCartTotal(@Query() query: GetCartDto) {
    try {
      // This would need a GetCartTotalUseCase implementation
      return {
        success: true,
        message: 'Cart total - Implement GetCartTotalUseCase',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  // TODO: Implement wishlist controller with wishlist use cases
  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist retrieved successfully' })
  async getWishlist() {
    return {
      success: true,
      message: 'Wishlist - Implement GetWishlistUseCase',
    };
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add item to wishlist' })
  @ApiResponse({ status: 201, description: 'Item added to wishlist successfully' })
  async addToWishlist(@Body() body: { productId: string }) {
    return {
      success: true,
      message: 'Add to wishlist - Implement AddToWishlistUseCase',
    };
  }

  @Delete('items/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove item from wishlist' })
  @ApiResponse({ status: 200, description: 'Item removed from wishlist successfully' })
  async removeFromWishlist(@Param('productId') productId: string) {
    return {
      success: true,
      message: 'Remove from wishlist - Implement RemoveFromWishlistUseCase',
    };
  }
}
