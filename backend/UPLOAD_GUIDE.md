# 📸 Image Upload Service - Guía de Configuración

## Descripción

El sistema de upload de imágenes permite a los administradores subir imágenes de productos a **Cloudinary** (servicio de almacenamiento en la nube).

## 🚀 Configuración Rápida

### 1. Crear cuenta en Cloudinary

1. Ir a [cloudinary.com](https://cloudinary.com)
2. Registrarse o iniciar sesión
3. Ir al **Dashboard**
4. Copiar las credenciales:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Agregar variables de entorno

En `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 3. Endpoints disponibles

#### 📤 Subir una imagen

```bash
POST /upload/product-image
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- image: <archivo>
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "publicId": "products/image_abc123",
    "fileName": "image.jpg",
    "size": 102400,
    "format": "jpg"
  },
  "message": "Image uploaded successfully"
}
```

#### 📤 Subir múltiples imágenes

```bash
POST /upload/product-images
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- images: <múltiples archivos>
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "publicId": "products/image1_abc123",
      ...
    },
    {
      "url": "https://res.cloudinary.com/.../image2.jpg",
      "publicId": "products/image2_abc123",
      ...
    }
  ],
  "message": "2 images uploaded successfully"
}
```

#### 🗑️ Eliminar una imagen

```bash
POST /upload/delete
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "publicId": "products/image_abc123"
}
```

### 4. Restricciones

- **Tamaño máximo:** 10 MB por imagen
- **Formatos aceptados:** JPG, PNG, GIF, WebP
- **Máximo a subir:** 10 imágenes por petición
- **Autenticación:** Requiere rol ADMIN

### 5. Ejemplo con cURL

```bash
# Subir una imagen
curl -X POST http://localhost:3001/api/v1/upload/product-image \
  -H "Authorization: Bearer TU_TOKEN" \
  -F "image=@/path/to/image.jpg"

# Eliminar una imagen
curl -X POST http://localhost:3001/api/v1/upload/delete \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"publicId":"products/image_abc123"}'
```

### 6. Uso en Admin

En la sección de creación/edición de productos, los administradores pueden:

1. Subir imágenes directamente
2. Copiar la URL devuelta
3. Agregar la URL al campo `images` del producto

### 7. Transformaciones de URL

La API proporciona un método para transformar URLs de Cloudinary:

```typescript
// Reducir tamaño de imagen
const smallUrl = uploadService.getTransformedUrl(
  originalUrl,
  200,  // width
  200,  // height
  80    // quality (0-100)
);

// Resultado: imagen de 200x200px con calidad 80%
```

## 🔒 Seguridad

- Solo administradores pueden subir/eliminar imágenes
- Se valida el tipo MIME de cada archivo
- Las imágenes se almacenan en carpeta `products` en Cloudinary
- Las credenciales se protegen en variables de entorno

## 🛠️ Solución de problemas

### "Environment variable not found"

Asegúrate de que las 3 variables de entorno están definidas en `.env`:
```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### "Image size must not exceed 10MB"

Usa un compresor de imágenes antes de subir. Recomendamos:
- [TinyPNG](https://tinypng.com)
- [ImageOptim](https://imageoptim.com)

### "Upload failed"

Verifica:
1. Las credenciales de Cloudinary son correctas
2. Tienes cuota disponible en Cloudinary
3. La conexión a internet es estable

## 📚 Documentación

- [Cloudinary API Docs](https://cloudinary.com/documentation)
- [SDK de Node.js](https://cloudinary.com/documentation/node_integration)
