import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
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
                className="btn bg-background text-foreground hover:bg-background/90 inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium"
              >
                Ver Productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/categories"
                className="btn btn-outline inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Categorías
              </Link>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg" />
            <img
              src="/images/hero-image.jpg"
              alt="Ecommerce Universitario"
              className="relative rounded-lg shadow-2xl w-full h-auto object-cover"
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 text-primary/20"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C360,60 720,120 1440,60"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
}
