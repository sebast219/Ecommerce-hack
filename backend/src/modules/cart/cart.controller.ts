/**
 * CART CONTROLLER - EJERCICIO PRÁCTICO
 * 
 * CONCEPTOS QUE APRENDERÁS:
 * - RESTful Endpoints: Diseño de API REST
 * - Request Validation: Validación de datos de entrada
 * - Response Formatting: Formato de respuestas consistentes
 * - Error Handling: Manejo centralizado de errores
 * - HTTP Status Codes: Códigos HTTP apropiados
 * 
 * RECURSOS DE APRENDIZAJE:
 * - NestJS Controllers: https://docs.nestjs.com/controllers
 * - HTTP Methods: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 * - REST Best Practices: https://restfulapi.net/
 */

import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // TODO: Implementa endpoint GET /cart - Obtener carrito del usuario
  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCart(@Request() req) {
    // CONCEPTO: Extraer usuario del request
    // - req.user es poblado por JwtAuthGuard
    // - Contiene el payload del JWT decodificado
    
    // CONCEPTO: Obtener carrito
    // - Usa req.user.id para identificar al usuario
    // - El service maneja creación automática si no existe
    
    console.log('GET /cart - User ID:', req.user.id);
    return this.cartService.getCartByUser(req.user.id);
  }

  // TODO: Implementa endpoint POST /cart/items - Agregar item al carrito
  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addItem(@Request() req, @Body() createCartItemDto: CreateCartItemDto) {
    // CONCEPTO: Validación automática
    // - CreateCartItemDto es validado automáticamente
    // - Si la validación falla, retorna 400
    
    // CONCEPTO: Business logic
    // - Verifica stock disponible
    // - Maneja duplicados en el carrito
    // - Calcula totales
    
    console.log('POST /cart/items - Add item:', createCartItemDto.productId);
    return this.cartService.addItem(req.user.id, createCartItemDto);
  }

  // TODO: Implementa endpoint PATCH /cart/items/:id - Actualizar item
  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  updateItem(
    @Param('id') id: string, 
    @Request() req,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    // CONCEPTO: Path parameter
    // - @Param('id') extrae ID de la URL
    // - Ejemplo: PATCH /cart/items/abc123
    
    // CONCEPTO: Validación de propiedad
    // - Verificar que el item pertenezca al usuario
    // - Prevenir acceso no autorizado
    
    console.log('PATCH /cart/items/:id - Update item:', id);
    return this.cartService.updateItem(req.user.id, id, updateCartItemDto);
  }

  // TODO: Implementa endpoint DELETE /cart/items/:id - Eliminar item
  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 204, description: 'Item removed successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  removeItem(@Param('id') id: string, @Request() req) {
    // CONCEPTO: HTTP 204 No Content
    // - Respuesta exitosa sin body
    // - @HttpCode override status code por defecto
    
    // CONCEPTO: Validación de autorización
    // - Solo el dueño puede eliminar sus items
    // - Verificar userId en el service
    
    console.log('DELETE /cart/items/:id - Remove item:', id);
    return this.cartService.removeItem(req.user.id, id);
  }

  // TODO: Implementa endpoint DELETE /cart - Vaciar carrito
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
  clearCart(@Request() req) {
    // CONCEPTO: Bulk operation
    // - Eliminar todos los items del carrito
    // - Más eficiente que eliminar uno por uno
    
    // CONCEPTO: Reset de carrito
    // - Opción de desactivar carrito actual
    // - Crear nuevo carrito en próxima operación
    
    console.log('DELETE /cart - Clear cart');
    return this.cartService.clearCart(req.user.id);
  }

  // TODO: Implementa endpoint POST /cart/apply-discount - Aplicar descuento
  @Post('apply-discount')
  @ApiOperation({ summary: 'Apply discount code' })
  @ApiResponse({ status: 200, description: 'Discount applied successfully' })
  @ApiResponse({ status: 400, description: 'Invalid discount code' })
  applyDiscount(
    @Request() req,
    @Body('discountCode') discountCode: string
  ) {
    // CONCEPTO: Body parameter específico
    // - @Body('discountCode') extrae campo específico
    // - Espera { "discountCode": "SAVE20" }
    
    // CONCEPTO: Validación de cupones
    // - Verificar fecha de expiración
    // - Validar límites de uso
    // - Aplicar reglas de negocio
    
    console.log('POST /cart/apply-discount - Code:', discountCode);
    return this.cartService.applyDiscount(req.user.id, discountCode);
  }

  // TODO: Implementa endpoint GET /cart/analytics - Estadísticas del carrito
  @Get('analytics')
  @ApiOperation({ summary: 'Get cart analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  getAnalytics(@Request() req) {
    // CONCEPTO: Business intelligence
    // - Métricas de comportamiento del usuario
    // - Datos para optimización de conversión
    // - Insights para marketing
    
    console.log('GET /cart/analytics - User analytics');
    return this.cartService.getCartAnalytics(req.user.id);
  }
}
