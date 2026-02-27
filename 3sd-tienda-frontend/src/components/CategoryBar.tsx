"use client";

interface CategoryOption {
  id: string;
  name: string;
}

interface CategoryBarProps {
  selectedCategoryId: string;
  onCategoryChange: (category: CategoryOption) => void;
  categories: any[]; 
}

export function CategoryBar({
  selectedCategoryId,
  onCategoryChange,
  categories = [],
}: CategoryBarProps) {
  
  // 1. Creamos una lista que incluya "Todos" al principio
  // Payload nos da objetos, así que normalizamos para que siempre haya un nombre
  const allCategories: CategoryOption[] = [
    { id: "all", name: "Todos" },
    ...(categories || []).map((category: any) => ({
      id: String(category?.id ?? ""),
      name: String(category?.name ?? "Sin categoría"),
    })),
  ];

  return (
    <div className="bg-white border-b sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center overflow-x-auto hide-scrollbar">
          {allCategories.map((category) => {
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  selectedCategoryId === category.id
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-700 hover:text-green-600 hover:border-green-300"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}