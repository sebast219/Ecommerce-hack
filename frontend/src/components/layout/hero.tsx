import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Tu Tienda
              <br />
              Universitaria
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-lg">
              Productos de calidad para estudiantes y profesionales.
              Encuentra todo lo necesitas para tu vida académica y personal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="bg-white text-blue-600 hover:bg-gray-100 inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium transition-colors"
              >
                Ver Productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/categories"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium transition-colors"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Categorías
              </Link>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/10 rounded-lg" />
            <div className="relative rounded-lg shadow-2xl w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <div className="text-xl font-semibold text-gray-700">Ecommerce</div>
                <div className="text-sm text-gray-500">Tu tienda online</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0">

      </div>
    </section>
  );
}
