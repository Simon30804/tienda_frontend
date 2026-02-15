import { Button } from "./ui/button";
import { X } from "lucide-react";

interface SidebarProps {
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  brands: string[];
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({
  selectedBrand,
  onBrandChange,
  brands,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const content = (
    <div className="space-y-6">
      {/* Mobile Header */}
      {isMobileOpen && (
        <div className="flex items-center justify-between md:hidden">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <Button variant="ghost" size="icon" onClick={onMobileClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Marcas</h3>
        <div className="space-y-1">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => onBrandChange(brand)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedBrand === brand
                  ? "bg-green-50 text-green-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onBrandChange("Todas");
        }}
      >
        Limpiar Filtros
      </Button>
    </div>
  );

  if (isMobileOpen) {
    return (
      <>
        {/* Mobile Overlay */}
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
        {/* Mobile Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 p-6 overflow-y-auto md:hidden">
          {content}
        </aside>
      </>
    );
  }

  return (
    <aside className="hidden md:block w-64 flex-shrink-0">
      <div className="sticky top-32">{content}</div>
    </aside>
  );
}