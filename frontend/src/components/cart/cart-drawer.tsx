'use client';

import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotal,
    clearCart,
  } = useCartStore();

  const handleQuantityChange = (
    id: string,
    quantity: number
  ) => {
    if (quantity <= 0) removeItem(id);
    else updateQuantity(id, quantity);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="
          w-full sm:max-w-lg
          bg-white
          border-l border-gray-200
        "
      >
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg font-medium">
            <ShoppingCart className="h-5 w-5" />
            Tu Carrito
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">

          {/* Empty State */}
          {items.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-black/60 space-y-4">

              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8" />
              </div>

              <p className="text-sm">
                Tu carrito está vacío
              </p>

              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-full"
              >
                Explorar productos
              </Button>

            </div>
          )}

          {/* Items */}
          {items.length > 0 && (
            <>
              <div className="flex-1 overflow-y-auto py-6 space-y-5">

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex gap-4
                      p-4
                      border border-gray-200
                      rounded-2xl
                      transition-all
                      hover:border-gray-300
                      hover:shadow-sm
                    "
                  >

                    {/* Image */}
                    <div
                      className="
                        w-20 h-20
                        bg-gray-50
                        rounded-xl
                        flex items-center justify-center
                        overflow-hidden
                      "
                    >
                      <img
                        alt={item.product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-1">

                      <h4 className="text-sm font-medium leading-snug">
                        {item.product.name}
                      </h4>

                      <p className="text-sm text-black/60">
                        ${item.product.price.toFixed(2)}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 pt-2">

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          className="
                            w-7 h-7
                            rounded-full
                            border border-gray-300
                            flex items-center justify-center
                            hover:bg-gray-100
                            transition
                          "
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className="
                            w-7 h-7
                            rounded-full
                            border border-gray-300
                            flex items-center justify-center
                            hover:bg-gray-100
                            transition
                          "
                        >
                          <Plus className="h-3 w-3" />
                        </button>

                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="
                        text-black/40
                        hover:text-black
                        transition
                      "
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

              </div>

              {/* Summary */}
              <div className="border-t pt-6 space-y-4">

                <div className="flex justify-between items-center">

                  <span className="text-sm text-black/60">
                    Total
                  </span>

                  <span className="text-xl font-semibold">
                    ${getTotal().toFixed(2)}
                  </span>

                </div>

                <div className="flex gap-3">

                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="flex-1 rounded-full"
                  >
                    Vaciar
                  </Button>

                  <Button
                    className="
                      flex-1
                      rounded-full
                      bg-black text-white
                      hover:scale-[1.03]
                      transition
                    "
                  >
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                </div>

              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
