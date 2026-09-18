import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Website Auditor | Okamžitá SEO & Performance Analýza",
  description:
    "Komplexní bezplatný nástroj pro audit webových stránek. Měření Core Web Vitals, SEO crawler, kontrola přístupnosti (WCAG), porovnání s konkurencí a AI doporučení.",
  keywords: [
    "website auditor",
    "SEO audit",
    "Lighthouse test",
    "přístupnost webu",
    "Core Web Vitals",
    "WCAG kontrola",
    "analýza rychlosti webu",
    "umělá inteligence SEO",
  ],
  authors: [{ name: "AI Website Auditor Team" }],
  creator: "AI Website Auditor",
  metadataBase: new URL("https://ai-website-auditor.vercel.app"),
  openGraph: {
    title: "AI Website Auditor | Okamžitá SEO & Performance Analýza",
    description:
      "Otestujte svůj web zdarma. Získejte okamžité skóre pro rychlost, SEO, přístupnost a konkrétní AI návrhy na zlepšení.",
    url: "https://ai-website-auditor.vercel.app",
    siteName: "AI Website Auditor",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Website Auditor | Okamžitá SEO & Performance Analýza",
    description: "Komplexní audit webových stránek poháněný umělou inteligencí.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Website Auditor",
  url: "https://ai-website-auditor.vercel.app",
  description:
    "Profesionální nástroj pro audit webových stránek: SEO, Core Web Vitals, přístupnost a AI doporučení.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CZK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
