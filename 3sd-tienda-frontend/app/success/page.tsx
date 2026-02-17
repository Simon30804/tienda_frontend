"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Check } from "lucide-react";
import { useCart } from "@/src/context/CartContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Pago Exitoso!
        </h1>
        
        <p className="text-gray-600 mb-2">
          Tu pedido ha sido confirmado correctamente.
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          Recibirás un correo de confirmación con los detalles de tu pedido.
        </p>

        {sessionId && (
          <p className="text-xs text-gray-400 mb-6 font-mono">
            ID de sesión: {sessionId}
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700">
              Volver a la Tienda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Cargando...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}