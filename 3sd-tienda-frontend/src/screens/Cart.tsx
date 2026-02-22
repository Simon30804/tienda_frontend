"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../context/AuthContext";

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { discount } = useAuth();
  const hasDiscount = discount > 0;

  const discountedTotalPrice = hasDiscount
    ? totalPrice * (1 - discount / 100)
    : totalPrice;
  const savings = totalPrice - discountedTotalPrice;
  const shippingCost = discountedTotalPrice > 500 ? 0 : 25;
  const tax = discountedTotalPrice * 0.21;
  const finalTotal = discountedTotalPrice + shippingCost + tax;

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8">
              Agrega productos para empezar a comprar
            </p>
            <Link href="/">
              <Button size="lg">Ir a la Tienda</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Carrito de Compras
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {items.length} {items.length === 1 ? "Producto" : "Productos"}
              </h2>
              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vaciar Carrito
              </Button>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <Link
                    href={`/product/${item.id}`}
                    className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-50"
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-green-600 uppercase mb-1">
                          {item.brand}
                        </p>
                        <Link
                          href={`/product/${item.id}`}
                          className="font-semibold text-gray-900 hover:text-green-600 line-clamp-2"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 flex-shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg w-fit">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="rounded-r-none"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="rounded-l-none"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        {hasDiscount ? (
                          <>
                            <p className="text-2xl font-bold text-green-600">
                              €{(item.price * (1 - discount / 100) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              €{(item.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              €{(item.price * (1 - discount / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-2xl font-bold text-gray-900">
                              €{(item.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              €{item.price.toLocaleString()} c/u
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    €{totalPrice.toLocaleString()}
                  </span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({discount}%)</span>
                    <span className="font-medium">
                      -€{savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Envío</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      `€${shippingCost.toLocaleString()}`
                    )}
                  </span>
                </div>
                {discountedTotalPrice <= 500 && (
                  <p className="text-xs text-blue-600">
                    Agrega €{(500 - discountedTotalPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} más para
                    envío gratis
                  </p>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>IVA (21%)</span>
                  <span className="font-medium">
                    €{tax.toFixed(2).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>€{finalTotal.toFixed(2).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleCheckout} size="lg" className="w-full mb-3 bg-green-600 hover:bg-green-700">
                Proceder al Pago
              </Button>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}