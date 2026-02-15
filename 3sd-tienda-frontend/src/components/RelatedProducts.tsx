"use client";

import { useState, useEffect } from "react";
import { getProductsBySKUs } from "@/src/services/products";
import { mapPayloadToFigma } from "@/src/utils/productMapper";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface RelatedProductsProps {
  relatedSkus: string[];
}

export function RelatedProducts({ relatedSkus }: RelatedProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    async function fetchRelatedProducts() {
      if (!relatedSkus || relatedSkus.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const rawProducts = await getProductsBySKUs(relatedSkus);
        // Filtrar productos no publicados
        const publishedProducts = rawProducts.filter((p: any) => p.published !== 0);
        const mappedProducts = publishedProducts.map(mapPayloadToFigma);
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error cargando productos relacionados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [relatedSkus]);

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
        <div className="text-center py-8 text-gray-500">Cargando productos relacionados...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-16 border-t pt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
        <div className="text-center py-8 text-gray-500">
          No hay productos relacionados disponibles.
        </div>
      </div>
    );
  }

  const maxVisible = 4;
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + maxVisible < products.length;
  const visibleProducts = products.slice(startIndex, startIndex + maxVisible);

  const handlePrevious = () => {
    if (canScrollLeft) {
      setStartIndex(Math.max(0, startIndex - 1));
    }
  };

  const handleNext = () => {
    if (canScrollRight) {
      setStartIndex(Math.min(products.length - maxVisible, startIndex + 1));
    }
  };

  return (
    <div className="mt-16 border-t pt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
      
      <div className="flex items-center gap-4">
        {/* Flecha Izquierda */}
        {products.length > maxVisible && (
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={!canScrollLeft}
            className="flex-shrink-0 h-12 w-12"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Flecha Derecha */}
        {products.length > maxVisible && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={!canScrollRight}
            className="flex-shrink-0 h-12 w-12"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
