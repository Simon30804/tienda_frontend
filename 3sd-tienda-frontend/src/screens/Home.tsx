"use client";

import { useState, useMemo } from "react";
import { Header } from "../components/Header";
import { CategoryBar } from "../components/CategoryBar";
import { Sidebar } from "../components/Sidebar";
import { ProductCard } from "../components/ProductCard";
//import { products } from "../data/products";
import { Button } from "../components/ui/button";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { mapPayloadToFigma } from "../utils/productMapper";

interface HomeProps {
  categories: any[];
  initialProducts: any[]; // Estos son los productos reales, que viene de Payload
  brands: any[]; // Estas son las marcas reales, que viene de Payload
}

export function Home({ categories, initialProducts, brands }: HomeProps) {
  // 1. Transformamos los productos de Payload al formato de Figma inmediatamente
  // 2. Filtramos productos no publicados (published = 0)
  const products = useMemo(() => {
    return (initialProducts || [])
      .filter((product) => String(product?.published).trim() !== "0")
      .map(mapPayloadToFigma);
  }, [initialProducts]);
  
  // 3. Preparar lista de marcas desde Payload
  const brandsList = useMemo(() => {
    const brandNames = (brands || []).map((brand: any) => brand.name);
    return ["Todas", ...brandNames];
  }, [brands]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory;

      const matchesBrand =
        selectedBrand === "Todas" || product.brand === selectedBrand;

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    if (sortOption === "default") {
      return result;
    }

    const sorted = [...result];
    switch (sortOption) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return sorted;
  }, [products, searchQuery, selectedCategory, selectedBrand, priceRange, sortOption]);

  //const featuredProducts = products.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      <CategoryBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories} // Pasamos las categorías al CategoryBar
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner - Only show when no search/filters */}
        {searchQuery === "" &&
          selectedCategory === "Todos" &&
          selectedBrand === "Todas" && (
            <div className="mb-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl overflow-hidden">
              <div className="px-8 py-12 md:py-16">
                <div className="max-w-2xl">
                  <Badge className="mb-4 bg-white/20 text-white border-0">
                    Ofertas Especiales
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Los Mejores Productos de Tecnología
                  </h1>
                  <p className="text-lg text-green-50 mb-6">
                    Encuentra cámaras, videoporteros, control de accesos y más con los
                    mejores productos del mercado
                  </p>
                  <Button size="lg" variant="secondary">
                    Ver Ofertas
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            brands={brandsList}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="w-full"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {searchQuery
                  ? `Resultados para "${searchQuery}"`
                  : "Todos los Productos"}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "producto" : "productos"}
                </span>
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
                  aria-label="Ordenar productos"
                >
                  <option value="default">Ordenar</option>
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                  <option value="price-asc">Precio menor a mayor</option>
                  <option value="price-desc">Precio mayor a menor</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No se encontraron productos
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Todos");
                    setSelectedBrand("Todas");
                  }}
                  className="mt-4"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">3SD</h3>
              <p className="text-gray-400 text-sm">
                Tu tienda de confianza para productos de tecnología de alta
                calidad.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categorías</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Computadoras</li>
                <li>Smartphones</li>
                <li>Audio</li>
                <li>Cámaras</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ayuda</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Envíos</li>
                <li>Devoluciones</li>
                <li>Garantías</li>
                <li>Contacto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Términos y Condiciones</li>
                <li>Política de Privacidad</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 3SD. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}