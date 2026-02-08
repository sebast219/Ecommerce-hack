import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-semibold mb-4">Ecommerce Universitario</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tu tienda de confianza para productos universitarios de calidad.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-primary">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Servicio al Cliente</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-muted-foreground hover:text-primary">
                  Ayuda
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Suscríbete para recibir ofertas exclusivas
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <button
                type="submit"
                className="w-full btn btn-primary text-sm"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Ecommerce Universitario. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
