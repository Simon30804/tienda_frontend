import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "./ui/sonner";

export function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          {children}
          <Toaster position="top-right" />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}