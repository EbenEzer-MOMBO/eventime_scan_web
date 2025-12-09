import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  icons: {
    icon: "https://eventime.ga/public/storage/img-utils-page/y3Ql5KilXKiHwXiNuvCtbXRl6G8uWnS0Fh5Ipj2W.png",
    apple: "https://eventime.ga/public/storage/img-utils-page/y3Ql5KilXKiHwXiNuvCtbXRl6G8uWnS0Fh5Ipj2W.png",
  },
  openGraph: {
    title: "Eventime Scan",
    description: "Application de scan et gestion des participants pour les événements Eventime",
    url: "https://eventime.ga",
    siteName: "Eventime Scan",
    images: [
      {
        url: "https://eventime.ga/public/storage/img-utils-page/y3Ql5KilXKiHwXiNuvCtbXRl6G8uWnS0Fh5Ipj2W.png",
        width: 1200,
        height: 630,
        alt: "Eventime Scan",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventime Scan",
    description: "Application de scan et gestion des participants pour les événements Eventime",
    images: ["https://eventime.ga/public/storage/img-utils-page/y3Ql5KilXKiHwXiNuvCtbXRl6G8uWnS0Fh5Ipj2W.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
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
      </body>
    </html>
  );
}
