"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { sanitizeHTML } from "../utils/sanitize";
import { mapPayloadToFigma } from "@/src/utils/productMapper";
import { Header } from "@/src/components/Header";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { ChevronLeft, Check } from "lucide-react";
import { ProductActions } from "../components/ProductActions";
import { ImageGallery } from "@/src/components/ImageGallery";
import { RelatedProducts } from "@/src/components/RelatedProducts";

interface ProductPageProps {
  product: any;
}

export function ProductDetail({ product }: ProductPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sanitizedSpecifications, setSanitizedSpecifications] = useState<string | null>(null);

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  // No mostrar productos no publicados
  if (product.published === 0) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Producto no disponible</h1>
        <p className="text-gray-600 mb-6">Este producto no está disponible en este momento</p>
        <Link href="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>;
  }

  const mappedProduct = mapPayloadToFigma(product);
  const specs = mappedProduct.specifications;

  useEffect(() => {
    if (specs) {
      setSanitizedSpecifications(sanitizeHTML(specs));
    } else {
      setSanitizedSpecifications(null);
    }
  }, [specs]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Inicio
          </Link>
          <span>/</span>
          <span>{mappedProduct.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{mappedProduct.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-4">
          <Link href="/">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver
          </Link>
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <ImageGallery
            mainImage={mappedProduct.image}
            extraImages={mappedProduct.extra_images}
            productName={mappedProduct.name}
          />

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {mappedProduct.brand}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {mappedProduct.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  €{mappedProduct.price.toLocaleString()}
                </span>
                {mappedProduct.oldPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    €{mappedProduct.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock */}
              {(() => {
                const stockLevel = mappedProduct.stock?.toLowerCase() || "none";
                
                if (stockLevel === "none") {
                  return (
                    <div className="flex items-center space-x-2 text-red-600 mb-6">
                      <span className="font-medium">Agotado</span>
                    </div>
                  );
                } else if (stockLevel === "low") {
                  return (
                    <div className="flex items-center space-x-2 text-orange-600 mb-6">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Pocas Unidades</span>
                    </div>
                  );
                } else if (stockLevel === "medium") {
                  return (
                    <div className="flex items-center space-x-2 text-yellow-600 mb-6">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Disponible en stock</span>
                    </div>
                  );
                } else if (stockLevel === "high") {
                  return (
                    <div className="flex items-center space-x-2 text-green-600 mb-6">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Disponible en stock</span>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Descripción
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {mappedProduct.description}
                </p>
              </div>

              {/* Specifications - SANITIZADO */}
              {sanitizedSpecifications && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Especificaciones
                  </h3>
                  <div 
                    className="text-sm text-gray-700 specs-table"
                    dangerouslySetInnerHTML={{ __html: sanitizedSpecifications }}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <ProductActions 
              product={mappedProduct} 
              isAvailable={mappedProduct.stock && mappedProduct.stock.toLowerCase() !== "none"} 
            />
          </div>
        </div>

        {/* Related Products */}
        {mappedProduct.related_products && mappedProduct.related_products.length > 0 && (
          <RelatedProducts relatedSkus={mappedProduct.related_products} />
        )}
      </div>
    </div>
  );
}