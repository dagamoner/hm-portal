import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MH Higiene y Seguridad Laboral",
  description: "Servicios integrales de Higiene y Seguridad Laboral B2B. Consultoría, capacitaciones, inspecciones y gestión de riesgos para tu empresa.",
  keywords: ["higiene y seguridad", "seguridad laboral", "consultoría", "SRT", "prevención de riesgos", "capacitaciones", "inspecciones", "Argentina"],
  openGraph: {
    title: "MH Higiene y Seguridad Laboral",
    description: "Servicios integrales de Higiene y Seguridad Laboral B2B para tu empresa.",
    url: "https://mhhigieneyseguridad.com",
    siteName: "MH Higiene y Seguridad",
    locale: "es_AR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
