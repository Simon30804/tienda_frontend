export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request: Request) {
  let connection;

  try {
    const { email, cartItems } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email no disponible en sesión" }, { status: 400 });
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.beginTransaction();

    // 1) Buscar sociedad del usuario por email
    const [clientRows]: any = await connection.execute(
      `
      SELECT s.rowid as fk_soc, s.remise_client as discount
      FROM llx_socpeople p
      JOIN llx_societe s ON p.fk_soc = s.rowid
      WHERE p.email = ?
      LIMIT 1
      `,
      [email]
    );

    let fk_soc = null;
    let clientDiscount = 0;
    let isRegisteredClient = false;

    if (clientRows.length > 0) {
      // Cliente registrado en Dolibarr
      fk_soc = clientRows[0].fk_soc;
      clientDiscount = Number(clientRows[0].discount) || 0;
      isRegisteredClient = true;
    } else { // Los nuevos clientes los quiero registrar de alguna forma?? Si es así aquí debería directamente hacer un INSERT para crear el tercero, en vez de buscarlo primero, porque si no existe el tercero genérico, 
    // lo creo al vuelo (solo una vez, luego reutilizo ese tercero para todos los clientes web no registrados)
      // Nuevo cliente - Buscar o crear tercero genérico "Web sin registrar"
      const [genericRows]: any = await connection.execute(
        `SELECT rowid FROM llx_societe WHERE nom = ? LIMIT 1`,
        ["Cliente Web - Sin Registrar"]
      );

      if (genericRows.length > 0) {
        fk_soc = genericRows[0].rowid;
      } else { // Si no existe el tercero genérico, lo creo al vuelo (solo una vez, luego reutilizo ese tercero para todos los clientes web no registrados)
        // Crear tercero genérico si no existe, le asocio el email del cliente en la nota privada del pedido para poder identificarlo luego en Dolibarr
        const [createGeneric]: any = await connection.execute(
          `INSERT INTO llx_societe (nom, client, fournisseur, entity, note_private) VALUES (?, 1, 0, 1, ?)`,
          ["Cliente Web - Sin Registrar", email]
        );
        fk_soc = createGeneric.insertId;
      }
    }

    // 2) Leer datos de llx_societe automáticamente (opcional)
    const [socRows]: any = await connection.execute(
      `SELECT nom, email FROM llx_societe WHERE rowid = ? LIMIT 1`,
      [fk_soc]
    );
    const societe = socRows?.[0] ?? null;

    // 3) Crear cabecera
    const ref = `WEB-${Date.now()}`;
    const date_creation = new Date();

    const [orderResult]: any = await connection.execute(
      `
      INSERT INTO llx_commande (ref, fk_soc, date_creation, fk_statut, entity, remise_percent, note_private)
      VALUES (?, ?, ?, 0, 1, ?, ?)
      `,
      [ref, fk_soc, date_creation, clientDiscount, isRegisteredClient ? null : `Pedido web de: ${email}`]
    );

    const fk_commande = orderResult.insertId;

    // 4) Crear líneas
    let lineCount = 0;
    for (const item of cartItems) {

        const [productRows]: any = await connection.execute(
                `SELECT rowid, price, tva_tx, label, description
                FROM llx_product
                WHERE ref = ?
                    OR label = ?
                    OR ref LIKE ?
                LIMIT 1`,
                [
                item.productName,      // primero: ref exacto
                item.productName,      // segundo: label exacto
                `%${item.productName}%`, // tercero: contains
                ]
            );

            console.log(`Producto ${item.productName} encontrado:`, productRows.length > 0); // ← VER SI EXISTE

            if (!productRows.length) {
                console.log(`Saltando producto ${item.productName} (no existe)`);
                continue;
            }

            lineCount++;
            const product = productRows[0];
            const subprice = Number(product.price);
            const qty = Number(item.qty);
            const total_ht = subprice * qty;
            const total_tva = total_ht * (Number(product.tva_tx) / 100);
            const total_ttc = total_ht + total_tva;

            console.log(`Insertando línea ${lineCount}:`, { fk_commande, productId: product.rowid, qty }); // ← CONFIRMACIÓN

            await connection.execute(
                `
                INSERT INTO llx_commandedet
                (fk_commande, fk_product, qty, tva_tx, subprice, total_ht, total_tva, total_ttc, description, label, remise_percent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                fk_commande,
                product.rowid,
                qty,
                product.tva_tx,
                subprice,
                total_ht,
                total_tva,
                total_ttc,
                product.description,
                product.label,
                clientDiscount
                ]
            );
    }

    console.log(`Total líneas insertadas: ${lineCount}`);

    // 5) Totales
    await connection.execute(
      `
      UPDATE llx_commande
      SET total_ht = COALESCE((SELECT SUM(total_ht) FROM llx_commandedet WHERE fk_commande = ?), 0),
          total_ttc = COALESCE((SELECT SUM(total_ttc) FROM llx_commandedet WHERE fk_commande = ?), 0),
          total_tva = COALESCE((SELECT SUM(total_tva) FROM llx_commandedet WHERE fk_commande = ?), 0)
      WHERE rowid = ?
      `,
      [fk_commande, fk_commande, fk_commande, fk_commande]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      orderId: fk_commande,
      ref,
      fk_soc,
      company: societe,
      discountApplied: clientDiscount,
      isRegisteredClient,
      customerEmail: email,
    });
  } catch (error: any) {
    if (connection) await connection.rollback();
    return NextResponse.json(
      { error: "Error al procesar el pedido", details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}