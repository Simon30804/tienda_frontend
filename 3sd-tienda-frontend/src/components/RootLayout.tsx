import { CartProvider } from "../context/CartContext";
import { Toaster } from "./ui/sonner";

export function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
        <Toaster position="top-right" />
      </div>
    </CartProvider>
  );
}