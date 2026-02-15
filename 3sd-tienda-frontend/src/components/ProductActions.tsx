"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { ShoppingCart, Heart, Share2 } from "lucide-react";

interface ProductActionsProps {
  product: any;
  isAvailable: boolean;
}

export function ProductActions({ product, isAvailable }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} producto(s) agregado(s) al carrito`, {
      description: product.name,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      {isAvailable && (
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-900">Cantidad:</span>
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="rounded-r-none"
            >
              -
            </Button>
            <span className="px-6 py-2 font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              className="rounded-l-none"
            >
              +
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleBuyNow}
          size="lg"
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={!isAvailable}
        >
          Comprar Ahora
        </Button>
        <Button
          onClick={handleAddToCart}
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={!isAvailable}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Agregar al Carrito
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-3">
        <Button variant="outline" size="lg" className="flex-1">
          <Heart className="w-5 h-5 mr-2" />
          Favoritos
        </Button>
        <Button variant="outline" size="lg" className="flex-1">
          <Share2 className="w-5 h-5 mr-2" />
          Compartir
        </Button>
      </div>
    </div>
  );
}