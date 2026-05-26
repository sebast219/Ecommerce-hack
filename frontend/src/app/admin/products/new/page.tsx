'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  DollarSign,
  Package,
  Shield,
  Zap,
  Target,
  AlertTriangle,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  sku: string;
  stock: number;
  categoryId: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  experienceLevel: 'ENTRY' | 'INTERMEDIATE' | 'ADVANCED';
  images: string[];
  tags: string[];
  isActive: boolean;
}

export default function NewProductPage() {
  const router = useRouter();
  const { user, isAuthenticated, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    originalPrice: 0,
    sku: '',
    stock: 0,
    categoryId: '',
    difficulty: 'BEGINNER',
    experienceLevel: 'ENTRY',
    images: [],
    tags: [],
    isActive: true,
  });

  
  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.get('/categories');
      const categoriesData = (response.data as any)?.data || response.data;
      
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      }
    } catch (error: any) {
      console.error('Error loading categories:', error);
      alert('Error al cargar categorías: ' + (error.message || 'Error desconocido'));
    }
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated, fetchCategories]);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug when name changes
    if (field === 'name') {
      const slug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newImages.push(result);
          newPreviews.push(result);
          
          if (newPreviews.length === files.length) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, ...newImages],
            }));
            setImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      alert('No tienes permisos para crear productos');
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price.toString()),
        originalPrice: parseFloat(formData.originalPrice.toString()),
        stock: parseInt(formData.stock.toString()),
      };

      const response = await apiClient.post('/products', payload);
      alert('Producto creado exitosamente');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert('Error al crear producto: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
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
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Productos
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Nuevo Producto</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Información Básica
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Ej: WiFi Pineapple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Ej: WP-PINEAPPLE-001"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="wifi-pineapple"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL amigable para el producto. Se genera automáticamente.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Describe el producto, sus características y casos de uso..."
              />
            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Precio e Inventario
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Actual *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="199.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Original
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="299.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="50"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Detalles del Producto
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Dificultad *
                </label>
                <select
                  required
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="BEGINNER">Principiante</option>
                  <option value="INTERMEDIATE">Intermedio</option>
                  <option value="ADVANCED">Avanzado</option>
                  <option value="EXPERT">Experto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Experiencia *
                </label>
                <select
                  required
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="ENTRY">Inicial</option>
                  <option value="INTERMEDIATE">Intermedio</option>
                  <option value="ADVANCED">Avanzado</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                Producto activo (visible en la tienda)
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Etiquetas
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Añadir etiqueta..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Añadir
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Imágenes del Producto
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Seleccionar Imágenes
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Formatos aceptados: JPG, PNG, GIF. Máximo 5 imágenes.
                </p>
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? 'Creando Producto...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
