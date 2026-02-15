"use client";

export function sanitizeHTML(html: string): string {
  // Solo sanitizar en el cliente (navegador)
  if (typeof window !== 'undefined') {
    // Importación dinámica de DOMPurify solo en el cliente
    const DOMPurify = require('dompurify');
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['table', 'thead', 'tbody', 'tr', 'td', 'th', 'p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'span', 'div'],
      ALLOWED_ATTR: ['class', 'style']
    });
  }
  
  // En el servidor, devolver el HTML tal cual (será sanitizado en el cliente)
  return html;
}