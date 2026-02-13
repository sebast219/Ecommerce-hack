// PRODUCT CARD COMPONENT - EJERCICIO PRÁCTICO
// OBJETIVO: Aprender a construir un componente React desde cero

import React from 'react';
import { Product } from '@/types/cart';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  // TODO: Tu tarea es implementar este componente paso a paso
  
  return (
    <div className="border rounded-lg p-4">
      {/* 
        PASO 1: ESTRUCTURA BÁSICA
        - Crea un div contenedor con Tailwind classes
        - Usa viewMode para cambiar entre grid y list layout
        - Ejemplo: className={viewMode === 'grid' ? 'w-full' : 'flex gap-4'}
      */}

      <div className="text-center">
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
        
        {
          product.images.length > 0 && (
            <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover rounded" />
          )
        }
        {/* 
          PASO 2: IMAGEN DEL PRODUCTO
          - Usa la etiqueta <img>
          - product.images[0] es la imagen principal
          - Agrega fallback: '/placeholder.jpg'
          - Classes: w-full h-48 object-cover rounded
        */}

        {
          product.description && (
            <p className="mt-4 text-gray-600 line-clamp-2">{product.description}</p>
          )
        }
        
        {/* 
          PASO 3: INFORMACIÓN DEL PRODUCTO
          - Muestra: name, description, price, sku
          - Usa truncamiento para description: line-clamp-2
          - Formatea precio: ${product.price.toFixed(2)}
        */}
        {
          product.sku && (
            <p className="mt-4 text-gray-600">SKU: {product.sku}</p>
          )
        }
        
        {/* 
          PASO 4: ESTADO DE INVENTARIO
          - Revisa product.inventory?.quantity
          - Muestra "En stock" si > 0, "Agotado" si = 0
          - Usa colores: text-green-600 o text-red-600
        */}
        
        {/* 
          PASO 5: BOTÓN DE AGREGAR AL CARRITO
          - Importa useCartStore de '@/store/cart-store'
          - Usa addItem(product, 1)
          - Deshabilita botón si no hay stock
          - Ejemplo: 
            const { addItem } = useCartStore();
            const handleAddToCart = () => addItem(product, 1);
        */}
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}
