'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Package,
  DollarSign,
  Eye,
  ArrowUpDown,
  MoreVertical,
  ArrowLeft,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  originalPrice?: {
    amount: number;
    currency: string;
  };
  sku: string;
  stock: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  experienceLevel: 'ENTRY' | 'INTERMEDIATE' | 'ADVANCED';
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, isAuthenticated, token, logout } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterActive, setFilterActive] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProducts();
    }
  }, [isAuthenticated, token]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (filterCategory) params.set('categoryId', filterCategory);
      params.set('sortBy', sortBy);
      if (filterActive !== null) params.set('active', filterActive.toString());

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const fullUrl = baseUrl.includes('/api/v1') 
        ? `${baseUrl}/products?${params}`
        : `${baseUrl}/api/v1/products?${params}`;

      const response = await fetch(fullUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar productos');

      const data = await response.json();
      const productsData = data.data?.data?.products || data.data?.products || data.products || [];
      
      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else {
        console.error('Products data is not an array:', productsData);
        setProducts([]);
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
      alert('Error al cargar productos: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar producto');

      setProducts(products.filter(p => p.id !== productId));
      alert('Producto eliminado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error al eliminar el producto');
    }
  };

  const handleToggleActive = async (productId: string, isActive: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) throw new Error('Error al actualizar producto');

      setProducts(products.map(p => 
        p.id === productId ? { ...p, isActive: !isActive } : p
      ));
    } catch (error: any) {
      alert(error.message || 'Error al actualizar el producto');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category.name === filterCategory;
    const matchesActive = filterActive === null || product.isActive === filterActive;
    
    return matchesSearch && matchesCategory && matchesActive;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price.amount - b.price.amount;
      case 'stock':
        return a.stock - b.stock;
      case 'createdAt':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Sidebar Component
  const Sidebar = ({ user, onLogout, activeRoute = '/admin/products' }: { 
    user: any, 
    onLogout: () => void,
    activeRoute?: string 
  }) => {
    const menuItems = [
      { name: 'Dashboard', icon: Package, href: '/admin/dashboard', active: activeRoute === '/admin/dashboard' },
      { name: 'Productos', icon: Package, href: '/admin/products', active: activeRoute === '/admin/products' },
      { name: 'Pedidos', icon: Package, href: '/admin/orders', active: activeRoute === '/admin/orders' },
      { name: 'Usuarios', icon: Package, href: '/admin/users', active: activeRoute === '/admin/users' },
      { name: 'Análisis', icon: Package, href: '/admin/analytics', active: activeRoute === '/admin/analytics' },
      { name: 'Configuración', icon: Package, href: '/admin/settings', active: activeRoute === '/admin/settings' },
    ];

    return (
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-gray-200 bg-white z-40 hidden lg:flex flex-col">
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Menú Principal</p>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active 
                  ? 'bg-zinc-900 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-zinc-900'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white border border-gray-100 shadow-sm">
            <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold border border-gray-200">
              {user?.firstName?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-all w-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    );
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Restringido</h1>
          <p className="text-gray-600 mb-6">Necesitas privilegios de administrador para acceder a esta página.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">Gestión de Productos</h1>
              <span className="text-sm text-gray-500">
                {products.length} productos
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nuevo Producto
              </Link>
              
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Component */}
      <Sidebar user={user} onLogout={handleLogout} activeRoute="/admin/products" />

      {/* Main Content with Sidebar Offset */}
      <div className="lg:ml-64">
        {/* Filters and Search */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              <option value="Wireless Attacks">Ataques Inalámbricos</option>
              <option value="USB Hacking">Hacking USB</option>
              <option value="Red Team">Red Team</option>
              <option value="Network Monitoring">Monitoreo de Red</option>
              <option value="Hardware Implants">Implantes de Hardware</option>
              <option value="Digital Forensics">Forensia Digital</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="createdAt">Más recientes</option>
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
              <option value="stock">Stock</option>
            </select>

            {/* Active Filter */}
            <select
              value={filterActive.toString()}
              onChange={(e) => setFilterActive(e.target.value === 'true')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600">No hay productos que coincidan con los criterios de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
                  !product.isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(product.id, product.isActive)}
                        className={`p-1 rounded ${
                          product.isActive
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-green-500 hover:bg-green-50'
                        } transition-colors`}
                        title={product.isActive ? 'Desactivar' : 'Activar'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price.amount}
                      </span>
                      {product.originalPrice && product.originalPrice.amount > product.price.amount && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.amount}
                        </span>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.difficulty === 'BEGINNER'
                        ? 'bg-green-100 text-green-800'
                        : product.difficulty === 'INTERMEDIATE'
                        ? 'bg-yellow-100 text-yellow-800'
                        : product.difficulty === 'ADVANCED'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>Stock: {product.stock}</span>
                    <span>{product.category.name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      SKU: {product.sku}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="inline-flex items-center gap-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
