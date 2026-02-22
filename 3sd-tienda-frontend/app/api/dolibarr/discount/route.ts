import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Forzamos que esta ruta sea dinámica para evitar problemas de caché con los descuentos personalizados de cada usuario
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    let connection;
  try {
    // 1. Recibimos el email del usuario que se acaba de loguear
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    // 2. Nos conectamos a la base de datos de Dolibarr
    // Al estar Next.js en el mismo docker-compose, puede hablar directamente con el contenedor 'db'
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 3. Ejecutamos la consulta mágica con JOIN
    const query = `
      SELECT s.remise_client 
      FROM llx_socpeople p 
      JOIN llx_societe s ON p.fk_soc = s.rowid 
      WHERE p.email = ?
      LIMIT 1;
    `;

    const [rows]: any = await connection.execute(query, [email]);
    
    // 4. Cerramos la conexión para no saturar Docker
    await connection.end();

    // 5. Comprobamos si encontramos a la persona y a su empresa
    if (rows.length > 0) {
      const descuento = rows[0].remise_client || 0;
      return NextResponse.json({ 
        success: true, 
        discount: descuento 
      });
    } else {
      // Si el usuario se registró en la web pero aún no está en Dolibarr
      return NextResponse.json({ 
        success: false, 
        discount: 0, 
        message: 'Usuario no encontrado en el ERP' 
      });
    }

  } catch (error: any) {
    console.error('ERROR DATABASE:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      message: error.message,
      code: error.code 
    }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}