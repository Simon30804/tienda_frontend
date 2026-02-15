"use client";

import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { cn } from "@/src/components/ui/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface ImageGalleryProps {
  mainImage: string;
  extraImages: any[];
  productName: string;
}

export function ImageGallery({ mainImage, extraImages, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [startIndex, setStartIndex] = useState(0);

  // Combinar imagen principal con imágenes adicionales
  const allImages = [mainImage, ...(extraImages || [])];
  
  const maxVisible = 4;
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + maxVisible < allImages.length;
  
  const visibleImages = allImages.slice(startIndex, startIndex + maxVisible);

  const handlePrevious = () => {
    if (canScrollLeft) {
      setStartIndex(Math.max(0, startIndex - 1));
    }
  };

  const handleNext = () => {
    if (canScrollRight) {
      setStartIndex(Math.min(allImages.length - maxVisible, startIndex + 1));
    }
  };

  return (
    <div className="space-y-4">
      {/* Imagen Principal */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border">
        <ImageWithFallback
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Carrusel de miniaturas */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-2">
          {/* Flecha Izquierda */}
          {allImages.length > maxVisible && (
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={!canScrollLeft}
              className="flex-shrink-0 h-20 w-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}

          {/* Miniaturas */}
          <div className="grid grid-cols-4 gap-3 flex-1">
            {visibleImages.map((image, index) => (
              <button
                key={startIndex + index}
                onClick={() => setSelectedImage(image)}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden bg-white border-2 transition-all hover:border-green-500",
                  selectedImage === image ? "border-green-600 ring-2 ring-green-200" : "border-gray-200"
                )}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${productName} - imagen ${startIndex + index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Flecha Derecha */}
          {allImages.length > maxVisible && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={!canScrollRight}
              className="flex-shrink-0 h-20 w-10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
