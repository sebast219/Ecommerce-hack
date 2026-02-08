# 📁 Common Module - Componentes Compartidos

## 🎯 Propósito

Este directorio contiene componentes reutilizables que se usan en toda la aplicación:

- **Decorators**: Para metadatos y configuración
- **Guards**: Para autenticación y autorización  
- **Filters**: Para manejo global de errores
- **Pipes**: Para validación y transformación de datos
- **Repositories**: Para acceso a datos con Prisma

## 📂 Estructura

```
src/common/
├── decorators/
│   ├── public.decorator.ts     # Marcar endpoints públicos
│   └── roles.decorator.ts      # Definir roles requeridos
├── guards/
│   ├── auth.guard.ts           # Autenticación JWT
│   └── roles.guard.ts         # Autorización por roles
├── filters/
│   └── http-exception.filter.ts # Manejo global de errores
├── pipes/
│   └── validation.pipe.ts      # Validación personalizada
├── repositories/
│   └── base.repository.ts      # Base para repositorios
└── index.ts                   # Exportaciones centralizadas
```

## 🔧 Uso

### Importar desde el index centralizado
```typescript
import { JwtAuthGuard, Roles, Public, ValidationPipe } from '../common';
```

### En Controllers
```typescript
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  
  @Public()  // Endpoint público
  @Get('public-data')
  getPublicData() {}
  
  @Roles('ADMIN', 'VENDOR')  // Solo estos roles
  @Post()
  createProduct() {}
}
```

### En App Module
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Filter global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Pipe global de validación
  app.useGlobalPipes(new ValidationPipe());
}
```

## 🎓 Conceptos de Aprendizaje

### **1. Decorators**
- **@Public()**: Marca endpoints que no requieren autenticación
- **@Roles()**: Especifica qué roles pueden acceder a un endpoint

### **2. Guards**
- **JwtAuthGuard**: Verifica tokens JWT válidos
- **RolesGuard**: Verifica roles de usuario

### **3. Filters**
- **AllExceptionsFilter**: Maneja errores de forma consistente

### **4. Pipes**
- **ValidationPipe**: Valida y transforma DTOs automáticamente

### **5. Repositories**
- **BaseRepository**: Proporciona métodos comunes de Prisma

## 🚀 Extensión

Para agregar nuevos componentes:

1. **Crear archivo** en el directorio apropiado
2. **Exportar** en `index.ts`
3. **Documentar** su uso aquí

## 📝 Ejemplos Prácticos

### Crear un nuevo Guard
```typescript
// guards/custom.guard.ts
@Injectable()
export class CustomGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Lógica personalizada
    return true;
  }
}
```

### Crear un nuevo Decorator
```typescript
// decorators/custom.decorator.ts
export const Custom = (data: string) => SetMetadata('custom', data);
```

---

**Este módulo es la base para mantener tu código limpio, reutilizable y fácil de mantener!** 🎯
