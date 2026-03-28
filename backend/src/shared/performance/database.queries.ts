// 🚀 PERFORMANCE - Database Query Optimizations
// PROPÓSITO: Optimizaciones de consultas a base de datos

import { Prisma } from '@prisma/client';

// Queries optimizadas con select específicos
export const optimizedUserQueries = {
  // Solo campos necesarios para autenticación
  findByEmailForAuth: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    password: true,
    createdAt: true,
    updatedAt: true,
  },

  // Perfil de usuario sin contraseña
  findUserProfile: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    phone: true,
    bio: true,
    company: true,
    createdAt: true,
    updatedAt: true,
  },

  // Lista de usuarios para admin
  findUsersList: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  },
};

export const optimizedProductQueries = {
  // Listado de productos con relaciones mínimas
  findProductsList: {
    id: true,
    name: true,
    slug: true,
    price: true,
    comparePrice: true,
    sku: true,
    isActive: true,
    images: true,
    tags: true,
    difficulty: true,
    createdAt: true,
    updatedAt: true,
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
  },

  // Detalle completo de producto
  findProductDetail: {
    id: true,
    name: true,
    slug: true,
    description: true,
    price: true,
    comparePrice: true,
    sku: true,
    barcode: true,
    trackInventory: true,
    isActive: true,
    images: true,
    tags: true,
    weight: true,
    dimensions: true,
    seoTitle: true,
    seoDescription: true,
    difficulty: true,
    licenseType: true,
    compatibility: true,
    isPhysical: true,
    downloadUrl: true,
    createdAt: true,
    updatedAt: true,
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    },
    inventory: {
      select: {
        id: true,
        quantity: true,
        lowStockThreshold: true,
        trackQuantity: true,
      },
    },
  },

  // Para búsqueda (solo campos indexados)
  findProductForSearch: {
    id: true,
    name: true,
    slug: true,
    sku: true,
    price: true,
    images: true,
    tags: true,
    difficulty: true,
    isActive: true,
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
  },
};

export const optimizedOrderQueries = {
  // Listado de pedidos del usuario
  findUserOrders: {
    id: true,
    orderNumber: true,
    status: true,
    totalAmount: true,
    createdAt: true,
    updatedAt: true,
    items: {
      select: {
        id: true,
        quantity: true,
        price: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
          },
        },
      },
    },
  },

  // Detalle completo de pedido
  findOrderDetail: {
    id: true,
    orderNumber: true,
    status: true,
    totalAmount: true,
    subtotal: true,
    taxAmount: true,
    shippingAmount: true,
    currency: true,
    createdAt: true,
    updatedAt: true,
    user: {
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    },
    shippingAddress: true,
    billingAddress: true,
    items: {
      select: {
        id: true,
        quantity: true,
        price: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            sku: true,
            images: true,
          },
        },
      },
    },
    payment: {
      select: {
        id: true,
        status: true,
        amount: true,
        currency: true,
        provider: true,
        providerPaymentId: true,
        createdAt: true,
      },
    },
  },
};

export const optimizedCartQueries = {
  // Carrito con productos básicos
  findCartWithItems: {
    id: true,
    sessionId: true,
    createdAt: true,
    updatedAt: true,
    items: {
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            isActive: true,
          },
        },
      },
    },
  },

  // Para cálculo de totales
  findCartForTotal: {
    id: true,
    items: {
      select: {
        quantity: true,
        product: {
          select: {
            price: true,
          },
        },
      },
    },
  },
};

// Filtros optimizados para productos
export const productFilters = {
  // Búsqueda por texto con índices
  searchFilter: (search: string) => ({
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { tags: { hasSome: [search] } },
    ],
  }),

  // Filtro por precio con rangos
  priceFilter: (minPrice?: number, maxPrice?: number) => {
    const filter: any = {};
    
    if (minPrice !== undefined) {
      filter.gte = minPrice;
    }
    
    if (maxPrice !== undefined) {
      filter.lte = maxPrice;
    }
    
    return { price: Object.keys(filter).length > 0 ? filter : undefined };
  },

  // Filtro por categorías
  categoryFilter: (categoryIds: string[]) => ({
    categoryId: { in: categoryIds },
  }),

  // Filtro por tags
  tagsFilter: (tags: string[]) => ({
    tags: { hasSome: tags },
  }),

  // Filtro por dificultad
  difficultyFilter: (difficulties: string[]) => ({
    difficulty: { in: difficulties },
  }),

  // Filtro por disponibilidad
  availabilityFilter: (onlyAvailable: boolean) => {
    if (onlyAvailable) {
      return {
        isActive: true,
        inventory: {
          some: {
            quantity: { gt: 0 },
            trackQuantity: true,
          },
        },
      };
    }
    return { isActive: true };
  },
};

// Queries complejas optimizadas
export const complexQueries = {
  // Productos populares (por ventas o views)
  findPopularProducts: () => ({
    where: {
      isActive: true,
      inventory: {
        some: {
          quantity: { gt: 0 },
          trackQuantity: true,
        },
      },
    },
    orderBy: [
      { orderItems: { _count: 'desc' } },
      { views: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 20,
  }),

  // Productos en oferta
  findOnSaleProducts: () => ({
    where: {
      isActive: true,
      comparePrice: { not: null },
      inventory: {
        some: {
          quantity: { gt: 0 },
          trackQuantity: true,
        },
      },
    },
    orderBy: [
      { price: 'asc' },
      { createdAt: 'desc' },
    ],
  }),

  // Productos nuevos
  findNewProducts: () => ({
    where: {
      isActive: true,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
      },
      inventory: {
        some: {
          quantity: { gt: 0 },
          trackQuantity: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  }),

  // Búsqueda avanzada
  advancedSearch: (params: {
    search?: string;
    categoryIds?: string[];
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    difficulties?: string[];
    onlyAvailable?: boolean;
  }) => {
    const where: any = { isActive: true };

    if (params.search) {
      where.OR = productFilters.searchFilter(params.search).OR;
    }

    if (params.categoryIds && params.categoryIds.length > 0) {
      where.categoryId = { in: params.categoryIds };
    }

    if (params.tags && params.tags.length > 0) {
      where.tags = { hasSome: params.tags };
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.price = productFilters.priceFilter(params.minPrice, params.maxPrice).price;
    }

    if (params.difficulties && params.difficulties.length > 0) {
      where.difficulty = { in: params.difficulties };
    }

    if (params.onlyAvailable) {
      where.inventory = {
        some: {
          quantity: { gt: 0 },
          trackQuantity: true,
        },
      };
    }

    return where;
  },
};

// Conteos optimizados
export const countQueries = {
  // Contar productos por categoría
  countProductsByCategory: () => ({
    _count: {
      select: { id: true },
    },
  }),

  // Contar productos activos
  countActiveProducts: () => ({
    where: { isActive: true },
  }),

  // Contar productos con bajo stock
  countLowStockProducts: () => ({
    where: {
      inventory: {
        some: {
          trackQuantity: true,
          quantity: { lte: 10 },
        },
      },
    },
  }),
};

// Batch operations optimizadas
export const batchOperations = {
  // Actualizar múltiples productos
  updateMultipleProducts: (productIds: string[], data: any) => ({
    where: { id: { in: productIds } },
    data,
  }),

  // Eliminar múltiples refresh tokens
  deleteMultipleRefreshTokens: (userIds: string[]) => ({
    where: { userId: { in: userIds } },
  }),

  // Limpiar carritos antiguos
  cleanOldCarts: (daysOld: number) => ({
    where: {
      updatedAt: {
        lt: new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000),
      },
      items: {
        none: {},
      },
    },
  }),
};
