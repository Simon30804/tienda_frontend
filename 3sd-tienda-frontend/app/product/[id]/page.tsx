import { notFound } from "next/navigation";
import { getProductById } from "@/src/services/products";
import { ProductDetail } from "@/src/screens/ProductDetail";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}