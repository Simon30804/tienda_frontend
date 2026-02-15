// Este archivo es un mapeador que convierte la estructura de datos de Payload CMS a la estructura que espera mi diseño creado mediante Figma.
export const mapPayloadToFigma = (payloadProduct: any) => {
    // Me aseguro de que el stock siempre sea una cadena, incluso si viene como número o está ausente
    const stock = payloadProduct.stock?.toString() ?? '0';
    
    // Filtrar imágenes extra excluyendo thumbnails
    const extraImages = payloadProduct.extra_images_paths?.details?.filter(
      (img: string) => !img.includes('_thumb')
    ) || [];
    
    // Procesar productos relacionados (viene como string separado por comas)
    const relatedProducts = payloadProduct.related_products 
      ? payloadProduct.related_products.split(',').map((sku: string) => sku.trim()).filter(Boolean)
      : [];
    
  return {
    id: payloadProduct.id,
    name: payloadProduct.name,
    sku: payloadProduct.sku,
    // Traducción de campos:
    price: payloadProduct.price_pvp, 
    oldPrice: payloadProduct.msrp,
    image: payloadProduct.image_path,
    // Extraemos el nombre de la categoría del objeto de relación
    category: payloadProduct.main_categories?.name || "Sin categoría",
    brand: typeof payloadProduct.brand === 'object' ? payloadProduct.brand.name : payloadProduct.brand,
    description: payloadProduct.short_description || "",
    specifications: payloadProduct.specifications || [],
    stock: stock,
    slug: payloadProduct.slug,
    extra_images: extraImages,
    related_products: relatedProducts,
    published: payloadProduct.published,
  };
};