const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL;


// Servicio para obtener productos desde Payload CMS, sin embargo en Payload tengo 49 productos creados, y en la pagina solo se muestran 10, esto es porque el endpoint de Payload tiene un limite de 10 por defecto, asi que hay que agregar el parametro limit=100 para obtener todos los productos, o hacer paginacion
export async function getProducts() {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/products?depth=1&limit=100`, { 
      cache: 'no-store' // Forzamos a que no use caché para la prueba
    });
    const data = await res.json();
    console.log("Productos recibidos de Payload:", data.docs?.length); 
    return data.docs || [];
  } catch (error) {
    console.error("Error en el servicio:", error);
    return [];
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