// src/services/dolibarr.ts

export interface DolibarrDiscountResponse {
  success: boolean;
  discount: number;
  message?: string;
}

export async function getCustomerDiscount(email: string): Promise<number> {
  try {
    // Hacemos la petición a NUESTRA PROPIA API de Next.js
    const res = await fetch('/api/dolibarr/discount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    // Si el usuario existe en el ERP, res.ok será true y tendremos el descuento en la respuesta,
    // Sino existe significa que se trata de un cliente nuevo que aún no se ha registrado en Dolibarr, por lo que res.ok será false y devolveremos X de descuento por seguridad.
    if (!res.ok) {
      console.error('Error en la respuesta de la API de Dolibarr');
      return 0; // Si falla, descuento 0 por seguridad
    }

    const data: DolibarrDiscountResponse = await res.json();
    
    // Devolvemos el descuento directamente
    return data.discount || 0;
  } catch (error) {
    console.error('Error consultando el descuento:', error);
    return 0;
  }
}