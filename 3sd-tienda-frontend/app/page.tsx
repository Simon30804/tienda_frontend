import { Home } from "../src/screens/Home";
import { getCategories } from "../src/services/categories";
import { getProducts } from "../src/services/products";
import { getBrands } from "../src/services/brands";

export default async function HomePage() {
  // Obtenemos los datos de Payload
  const productsData = await getProducts(); // Esto se ejecutará en el servidor, no en el cliente
  const categories = await getCategories(); // Esto se ejecutará en el servidor, no en el cliente
  const brands = await getBrands(); // Esto se ejecutará en el servidor, no en el cliente

  return <Home categories={categories}
          initialProducts={productsData} // Aquí deberías pasar los productos obtenidos
          brands={brands} // Aquí deberías pasar las marcas obtenidas
  />;
}