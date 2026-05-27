'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, LogOut, LayoutDashboard, X as CloseIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { isAdmin } from '@/types/auth';
import { getAvatarUrl } from '@/lib/utils';
import { CartDrawer } from '@/components/cart/cart-drawer';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const debounceRef = useRef<NodeJS.Timeout>();

  const { items } = useCartStore();
  const { user, logout } = useAuthStore();

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const isProfilePage = pathname?.startsWith('/profile');

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    } else {
      // Si está vacío, mostrar todos los productos
      router.push('/products');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(mobileSearchQuery);
    setIsMobileOpen(false);
  };

  // Debounced search - búsqueda en tiempo real mientras escribe
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Limpiar debounce anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Si está vacío, mostrar todos los productos inmediatamente
    if (!query.trim()) {
      router.push('/products');
      return;
    }

    // Crear nuevo debounce para búsqueda con texto
    debounceRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300); // 300ms de delay
  };

  const handleMobileSearchChange = (query: string) => {
    setMobileSearchQuery(query);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Si está vacío, mostrar todos los productos inmediatamente
    if (!query.trim()) {
      router.push('/products');
      return;
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
  };

  // Sync search query from URL when on products page
  useEffect(() => {
    if (pathname === '/products') {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      if (searchParam) {
        setSearchQuery(searchParam);
        setMobileSearchQuery(searchParam);
      } else {
        // Si no hay parámetro de búsqueda, limpiar el input
        setSearchQuery('');
        setMobileSearchQuery('');
      }
    }
  }, [pathname]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const navLinks = [
    { name: 'Productos',   href: '/products'   },
    { name: 'Categorías', href: '/categories'  },
    { name: 'Nosotros',   href: '/nosotros'    },
  ];

  return (
    <>
      {/* Header normal para páginas que no son perfil */}
      {!isProfilePage && (
        <header
          className="
            sticky top-0 z-50 w-full
            bg-white/80 backdrop-blur-xl
            border-b border-black/[0.08]
          "
        >
          <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-16">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-black/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image 
                  src="/favicon.ico" 
                  alt="Hack 6 Logo" 
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full relative"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">Hack 6</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40">Security Store</span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="
                    px-5 py-2.5 rounded-full
                    text-sm font-medium text-black/60
                    hover:text-black hover:bg-black/[0.03]
                    transition-all duration-300
                  "
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="hidden lg:flex flex-1 max-w-md mx-12">
              <form onSubmit={handleSearchSubmit} className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-black/[0.02] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${isSearchFocused ? 'text-black' : 'text-black/30'}`} />
                <input
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="
                    relative w-full
                    bg-transparent
                    border border-black/[0.08]
                    rounded-full
                    pl-11 pr-11 py-3
                    text-sm text-black
                    placeholder-black/30
                    transition-all duration-300
                    focus:outline-none
                    focus:border-black/20
                    focus:bg-white
                    focus:shadow-[0_0_0_4px_rgba(0,0,0,0.02)]
                  "
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      handleSearch('');
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                )}
              </form>
            </div>

            {/* Spacer on smaller screens */}
            <div className="flex-1 lg:hidden" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Admin Dashboard Icon */}
              {isAdmin(user) && (
                <Link
                  href="/admin/dashboard"
                  className="
                    hidden sm:flex
                    p-3 rounded-full
                    text-black/50
                    transition-all duration-300
                    hover:bg-black/[0.03]
                    hover:text-black
                  "
                  title="Dashboard"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="
                  relative
                  p-3 rounded-full
                  text-black/50
                  transition-all duration-300
                  hover:bg-black/[0.03]
                  hover:text-black
                "
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span
                    className="
                      absolute -top-0.5 -right-0.5
                      h-5 w-5 rounded-full
                      bg-black text-white
                      text-[11px] font-semibold
                      flex items-center justify-center
                      shadow-lg shadow-black/20
                    "
                  >
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-2 pr-4 rounded-full hover:bg-black/[0.03] transition-all duration-300"
                  >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-black/5 to-black/[0.02] border border-black/[0.08] overflow-hidden">
                      {user?.avatar ? (
                        <Image
                          src={getAvatarUrl(user.avatar)!}
                          alt={`${user.firstName} ${user.lastName}`}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black/40 text-xs font-bold">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-black/70">
                      {user.firstName}
                    </span>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-black/[0.08] py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                        {isAdmin(user) && (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-black/70 hover:bg-black/[0.03] transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-black/70 hover:bg-black/[0.03] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Mi perfil
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-black/70 hover:bg-black/[0.03] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Mis pedidos
                        </Link>
                        <div className="h-px bg-black/[0.08] my-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Cerrar sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="
                    px-6 py-3
                    rounded-full
                    bg-black text-white
                    text-sm font-semibold
                    transition-all duration-300
                    hover:scale-[1.02]
                    hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]
                  "
                >
                  Iniciar sesión
                </Link>
              )}

              {/* Mobile */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="
                  lg:hidden
                  p-3 rounded-full
                  text-black/50
                  hover:bg-black/[0.03]
                  transition-all duration-300
                "
              >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileOpen && (
            <div className="lg:hidden border-t border-black/[0.08] bg-white/95 backdrop-blur-xl">
              <div className="container mx-auto px-6 py-8 space-y-2">

                {/* Mobile search */}
                <form onSubmit={handleMobileSearchSubmit} className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                  <input
                    type="search"
                    placeholder="Buscar productos..."
                    value={mobileSearchQuery}
                    onChange={(e) => handleMobileSearchChange(e.target.value)}
                    className="
                      w-full h-12 rounded-2xl
                      bg-black/[0.02] border border-black/[0.08]
                      pl-12 pr-12
                      text-sm text-black placeholder-black/30
                      focus:outline-none focus:border-black/20 focus:bg-white
                      transition-all duration-300
                    "
                  />
                  {mobileSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileSearchQuery('');
                        handleSearch('');
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  )}
                </form>

                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="
                      flex items-center justify-between
                      px-4 py-4 rounded-2xl
                      text-sm font-medium text-black/70
                      hover:bg-black/[0.03] hover:text-black
                      transition-all duration-300
                    "
                  >
                    {item.name}
                    <span className="text-black/20">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>
      )}

      {/* Header especial para página de perfil - integrado con sidebar */}
      {isProfilePage && (
        <header
          className="
            sticky top-0 z-50 w-full
            bg-gradient-to-b from-black to-black/95
            border-b border-white/10
            lg:hidden
          "
        >
          <div className="container mx-auto flex h-16 items-center justify-between px-6">
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image 
                  src="/favicon.ico" 
                  alt="Hack 6 Logo" 
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full relative"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white">Hack 6</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Security Store</span>
              </div>
            </Link>

            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300"
            >
              <X className="h-4 w-4" />
              <span className="text-sm font-medium">Cerrar</span>
            </button>
          </div>
        </header>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}