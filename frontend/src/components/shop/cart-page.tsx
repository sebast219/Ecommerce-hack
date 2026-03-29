'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState('');

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) removeItem(id);
    else updateQuantity(id, quantity);
  };

  const subtotal = getTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.16;
  const total = subtotal + shipping + tax;

  /* ── EMPTY STATE ─────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        {/* Top label */}
        <div className="max-w-6xl mx-auto w-full px-6 lg:px-12 pt-16 flex items-center justify-between relative z-10">
          <span className="uppercase tracking-[0.4em] text-xs text-slate-400 font-medium flex items-center gap-2">
            <Zap className="h-3 w-3 text-emerald-500" />
            Hack 6
          </span>
          <span className="uppercase tracking-[0.4em] text-xs text-slate-400 font-medium">
            Carrito
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-10 relative z-10">
          {/* Animated icon container */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-10">
              <div className="w-32 h-32 rounded-full border-2 border-emerald-400" />
            </div>
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200 flex items-center justify-center relative shadow-xl shadow-emerald-500/10">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-cyan-500/5" />
              <div className="absolute inset-2 rounded-xl border border-emerald-200/50" />
              <ShoppingCart className="w-14 h-14 text-emerald-600 relative z-10" />
            </div>
            {/* Floating sparkles */}
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-amber-400 animate-pulse" />
            <div className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-cyan-400/30 animate-bounce" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-4xl font-bold tracking-tight text-slate-800">
                Tu carrito está vacío
              </h2>
              <Shield className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-base text-slate-500 max-w-md leading-relaxed">
              Aún no has agregado productos. Explora nuestras herramientas de ciberseguridad profesional y encuentra tu próximo equipo hacking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="
                group inline-flex items-center gap-2
                bg-gradient-to-r from-slate-900 to-slate-800 text-white
                rounded-xl px-8 py-4
                text-sm font-semibold
                shadow-lg shadow-slate-900/20
                hover:shadow-xl hover:shadow-emerald-500/20
                hover:scale-[1.02] hover:from-emerald-600 hover:to-cyan-600
                transition-all duration-300
              "
            >
              <Shield className="h-4 w-4" />
              Explorar productos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/categories"
              className="
                inline-flex items-center justify-center gap-2
                bg-white border border-slate-200
                rounded-xl px-8 py-4
                text-sm font-semibold text-slate-600
                shadow-sm
                hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50
                hover:shadow-md
                transition-all duration-300
              "
            >
              Ver categorías
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="flex items-center gap-6 text-xs text-slate-400 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Envío gratis +$100
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Garantía extendida
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Soporte 24/7
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mx-6 lg:mx-12 mb-16 relative z-10" />
      </div>
    );
  }

  /* ── CART WITH ITEMS ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white">

      {/* Top label row */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-16 pb-12 flex items-end justify-between border-b border-black/10">
        <div className="space-y-1">
          <span className="uppercase tracking-[0.4em] text-xs text-black/35 font-medium block">
            Hack 6
          </span>
          <h1 className="text-4xl font-semibold tracking-[-0.02em]">
            Tu carrito
          </h1>
        </div>
        <span className="text-sm text-black/35 mb-1">
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">

          {/* ── ITEMS ──────────────────────────────────────────── */}
          <div className="space-y-0 divide-y divide-black/8">
            {items.map((item) => (
              <div key={item.id} className="group py-8 flex gap-6 items-start">

                {/* Image */}
                <div className="w-20 h-20 rounded-xl border border-black/8 bg-black/[0.02] flex items-center justify-center shrink-0 overflow-hidden">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest text-black/20">IMG</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="font-medium text-base leading-snug">
                      {item.product.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-black/20 hover:text-black transition-colors shrink-0 mt-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs uppercase tracking-[0.2em] text-black/30 mb-5">
                    SKU: {item.product.sku}
                  </p>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="
                          w-8 h-8 rounded-full border border-black/15
                          flex items-center justify-center
                          hover:border-black/40 hover:bg-black/[0.03]
                          transition-all duration-200
                        "
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-6 text-center text-sm font-medium tabular-nums">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="
                          w-8 h-8 rounded-full border border-black/15
                          flex items-center justify-center
                          hover:border-black/40 hover:bg-black/[0.03]
                          transition-all duration-200
                        "
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold tabular-nums">
                        ${((typeof item.product.price === 'number' ? item.product.price : item.product.price?.amount || 0) * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-black/35 tabular-nums">
                          ${(typeof item.product.price === 'number' ? item.product.price : item.product.price?.amount || 0).toFixed(2)} c/u
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="pt-8 flex gap-4">
              <Link
                href="/products"
                className="
                  text-xs uppercase tracking-[0.25em] text-black/40
                  hover:text-black transition-colors
                "
              >
                ← Seguir comprando
              </Link>
              <button
                onClick={clearCart}
                className="
                  ml-auto text-xs uppercase tracking-[0.25em] text-black/30
                  hover:text-black transition-colors
                "
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* ── ORDER SUMMARY ──────────────────────────────────── */}
          <div className="sticky top-8 space-y-0 border border-black/10 rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="px-7 py-6 border-b border-black/8">
              <h2 className="text-sm uppercase tracking-[0.3em] text-black/40 font-medium">
                Resumen
              </h2>
            </div>

            {/* Promo */}
            <div className="px-7 py-6 border-b border-black/8">
              <label className="text-[10px] uppercase tracking-[0.28em] text-black/40 font-medium block mb-2">
                Código de descuento
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ingresa tu código"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="
                    h-10 rounded-xl text-sm
                    border-black/15 bg-transparent
                    placeholder:text-black/25
                    focus:border-black focus:ring-0
                  "
                />
                <button
                  className="
                    px-4 h-10 rounded-xl
                    border border-black/15
                    text-xs uppercase tracking-[0.2em] font-medium text-black/50
                    hover:border-black/40 hover:text-black
                    transition-all duration-200 shrink-0
                  "
                >
                  Aplicar
                </button>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="px-7 py-6 space-y-4 border-b border-black/8">
              {[
                ['Subtotal', `$${subtotal.toFixed(2)}`],
                ['Envío', shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`],
                ['Impuestos (16%)', `$${tax.toFixed(2)}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-black/50">{label}</span>
                  <span className={value === 'Gratis' ? 'text-black' : ''}>{value}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="px-7 py-6 border-b border-black/8">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">Total</span>
                <span className="text-2xl font-semibold tracking-tight tabular-nums">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Free shipping nudge */}
            {subtotal < 100 && (
              <div className="px-7 py-4 border-b border-black/8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-black/40 leading-relaxed">
                    Agrega <span className="text-black font-medium">${(100 - subtotal).toFixed(2)}</span> más para envío gratis
                  </p>
                  <div className="shrink-0 w-20 h-1 bg-black/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Checkout */}
            <div className="px-7 py-6 space-y-3">
              <button
                className="
                  group w-full h-12 rounded-full
                  bg-black text-white
                  text-sm font-medium
                  flex items-center justify-center gap-2
                  hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,0,0,0.18)]
                  transition-all duration-300
                "
              >
                Proceder al pago
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <p className="text-center text-[10px] uppercase tracking-[0.25em] text-black/25">
                Pago seguro · Encriptación SSL
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
