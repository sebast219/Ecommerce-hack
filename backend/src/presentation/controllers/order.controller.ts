// 🏗️ PRESENTATION CONTROLLERS - Órdenes
// PROPÓSITO: Manejar requests HTTP de órdenes

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
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
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';
import {
  CreateOrderUseCase,
  GetUserOrdersUseCase,
  GetOrderUseCase,
} from '../../application/use-cases/orders/manage-orders.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  apartment?: string;
}

class CreateOrderDto {
  @IsString()
  shippingName: string;

  @IsEmail()
  shippingEmail: string;

  @IsOptional()
  @IsString()
  shippingPhone?: string;

  @IsObject()
  shippingAddress: AddressDto;

  @IsOptional()
  @IsObject()
  billingAddress?: AddressDto;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  paymentMethod: string;
}

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getUserOrdersUseCase: GetUserOrdersUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order from cart' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data or empty cart' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createOrder(
    @CurrentUser() user: any,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    try {
      const result = await this.createOrderUseCase.execute({
        userId: user.id,
        shippingName: createOrderDto.shippingName,
        shippingEmail: createOrderDto.shippingEmail,
        shippingPhone: createOrderDto.shippingPhone,
        shippingAddress: createOrderDto.shippingAddress,
        billingAddress: createOrderDto.billingAddress,
        notes: createOrderDto.notes,
        paymentMethod: createOrderDto.paymentMethod,
      });

      return {
        success: true,
        data: result.order,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserOrders(@CurrentUser() user: any) {
    try {
      const result = await this.getUserOrdersUseCase.execute({
        userId: user.id,
      });

      return {
        success: true,
        data: result.orders,
        total: result.total,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrder(@CurrentUser() user: any, @Param('id') id: string) {
    try {
      const result = await this.getOrderUseCase.execute({
        orderId: id,
        userId: user.id,
      });

      if (!result.order) {
        return {
          success: false,
          message: 'Order not found',
        };
      }

      return {
        success: true,
        data: result.order,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
