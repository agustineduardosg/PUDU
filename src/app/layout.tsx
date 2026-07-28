import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://puduit.tech"),
  title: {
    default: "PUDU | Software, automatización e IA para empresas",
    template: "%s | PUDU IT Solutions",
  },
  description:
    "Landing pages, CRM, automatizaciones, aplicaciones y software a medida para que empresas chilenas vendan, operen y escalen mejor.",
  keywords: [
    "desarrollo de software Chile",
    "automatización de empresas",
    "CRM Chile",
    "landing page Chile",
    "inteligencia artificial para empresas",
    "aplicaciones a medida",
  ],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/",
    siteName: "PUDU IT Solutions",
    title: "Software, automatización e IA para empresas | PUDU",
    description:
      "Transformamos procesos lentos en sistemas que venden, coordinan y escalan.",
    images: [
      {
        url: "/images/industries/web-pudu.jpg",
        alt: "PUDU IT Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software, automatización e IA para empresas | PUDU",
    description:
      "Transformamos procesos lentos en sistemas que venden, coordinan y escalan.",
    images: ["/images/industries/web-pudu.jpg"],
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
