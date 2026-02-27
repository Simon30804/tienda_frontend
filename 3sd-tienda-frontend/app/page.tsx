import { Home } from "../src/screens/Home";
import { getCategories } from "../src/services/categories";
import { getProducts } from "../src/services/products";
import { getBrands } from "../src/services/brands";

export const dynamic = 'force-dynamic';

const allowedSortOptions = new Set([
  "default",
  "name-asc",
  "name-desc",
  "price-asc",
  "price-desc",
]);

interface HomePageProps {
  searchParams?: Promise<{ page?: string; category?: string; brand?: string; search?: string; sort?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = (await searchParams) || {};
  const page = Math.max(1, Number(params.page) || 1);
  const selectedCategoryId = params.category && params.category !== "all" ? params.category : "all";
  const selectedBrandId = params.brand && params.brand !== "all" ? params.brand : "all";
  const searchQuery = typeof params.search === "string" ? params.search : "";
  const sortOption = typeof params.sort === "string" && allowedSortOptions.has(params.sort)
    ? params.sort
    : "default";

  // Obtenemos los datos de Payload
  const productsData = await getProducts(page, 50, selectedCategoryId, selectedBrandId, searchQuery); // Esto se ejecutará en el servidor, no en el cliente
  const categories = await getCategories(); // Esto se ejecutará en el servidor, no en el cliente
  const brands = await getBrands(); // Esto se ejecutará en el servidor, no en el cliente

  return <Home categories={categories}
          initialProducts={productsData.docs}
          pagination={productsData}
          selectedCategoryId={selectedCategoryId}
          selectedBrandId={selectedBrandId}
          initialSearchQuery={searchQuery}
          initialSortOption={sortOption}
          brands={brands} 
  />;
}