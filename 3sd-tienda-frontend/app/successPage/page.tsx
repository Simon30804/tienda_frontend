import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Check } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Pago Exitoso!
        </h1>
        <p className="text-gray-600 mb-6">
          Tu pedido ha sido confirmado. Recibirás un correo de confirmación pronto.
        </p>
        <Link href="/">
          <Button>Volver a la Tienda</Button>
        </Link>
      </div>
    </div>
  );
}