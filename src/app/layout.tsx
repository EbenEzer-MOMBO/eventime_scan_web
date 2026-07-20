import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
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
  title: "Eventime Scan - Gestion des événements",
  description: "Application de scan et gestion des participants pour les événements Eventime",
  keywords: ["eventime", "scan", "événements", "tickets", "participants", "QR code"],
  authors: [{ name: "Eventime" }],
  applicationName: "Eventime Scan",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Eventime Scan",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Eventime Scan",
    description: "Application de scan et gestion des participants pour les événements Eventime",
    url: "https://eventime.ga",
    siteName: "Eventime Scan",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Eventime Scan",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Eventime Scan",
    description: "Application de scan et gestion des participants pour les événements Eventime",
    images: ["/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#8BC34A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
