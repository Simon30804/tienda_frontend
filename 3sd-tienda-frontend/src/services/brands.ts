const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

export async function getBrands() {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/brands?limit=100`, {
      next: { revalidate: 3600 }, // Caché de una hora (las marcas no cambian tanto)
    });

    if (!res.ok) throw new Error('Error al obtener marcas');

    const data = await res.json();
    return data.docs; // Devolvemos el array de marcas  
  } catch (error) {
    console.error("Error brands fetch:", error);
    return [];
  }
}