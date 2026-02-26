'use client';

import { useCartStore } from '@/store/cart-store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) removeItem(id);
    else updateQuantity(id, quantity);
  };

  const total = getTotal();
  const shipping = total > 100 ? 0 : 10;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="
          w-full sm:max-w-md
          bg-white border-l border-black/10
          flex flex-col p-0
        "
      >

        {/* ── HEADER ─────────────────────────────────────────── */}
        <SheetHeader className="px-7 pt-8 pb-6 border-b border-black/8 shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-black/35 font-medium">
                Hack 6
              </p>
              <SheetTitle className="text-lg font-semibold tracking-[-0.01em]">
                Tu carrito
              </SheetTitle>
            </div>
            {items.length > 0 && (
              <span className="text-xs text-black/35 uppercase tracking-[0.2em]">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
        </SheetHeader>

        {/* ── EMPTY STATE ────────────────────────────────────── */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-7">
            <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-black/25" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-medium text-sm">Carrito vacío</p>
              <p className="text-xs text-black/40">Aún no has agregado productos.</p>
            </div>
            <button
              onClick={onClose}
              className="
                group inline-flex items-center gap-2
                bg-black text-white
                rounded-full px-6 py-2.5
                text-xs font-medium uppercase tracking-[0.2em]
                hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)]
                transition-all duration-300
              "
            >
              Explorar
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {/* ── ITEMS ──────────────────────────────────────────── */}
        {items.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-black/6 px-7">
              {items.map((item) => (
                <div key={item.id} className="py-6 flex gap-4 items-start">

                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl border border-black/8 bg-black/[0.02] flex items-center justify-center shrink-0 overflow-hidden">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain p-1.5"
                      />
                    ) : (
                      <span className="text-[9px] uppercase tracking-widest text-black/20">IMG</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium leading-snug line-clamp-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-black/20 hover:text-black transition-colors shrink-0 mt-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="
                            w-7 h-7 rounded-full border border-black/15
                            flex items-center justify-center
                            hover:border-black/40 hover:bg-black/[0.03]
                            transition-all duration-200
                          "
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="
                            w-7 h-7 rounded-full border border-black/15
                            flex items-center justify-center
                            hover:border-black/40 hover:bg-black/[0.03]
                            transition-all duration-200
                          "
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-black/30 tabular-nums">
                            ${item.product.price.toFixed(2)} c/u
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* ── SUMMARY ──────────────────────────────────────── */}
            <div className="shrink-0 border-t border-black/8">

              {/* Free shipping nudge */}
              {total < 100 && (
                <div className="px-7 py-4 border-b border-black/8 flex items-center justify-between gap-4">
                  <p className="text-[11px] text-black/40 leading-relaxed">
                    <span className="text-black font-medium">${(100 - total).toFixed(2)}</span> más para envío gratis
                  </p>
                  <div className="shrink-0 w-16 h-0.5 bg-black/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((total / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Breakdown */}
              <div className="px-7 py-5 space-y-2.5 border-b border-black/8">
                <div className="flex justify-between text-xs text-black/40">
                  <span>Subtotal</span>
                  <span className="tabular-nums">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-black/40">
                  <span>Envío</span>
                  <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-black/40 font-medium">Total</span>
                  <span className="text-xl font-semibold tracking-tight tabular-nums">
                    ${(total + shipping).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-7 py-6 space-y-3">
                <button
                  className="
                    group w-full h-11 rounded-full
                    bg-black text-white
                    text-sm font-medium
                    flex items-center justify-center gap-2
                    hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,0,0,0.18)]
                    transition-all duration-300
                  "
                >
                  Checkout
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={clearCart}
                  className="
                    w-full h-9
                    text-xs uppercase tracking-[0.25em] text-black/30
                    hover:text-black transition-colors
                  "
                >
                  Vaciar carrito
                </button>

                <p className="text-center text-[10px] uppercase tracking-[0.2em] text-black/20">
                  Pago seguro · SSL
                </p>
              </div>

            </div>
          </>
        )}

      </SheetContent>
    </Sheet>
  );
}
