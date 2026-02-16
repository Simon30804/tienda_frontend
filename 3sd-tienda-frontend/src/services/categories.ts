const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

export async function getCategories() {
  try {
    // Estoy haciendo prubas, las categorias estna cambiando, asi que no quiero cache por ahora
    const res = await fetch(`${PAYLOAD_URL}/api/categories?limit=100`, {
      next: { revalidate: 0 }, // No caché
    });

    if (!res.ok) throw new Error('Error al obtener categorías');

    const data = await res.json();
    return data.docs; // Devolvemos el array de categorías
  } catch (error) {
    console.error("Error categories fetch:", error);
    return [];
  }
}