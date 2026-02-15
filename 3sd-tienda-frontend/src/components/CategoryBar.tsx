"use client";

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: any[]; 
}

export function CategoryBar({
  selectedCategory,
  onCategoryChange,
  categories = [],
}: CategoryBarProps) {
  
  // 1. Creamos una lista que incluya "Todos" al principio
  // Payload nos da objetos, así que normalizamos para que siempre haya un nombre
  const allCategories = [
    { id: "all", name: "Todos" },
    ...categories
  ];

  return (
    <div className="bg-white border-b sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center overflow-x-auto hide-scrollbar">
          {allCategories.map((category) => {
            // Manejamos si category es un objeto (de Payload) o un string (fallback)
            const categoryName = typeof category === 'string' ? category : category.name;
            const categoryId = typeof category === 'string' ? category : category.id;

            return (
              <button
                key={categoryId}
                onClick={() => onCategoryChange(categoryName)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  selectedCategory === categoryName
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-700 hover:text-green-600 hover:border-green-300"
                }`}
              >
                {categoryName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}