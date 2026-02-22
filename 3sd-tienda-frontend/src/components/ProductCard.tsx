"use client";

import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "../data/products";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { discount } = useAuth();
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - discount / 100)
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success("Producto agregado al carrito", {
      description: product.name,
    });
  };


  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 space-y-3">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-green-600 uppercase">
            {product.brand}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline space-x-2">
          {hasDiscount ? (
            <>
              <span className="text-2xl font-bold text-green-600">
                €{discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-gray-500 line-through">
                €{product.price.toLocaleString()}
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                -{discount}%
              </Badge>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold text-gray-900">
                €{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  €{product.originalPrice.toLocaleString()}
                </span>
              )}
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          // Si product.stock es "none" el boton se deshabilita
          disabled={product.stock.toLowerCase() === "none"}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock.toLowerCase() !== "none" ? "Agregar al Carrito" : "No Disponible"}
        </Button>
      </div>
    </Link>
  );
}