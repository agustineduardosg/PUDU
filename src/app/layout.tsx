import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PUDU | Prime Utility Digital Upgrade",
  description: "Liderando la evolución TI en las industrias estratégicas de Chile: De la salud a la minería, escalamos tu visión con precisión IA.",
  keywords: ["Transformación Digital", "IA", "Chile", "Minería", "Salud", "IoT", "Tecnología Industrial"],
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased selection:bg-brand-emerald/30">
        {children}
      </body>
    </html>
  );
}
