import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kahvaltikonagi.com.tr"),
  title: {
    default: "Kahvaltı Konağı | Kırıkkale'nin En İyi Kahvaltı ve Cafe Mekanı",
    template: "%s | Kahvaltı Konağı",
  },
  description:
    "Kırıkkale'de açık büfe kahvaltı, taze kahve ve cafe lezzetleri arayanların ilk tercihi: Kahvaltı Konağı. Hafta sonu 08:00-14:00 kahvaltı, 14:00 sonrası kafe keyfi için online rezervasyon yapın.",
  keywords: [
    "Kırıkkale kahvaltı",
    "Kırıkkale cafe",
    "Kırıkkale kahve",
    "Kırıkkale kafe",
    "Kırıkkale açık büfe kahvaltı",
    "Kırıkkale restoran",
    "Kahvaltı Konağı",
    "Kırıkkale kahvaltı mekanları",
    "Kırıkkale en iyi cafe"
  ],
  authors: [{ name: "Kahvaltı Konağı" }],
  creator: "Kahvaltı Konağı",
  publisher: "Kahvaltı Konağı",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kahvaltı Konağı | Kırıkkale'nin En İyi Kahvaltı ve Cafe Mekanı",
    description: "Kırıkkale'de açık büfe kahvaltı, taze kahve ve cafe lezzetleri arayanların ilk tercihi.",
    url: "https://kahvaltikonagi.com.tr",
    siteName: "Kahvaltı Konağı",
    images: [
      {
        url: "/media/mekan.jpeg",
        width: 1200,
        height: 630,
        alt: "Kahvaltı Konağı Mekan Görseli",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_ID || "",
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
