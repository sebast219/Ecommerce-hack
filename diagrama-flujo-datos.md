# Diagrama de Flujo de Datos (DFD) - Ecommerce Cybersecurity Store

## Nivel 0 - Diagrama de Contexto

```
+---------------------+          +---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |          |   Sistema de Pagos  |
|      Cliente        |          |                     |          |    (Stripe/PayPal)  |
+----------+----------+          +----------+----------+          +----------+----------+
           |                                 |                                 |
           | 1. Solicitar productos         |                                 |
           | 2. Registrarse/Login          |                                 |
           | 3. Agregar al carrito          |                                 |
           | 4. Realizar pedido             |                                 |
           | 5. Gestionar perfil           |                                 |
           | 6. Ver historial               |                                 |
           v                                 v                                 v
+--------------------------------------------------------------------------------------------+
|                     ECOMMERCE CYBERSECURITY STORE (Sistema)                               |
|                                                                                           |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |   Gestión de        |    |   Gestión de        |    |   Gestión de        |          |
|  |   Productos         |    |   Usuarios          |    |   Pedidos           |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |   Base de Datos     |    |   Base de Datos     |    |   Base de Datos     |          |
|  |   PostgreSQL        |    |   PostgreSQL        |    |   PostgreSQL        |          |
|  +---------------------+    +---------------------+    +---------------------+          |
+--------------------------------------------------------------------------------------------+
           |                                 |                                 |
           | 7. Productos disponibles       |                                 |
           | 8. Confirmación de pedido      |                                 |
           | 9. Información de perfil       |                                 |
           | 10. Historial de compras       |                                 |
           | 11. Gestión de productos       |                                 |
           | 12. Reportes de ventas         |                                 |
           v                                 v                                 v
+---------------------+          +---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |          |   Sistema de Pagos  |
|      Cliente        |          |                     |          |    (Stripe/PayPal)  |
+---------------------+          +---------------------+          +---------------------+

```

## Nivel 1 - Procesos Principales

```
+---------------------+          +---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |          |   Sistema de Pagos  |
|      Cliente        |          |                     |          |    (Stripe/PayPal)  |
+----------+----------+          +----------+----------+          +----------+----------+
           |                                 |                                 |
           |                                 |                                 |
           v                                 v                                 v
+-------------------------------------------------------------------------------------------+
|                                   SISTEMA ECOMMERCE                                        |
|                                                                                           |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |   1.0 Autenticación |    |   2.0 Catálogo de   |    |   3.0 Carrito de    |          |
|  |        y            |    |      Productos      |    |      Compras        |          |
|  |      Perfil         |    +----------+----------+    +----------+----------+          |
|  +----------+----------+             |                       |                       |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |   4.0 Gestión de    |    |   5.0 Proceso de    |    |   6.0 Administración|          |
|  |      Pedidos        |    |      Checkout       |    |      de Productos   |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |   7.0 Reportes y    |    |   8.0 Notificaciones|    |   9.0 Gestión de    |          |
|  |      Analytics      |    |                     |    |      Inventario      |          |
|  +---------------------+    +---------------------+    +---------------------+          |
|                                                                                           |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |   D1: Usuarios      |    |   D2: Productos     |    |   D3: Pedidos       |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |   D4: Carrito       |    |   D5: Categorías    |    |   D6: Direcciones   |          |
|  +---------------------+    +---------------------+    +---------------------+          |
+-------------------------------------------------------------------------------------------+
```

## Nivel 2 - Detalle de Procesos

### Proceso 1.0: Autenticación y Perfil

```
+---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |
|      Cliente        |          |                     |
+----------+----------+          +----------+----------+
           |                                 |
           | 1.1 Solicitar registro          |
           | 1.2 Solicitar login             |
           | 1.3 Actualizar perfil           |
           | 1.4 Gestionar direcciones       |
           | 1.5 Gestionar métodos pago      |
           | 1.6 Ver historial               |
           | 1.7 Cerrar sesión              |
           v                                 v
+-----------------------------------------------------+
|              1.0 AUTENTICACIÓN Y PERFIL             |
|                                                     |
|  +---------------------+    +---------------------+ |
|  |  1.1 Validar        |    |  1.2 Gestión de    | |
|  |  Credenciales       |    |  Perfil Usuario    | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             v                       v             |
|  +---------------------+    +---------------------+ |
|  |  1.3 Gestión de    |    |  1.4 Gestión de    | |
|  |  Direcciones       |    |  Métodos de Pago   | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             v                       v             |
|  +---------------------+    +---------------------+ |
|  |  1.5 Historial de   |    |  1.6 Sesiones      | |
|  |  Compras           |    |  Activas           | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             +-----------+-----------+             |
|                         |                             |
|                         v                             |
|  +---------------------+    +---------------------+     |
|  |   D1: Usuarios      |    |   D6: Direcciones   |     |
|  +----------+----------+    +----------+----------+     |
|             |                       |                 |
|             v                       v                 |
|  +---------------------+    +---------------------+     |
|  |   D7: Métodos Pago  |    |   D8: Sesiones      |     |
|  +---------------------+    +---------------------+     |
+-----------------------------------------------------+
           |                                 |
           | 1.8 Confirmación/Errores         |
           | 1.9 Datos de perfil              |
           | 1.10 Historial de compras        |
           v                                 v
+---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |
|      Cliente        |          |                     |
+---------------------+          +---------------------+
```

### Proceso 2.0: Catálogo de Productos

```
+---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |
|      Cliente        |          |                     |
+----------+----------+          +----------+----------+
           |                                 |
           | 2.1 Buscar productos            |
           | 2.2 Filtrar por categoría       |
           | 2.3 Ver detalles producto        |
           | 2.4 Agregar al carrito           |
           | 2.5 Ver productos destacados     |
           | 2.6 Comparar productos          |
           | 2.7 Crear/Editar/Eliminar (Admin)|
           v                                 v
+-----------------------------------------------------+
|                2.0 CATÁLOGO DE PRODUCTOS              |
|                                                     |
|  +---------------------+    +---------------------+ |
|  |  2.1 Búsqueda y     |    |  2.2 Filtrado por   | |
|  |  Filtros            |    |  Categorías         | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             v                       v             |
|  +---------------------+    +---------------------+ |
|  |  2.3 Detalles de    |    |  2.4 Gestión de    | |
|  |  Producto          |    |  Carrito           | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             v                       v             |
|  +---------------------+    +---------------------+ |
|  |  2.5 Productos      |    |  2.6 Comparación    | |
|  |  Destacados         |    |  de Productos      | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             v                       v             |
|  +---------------------+    +---------------------+ |
|  |  2.7 CRUD Productos|    |  2.8 Gestión de    | |
|  |  (Admin)            |    |  Inventario        | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             +-----------+-----------+             |
|                         |                             |
|                         v                             |
|  +---------------------+    +---------------------+     |
|  |   D2: Productos     |    |   D5: Categorías    |     |
|  +----------+----------+    +----------+----------+     |
|             |                       |                 |
|             v                       v                 |
|  +---------------------+    +---------------------+     |
|  |   D9: Inventario    |    |   D10: Reviews      |     |
|  +---------------------+    +---------------------+     |
+-----------------------------------------------------+
           |                                 |
           | 2.9 Lista de productos           |
           | 2.10 Detalles del producto        |
           | 2.11 Confirmación agregado        |
           | 2.12 Productos actualizados        |
           v                                 v
+---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |
|      Cliente        |          |                     |
+---------------------+          +---------------------+
```

### Proceso 3.0: Carrito de Compras

```
+---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |
|      Cliente        |          |                     |
+----------+----------+          +----------+----------+
           |                                 |
           | 3.1 Ver carrito                  |
           | 3.2 Agregar producto             |
           | 3.3 Actualizar cantidad          |
           | 3.4 Eliminar producto            |
           | 3.5 Vaciar carrito               |
           | 3.6 Aplicar descuentos            |
           | 3.7 Calcular total               |
           v                                 v
+-----------------------------------------------------+
|               3.0 CARRITO DE COMPRAS                 |
|                                                     |
|  +---------------------+    +---------------------+ |
|  |  3.1 Visualización  |    |  3.2 Gestión de    | |
|  |  del Carrito        |    |  Items             | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             v                       v             |
|  +---------------------+    +---------------------+ |
|  |  3.3 Actualización  |    |  3.4 Eliminación    | |
|  |  de Cantidad        |    |  de Items          | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             v                       v             |
|  +---------------------+    +---------------------+ |
|  |  3.5 Cálculo de     |    |  3.6 Aplicación de  | |
|  |  Totales            |    |  Descuentos         | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             v                       v             |
|  +---------------------+    +---------------------+ |
|  |  3.7 Validación de |    |  3.8 Persistencia   | |
|  |  Stock              |    |  del Carrito       | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             +-----------+-----------+             |
|                         |                             |
|                         v                             |
|  +---------------------+    +---------------------+     |
|  |   D4: Carrito       |    |   D2: Productos     |     |
|  +----------+----------+    +----------+----------+     |
|             |                       |                 |
|             v                       v                 |
|  +---------------------+    +---------------------+     |
|  |   D9: Inventario    |    |   D11: Descuentos   |     |
|  +---------------------+    +---------------------+     |
+-----------------------------------------------------+
           |                                 |
           | 3.9 Estado del carrito           |
           | 3.10 Total calculado             |
           | 3.11 Confirmación de cambios     |
           | 3.12 Errores de stock             |
           v                                 v
+---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |
|      Cliente        |          |                     |
+---------------------+          +---------------------+
```

### Proceso 4.0: Gestión de Pedidos

```
+---------------------+          +---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |          |   Sistema de Pagos  |
|      Cliente        |          |                     |          |    (Stripe/PayPal)  |
+----------+----------+          +----------+----------+          +----------+----------+
           |                                 |                                 |
           | 4.1 Crear pedido                |                                 |
           | 4.2 Seleccionar dirección       |                                 |
           | 4.3 Seleccionar método pago     |                                 |
           | 4.4 Confirmar pedido            |                                 |
           | 4.5 Ver historial pedidos       |                                 |
           | 4.6 Cancelar pedido             |                                 |
           | 4.7 Rastrear pedido              |                                 |
           | 4.8 Gestionar pedidos (Admin)    |                                 |
           v                                 v                                 v
+-------------------------------------------------------------------------------------------+
|                     4.0 GESTIÓN DE PEDIDOS                                                |
|                                                                                           |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |  4.1 Creación de    |    |  4.2 Validación de |    |  4.3 Procesamiento |          |
|  |  Pedido            |    |  Pedido            |    |  de Pago           |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |  4.4 Gestión de     |    |  4.5 Actualización  |    |  4.6 Notificación   |          |
|  |  Estado             |    |  de Inventario     |    |  de Pedido          |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |  4.7 Historial de   |    |  4.8 Cancelación    |    |  4.9 Rastreo de     |          |
|  |  Pedidos            |    |  de Pedido          |    |  Pedido             |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |  4.10 Gestión       |    |  4.11 Reportes de   |    |  4.12 Integración   |          |
|  |  Admin              |    |  Ventas             |    |  Logística          |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             +-----------+-----------+-----------+-----------+-----------+           |
|                         |                             |                             |
|                         v                             v                             v
|  +---------------------+    +---------------------+    +---------------------+          |
|  |   D3: Pedidos       |    |   D9: Inventario    |    |   D12: Pagos        |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |   D13: Envíos       |    |   D14: Facturas     |    |   D15: Notificaciones|          |
|  +---------------------+    +---------------------+    +---------------------+          |
+-------------------------------------------------------------------------------------------+
           |                                 |                                 |
           | 4.13 Confirmación de pedido      |                                 |
           | 4.14 Estado del pedido           |                                 |
           | 4.15 Historial de pedidos        |                                 |
           | 4.16 Confirmación de pago        |                                 |
           | 4.17 Reportes de ventas          |                                 |
           v                                 v                                 v
+---------------------+          +---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |          |   Sistema de Pagos  |
|      Cliente        |          |                     |          |    (Stripe/PayPal)  |
+---------------------+          +---------------------+          +---------------------+
```

### Proceso 5.0: Proceso de Checkout

```
+---------------------+          +---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |          |   Sistema de Pagos  |
|      Cliente        |          |                     |          |    (Stripe/PayPal)  |
+----------+----------+          +----------+----------+          +----------+----------+
           |                                 |                                 |
           | 5.1 Iniciar checkout            |                                 |
           | 5.2 Revisar carrito              |                                 |
           | 5.3 Seleccionar dirección       |                                 |
           | 5.4 Seleccionar método pago     |                                 |
           | 5.5 Aplicar cupones               |                                 |
           | 5.6 Confirmar pedido             |                                 |
           | 5.7 Procesar pago                |                                 |
           | 5.8 Generar factura              |                                 |
           v                                 v                                 v
+-------------------------------------------------------------------------------------------+
|                     5.0 PROCESO DE CHECKOUT                                              |
|                                                                                           |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |  5.1 Revisión de    |    |  5.2 Selección de  |    |  5.3 Validación de  |          |
|  |  Carrito           |    |  Dirección         |    |  Datos              |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |  5.4 Selección de  |    |  5.5 Aplicación de  |    |  5.6 Cálculo de     |          |
|  |  Método Pago       |    |  Cupones           |    |  Totales            |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |  5.7 Confirmación  |    |  5.8 Procesamiento |    |  5.9 Generación de  |          |
|  |  de Pedido         |    |  de Pago           |    |  Factura            |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |  5.10 Actualización |    |  5.11 Notificación |    |  5.12 Redirección   |          |
|  |  de Inventario     |    |  de Confirmación   |    |  de Página          |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             +-----------+-----------+-----------+-----------+-----------+           |
|                         |                             |                             |
|                         v                             v                             v
|  +---------------------+    +---------------------+    +---------------------+          |
|  |   D4: Carrito       |    |   D6: Direcciones   |    |   D7: Métodos Pago  |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
|             |                       |                       |                       |
|             v                       v                       v                       |
|  +---------------------+    +---------------------+    +---------------------+          |
|  |   D11: Descuentos   |    |   D3: Pedidos       |    |   D12: Pagos        |          |
|  +----------+----------+    +----------+----------+    +----------+----------+          |
+-------------------------------------------------------------------------------------------+
           |                                 |                                 |
           | 5.13 Resumen del pedido         |                                 |
           | 5.14 Confirmación de pago       |                                 |
           | 5.15 Factura generada            |                                 |
           | 5.16 Página de confirmación     |                                 |
           | 5.17 Errores de procesamiento   |                                 |
           v                                 v                                 v
+---------------------+          +---------------------+          +---------------------+
|     Usuario         |          |    Administrador    |          |   Sistema de Pagos  |
|      Cliente        |          |                     |          |    (Stripe/PayPal)  |
+---------------------+          +---------------------+          +---------------------+
```

### Proceso 6.0: Administración de Productos

```
+---------------------+
|    Administrador    |
+----------+----------+
           |
           | 6.1 Crear producto
           | 6.2 Editar producto
           | 6.3 Eliminar producto
           | 6.4 Activar/Desactivar
           | 6.5 Gestionar inventario
           | 6.6 Subir imágenes
           | 6.7 Gestionar categorías
           | 6.8 Ver reportes de ventas
           v
+-----------------------------------------------------+
|              6.0 ADMINISTRACIÓN DE PRODUCTOS         |
|                                                     |
|  +---------------------+    +---------------------+ |
|  |  6.1 Creación de    |    |  6.2 Edición de    | |
|  |  Productos          |    |  Productos         | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             v                       v             |
|  +---------------------+    +---------------------+ |
|  |  6.3 Eliminación de  |    |  6.4 Activación/   | |
|  |  Productos          |    |  Desactivación     | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             v                       v             |
|  +---------------------+    +---------------------+ |
|  |  6.5 Gestión de     |    |  6.6 Gestión de    | |
|  |  Inventario         |    |  Imágenes          | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             v                       v             |
|  +---------------------+    +---------------------+ |
|  |  6.7 Gestión de     |    |  6.8 Reportes de   | |
|  |  Categorías         |    |  Ventas            | |
|  +----------+----------+    +----------+----------+ |
|             |                       |             |
|             +-----------+-----------+             |
|                         |                             |
|                         v                             |
|  +---------------------+    +---------------------+     |
|  |   D2: Productos     |    |   D5: Categorías    |     |
|  +----------+----------+    +----------+----------+     |
|             |                       |                 |
|             v                       v                 |
|  +---------------------+    +---------------------+     |
|  |   D9: Inventario    |    |   D16: Reportes     |     |
|  +---------------------+    +---------------------+     |
+-----------------------------------------------------+
           |
           | 6.9 Producto creado/editado/eliminado
           | 6.10 Inventario actualizado
           | 6.11 Imágenes subidas
           | 6.12 Categorías gestionadas
           | 6.13 Reportes generados
           v
+---------------------+
|    Administrador    |
+---------------------+
```

## Diccionario de Datos

### Entidades Externas
- **Usuario Cliente**: Persona que compra productos
- **Administrador**: Persona que gestiona el sistema
- **Sistema de Pagos**: Stripe, PayPal, etc.

### Procesos
- **1.0 Autenticación y Perfil**: Gestión de usuarios y sesiones
- **2.0 Catálogo de Productos**: Visualización y búsqueda de productos
- **3.0 Carrito de Compras**: Gestión del carrito de compras
- **4.0 Gestión de Pedidos**: Creación y seguimiento de pedidos
- **5.0 Proceso de Checkout**: Flujo de compra completo
- **6.0 Administración de Productos**: CRUD de productos para admin

### Almacenes de Datos (Data Stores)
- **D1: Usuarios**: Información de usuarios y credenciales
- **D2: Productos**: Catálogo completo de productos
- **D3: Pedidos**: Historial y estado de pedidos
- **D4: Carrito**: Items en el carrito de usuarios
- **D5: Categorías**: Clasificación de productos
- **D6: Direcciones**: Direcciones de envío de usuarios
- **D7: Métodos Pago**: Tarjetas y métodos de pago
- **D8: Sesiones**: Sesiones activas de usuarios
- **D9: Inventario**: Control de stock
- **D10: Reviews**: Valoraciones de productos
- **D11: Descuentos**: Cupones y promociones
- **D12: Pagos**: Transacciones financieras
- **D13: Envíos**: Información de envíos
- **D14: Facturas**: Facturas generadas
- **D15: Notificaciones**: Mensajes al usuario
- **D16: Reportes**: Reportes y analytics

### Flujos de Datos Principales

#### Flujos de Entrada
1. **Solicitudes del Usuario**: Búsquedas, compras, gestión de perfil
2. **Acciones de Administración**: CRUD de productos, reportes
3. **Respuestas de Sistema de Pagos**: Confirmaciones, rechazos

#### Flujos de Salida
1. **Respuestas al Usuario**: Productos, confirmaciones, errores
2. **Reportes al Administrador**: Ventas, inventario, analytics
3. **Solicitudes de Pago**: Transacciones, reembolsos

#### Flujos Internos
1. **Validación de Datos**: Autenticación, stock, precios
2. **Procesamiento de Lógica**: Cálculos, reglas de negocio
3. **Actualización de Estados**: Pedidos, inventario, perfiles

## Reglas de Negocio

### Autenticación
- Los usuarios deben registrarse para realizar compras
- Los administradores tienen acceso completo al sistema
- Las sesiones expiran después de 24 horas

### Productos
- Los productos pueden estar activos o inactivos
- El stock debe ser mayor a 0 para vender
- Los precios pueden tener descuentos

### Pedidos
- Un pedido requiere dirección y método de pago
- Los pedidos pueden cancelarse antes del envío
- El inventario se actualiza al confirmar pedido

### Pagos
- Los pagos se procesan a través de sistemas externos
- Los pagos fallidos cancelan el pedido
- Se generan facturas automáticas

Este DFD muestra el flujo completo de datos en el sistema ecommerce de ciberseguridad, desde la interacción del usuario hasta la gestión administrativa y el procesamiento de pagos.
