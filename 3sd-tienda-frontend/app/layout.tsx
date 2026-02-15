import type { Metadata } from "next";
import "./globals.css"; 
import { RootLayout } from "../src/components/RootLayout";

export const metadata: Metadata = {
  title: "3SD Tienda",
  description: "Tu tienda online",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}