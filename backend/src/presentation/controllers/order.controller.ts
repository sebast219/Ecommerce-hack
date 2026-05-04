// 🏗️ PRESENTATION CONTROLLERS - Órdenes
// PROPÓSITO: Manejar requests HTTP de órdenes

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  CreateOrderDto,
  GetOrdersQueryDto,
} from '../../application/dto/order.dto';
import { CreateOrderUseCase } from '../../application/use-cases/order/create-order.use-case';
import { GetOrdersUseCase } from '../../application/use-cases/order/get-orders.use-case';
import { GetOrderByIdUseCase } from '../../application/use-cases/order/get-order-by-id.use-case';
import { CancelOrderUseCase } from '../../application/use-cases/order/cancel-order.use-case';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly getOrders: GetOrdersUseCase,
    private readonly getOrderById: GetOrderByIdUseCase,
    private readonly cancelOrder: CancelOrderUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create order from cart (checkout step 1)' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: any, @Body() dto: CreateOrderDto) {
    const order = await this.createOrder.execute({
      userId: req.user.id,
      shippingAddressId: dto.shippingAddressId,
      notes: dto.notes,
    });
    return { success: true, data: order };
  }

  @Get()
  @ApiOperation({ summary: 'Get user orders (paginated)' })
  async list(@Req() req: any, @Query() query: GetOrdersQueryDto) {
    const result = await this.getOrders.execute({
      userId: req.user.id,
      page: query.page,
      limit: query.limit,
      status: query.status,
    });
    return { success: true, ...result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  async getById(@Req() req: any, @Param('id') id: string) {
    const order = await this.getOrderById.execute(
      id,
      req.user.id,
      req.user.role,
    );
    return { success: true, data: order };
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  async cancel(@Req() req: any, @Param('id') id: string) {
    const order = await this.cancelOrder.execute(
      id,
      req.user.id,
      req.user.role,
    );
    return { success: true, data: order };
  }
}
