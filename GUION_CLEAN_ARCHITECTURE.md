# 🎬 Guion Video: Clean Architecture en E-commerce Cybersecurity Store

## 📋 Información del Video
- **Duración**: 10 minutos
- **Tema**: Clean Architecture aplicada a procesamiento de pedidos y pagos
- **Audiencia**: Desarrolladores y arquitectos de software

---

## 🎯 Estructura del Video

### **0:00 - 1:00 Introducción (1 min)**
```
🎙️ "¡Hola! Hoy vamos a desglosar cómo implementamos Clean Architecture 
en nuestro e-commerce de ciberseguridad. Veremos cómo las 4 capas 
interactúan para procesar un pedido y un pago con Stripe."

📊 "Nuestra arquitectura tiene 4 capas principales:
• Domain: Entidades y reglas de negocio
• Application: Casos de uso y lógica de aplicación
• Infrastructure: Base de datos y servicios externos
• Presentation: Controllers y API REST"
```

### **1:00 - 2:30 Capa Domain (1.5 min)**
```
🏗️ "Empecemos con la capa Domain - el corazón de nuestra aplicación."

📁 "En /src/domain/entities encontramos las entidades puras:
• Order: Define estructura completa de pedidos
• User: Entidad de usuarios con validaciones
• Product: Entidad de productos con reglas de negocio
• Cart: Entidad del carrito de compras"

💡 "Estas entidades no dependen de nada externo. 
Solo definen las reglas de negocio y estructura de datos."

📝 "Por ejemplo, Order.entity.ts define:
- status: OrderStatus (enum con estados válidos)
- total: Money (tipo personalizado con validaciones)
- items: OrderItem[] (relación con productos)"
```

### **2:30 - 4:00 Capa Application (1.5 min)**
```
⚙️ "La capa Application contiene los casos de uso - cómo interactuamos 
con las entidades del Domain."

📁 "En /src/application/use-cases tenemos:
• manage-orders.use-case.ts: Lógica de creación y gestión de pedidos
• auth/: Casos de uso de autenticación
• products/: Gestión de productos"

🔄 "El flujo es:
1. Recibe request del Presentation Layer
2. Aplica reglas de negocio del Domain
3. Coordina múltiples repositories
4. Retorna resultado estructurado"

💼 "Por ejemplo, CreateOrderUseCase:
- Valida datos de entrada
- Calcula totales usando Money del Domain
- Coordina OrderRepository y ProductRepository
- Aplica reglas de negocio (stock, descuentos)"
```

### **4:00 - 5:30 Capa Infrastructure (1.5 min)**
```
🗄️ "Infrastructure implementa las interfaces del Domain y 
conecta con sistemas externos."

📁 "En /src/infrastructure encontramos:
• database/repositories/: Implementaciones con Prisma
• services/: StripeService para pagos
• prisma.service.ts: Conexión a PostgreSQL"

🔌 "OrderRepositoryImpl implementa IOrderRepository:
- Usa PrismaService para persistencia
- Mapea entre Prisma y Domain entities
- Maneja errores de base de datos"

💳 "StripeService en infrastructure/services:
- Crea payment intents
- Gestiona webhooks
- Maneja errores de Stripe"
```

### **5:30 - 7:00 Capa Presentation (1.5 min)**
```
🌐 "Presentation Layer expone nuestra API REST y 
maneja las requests HTTP."

📁 "En /src/presentation/controllers:
• order.controller.ts: Endpoints de pedidos
• payments.controller.ts: Endpoints de Stripe
• auth.controller.ts: Autenticación"

🔄 "El flujo es:
1. Recibe HTTP request
2. Valida con DTOs
3. Llama a Application Layer
4. Retorna HTTP response"

📡 "OrderController usa CreateOrderUseCase:
- @Post('/orders') endpoint
- Valida con AddressDto
- Inyecta dependencias automáticamente
- Retorna 201 con order creada"
```

### **7:00 - 8:30 Demo: Procesamiento de Pedido (1.5 min)**
```
🚀 "Veamos el flujo completo de un pedido:

1️⃣ Frontend envía POST /api/v1/orders
2️⃣ OrderController recibe request
3️⃣ CreateOrderUseCase procesa:
   - Valida shipping address
   - Calcula total con Money
   - Verifica stock con ProductRepository
   - Crea Order entity
4️⃣ OrderRepositoryImpl persiste en PostgreSQL
5️⃣ OrderController retorna 201 Created

📊 "Las capas se comunican así:
Presentation → Application → Domain ← Infrastructure"
```

### **8:30 - 9:30 Demo: Pago con Stripe (1 min)**
```
💳 "Para el pago con Stripe:

1️⃣ Frontend llama POST /api/v1/payments/create-payment-intent
2️⃣ PaymentsController recibe monto y moneda
3️⃣ StripeService (Infrastructure) crea PaymentIntent
4️⃣ Stripe retorna client_secret
5️⃣ Frontend usa Stripe.js para procesar pago
6️⃣ Stripe webhook confirma pago → PaymentsController
7️⃣ OrderRepository actualiza status a PAID

🔒 "La separación de responsabilidades es clave:
- Domain no sabe de Stripe
- Application coordina el flujo
- Infrastructure maneja la API de Stripe
- Presentation solo expone endpoints"
```

### **9:30 - 10:00 Conclusión (30 seg)**
```
🎯 "Resumen de Clean Architecture:

✅ Domain: Entidades puras con reglas de negocio
✅ Application: Casos de uso que coordinan entidades
✅ Infrastructure: Implementaciones concretas
✅ Presentation: API REST y controllers

🔄 "Beneficios clave:
- Testabilidad: Cada capa se puede testear independiente
- Mantenimiento: Cambios en DB no afectan lógica de negocio
- Escalabilidad: Fácil agregar nuevas features
- Flexibilidad: Podemos cambiar de PostgreSQL a MongoDB sin tocar Domain"

🚀 "¡Gracias por ver! Implementen Clean Architecture 
en sus proyectos y verán la diferencia."

💬 "¿Qué les pareció? Dejen sus preguntas en los comentarios!"
```

---

## 🎬 Notas de Producción

### **Visualizaciones Sugeridas:**
- **Diagrama de capas**: Mostrar flujo entre las 4 capas
- **Code walkthrough**: Resaltar archivos clave en cada capa
- **Flow diagram**: Animar el flujo de pedido y pago
- **Architecture benefits**: Gráfico de beneficios

### **Elementos Técnicos a Mostrar:**
- **Estructura de archivos**: Navegar por /src/ structure
- **Code snippets**: Mostrar ejemplos de cada capa
- **Dependency injection**: Mostrar cómo se inyectan dependencias
- **Error handling**: Cómo cada capa maneja errores

### **Tips para el Presentador:**
- **Hablar claro y conciso**: Evitar jerga excesiva
- **Mostrar código real**: No solo teoría
- **Enfocarse en el flujo**: Cómo las capas interactúan
- **Usar analogías**: Comparar con edificio de capas

---

## 🎯 Puntos Clave a Enfatizar

### **Separación de Responsabilidades:**
- Domain: Solo reglas de negocio
- Application: Orquestación de casos de uso
- Infrastructure: Detalles de implementación
- Presentation: Interfaz externa

### **Dependencias Invertidas:**
- Las capas internas no dependen de las externas
- Todo apunta hacia el Domain
- Interfaces definidas en el Domain

### **Beneficios Prácticos:**
- Tests unitarios más fáciles
- Cambios en DB no rompen lógica
- Múltiples interfaces (REST, GraphQL)
- Reutilización de casos de uso

---

## 📚 Recursos Adicionales

### **Para Estudio Adicional:**
- Clean Architecture de Robert C. Martin
- Domain-Driven Design (DDD)
- SOLID Principles
- Test-Driven Development

### **Documentación del Proyecto:**
- `/src/domain/entities/`: Entidades puras
- `/src/application/use-cases/`: Casos de uso
- `/src/infrastructure/`: Implementaciones
- `/src/presentation/controllers/`: API REST

---

## 🎬 Checklist del Video

- [ ] Introducción clara y concisa
- [ ] Explicación de cada capa
- [ ] Demostración de flujo de pedido
- [ ] Demostración de flujo de pago
- [ ] Beneficios destacados
- [ ] Conclusión con llamado a la acción
- [ ] Visualizaciones claras
- [ ] Código real mostrado
- [ ] Tiempo total: 10 minutos
