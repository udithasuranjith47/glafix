import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { PageViewTracker } from "@/components/public/PageViewTracker";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Glafix — High-Ticket AI SaaS",
    template: "%s | Glafix",
  },
  description:
    "Deep analysis, reviews, and tutorials on high-ticket AI SaaS products. Built for founders, operators, and investors.",
  openGraph: {
    siteName: "Glafix",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${playfair.variable} ${dmSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <PageViewTracker />
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "oklch(0.12 0 0)",
              border: "1px solid oklch(1 0 0 / 8%)",
              color: "oklch(0.94 0.01 70)",
            },
          }}
        />
      </body>
    </html>
  );
}
