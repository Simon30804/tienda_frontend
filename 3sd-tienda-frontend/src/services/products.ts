const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL;

export interface PaginatedProductsResult {
  docs: any[];
  page: number;
  totalPages: number;
  totalDocs: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
  limit: number;
}

// Servicio para obtener productos desde Payload CMS, sin embargo en Payload tengo 49 productos creados, y en la pagina solo se muestran 10, esto es porque el endpoint de Payload tiene un limite de 10 por defecto, asi que hay que agregar el parametro limit=100 para obtener todos los productos, o hacer paginacion
export async function getProducts(
  page = 1,
  limit = 50,
  categoryId?: string,
  brandId?: string,
  searchQuery?: string
): Promise<PaginatedProductsResult> {
  try {
    const params = new URLSearchParams({
      depth: "1",
      limit: String(limit),
      page: String(page),
    });

    if (categoryId && categoryId !== "all") {
      params.append("where[main_categories][equals]", categoryId);
    }

    if (brandId && brandId !== "all") {
      params.append("where[brand][equals]", brandId);
    }

    const normalizedSearch = searchQuery?.trim();
    if (normalizedSearch) {
      params.append("where[or][0][name][like]", normalizedSearch);
      params.append("where[or][1][short_description][like]", normalizedSearch);
      params.append("where[or][2][sku][like]", normalizedSearch);
    }

    const res = await fetch(`${PAYLOAD_URL}/api/products?${params.toString()}`, {
      cache: 'no-store' // Forzamos a que no use caché para la prueba
    });
    const data = await res.json();
    console.log("Productos recibidos de Payload:", data.docs?.length);

    return {
      docs: data.docs || [],
      page: data.page || page,
      totalPages: data.totalPages || 1,
      totalDocs: data.totalDocs || 0,
      hasPrevPage: Boolean(data.hasPrevPage),
      hasNextPage: Boolean(data.hasNextPage),
      prevPage: data.prevPage ?? null,
      nextPage: data.nextPage ?? null,
      limit: data.limit || limit,
    };
  } catch (error) {
    console.error("Error en el servicio:", error);
    return {
      docs: [],
      page,
      totalPages: 1,
      totalDocs: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
      limit,
    };
  }
}

export async function getProductById(id: string) {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/products/${id}?depth=1&limit=100`, { 
      cache: 'no-store' // Forzamos a que no use caché para la prueba
    });
    const data = await res.json();
    console.log(`Producto ${id} recibido de Payload:`, data);
    return data || null;
  } catch (error) {
    console.error(`Error al obtener producto ${id}:`, error);
    return null;
  }
}

export async function getProductsBySKUs(skus: string[]) {
  try {
    if (!skus || skus.length === 0) return [];

    // Query con operador "in" usando el formato de array que espera Payload
    const params = new URLSearchParams();
    skus.forEach((sku, index) => {
      params.append(`where[sku][in][${index}]`, sku);
    });
    params.append("depth", "1");

    const res = await fetch(`${PAYLOAD_URL}/api/products?${params.toString()}`, {
      cache: 'no-store'
    });
    const data = await res.json();

    return data.docs || [];
  } catch (error) {
    console.error("Error al obtener productos relacionados:", error);
    return [];
  }
}