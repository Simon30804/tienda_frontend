const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3003';

export async function getCategories() {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/categories?limit=100`, {
      next: { revalidate: 3600 }, // Caché de una hora (las categorías no cambian tanto)
    });

    if (!res.ok) throw new Error('Error al obtener categorías');

    const data = await res.json();
    return data.docs; // Devolvemos el array de categorías
  } catch (error) {
    console.error("Error categories fetch:", error);
    return [];
  }
}