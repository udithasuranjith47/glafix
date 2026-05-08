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
  metadataBase: new URL("https://glafix.com"),
  title: {
    default: "Glafix — Best AI Tools for One-Person Businesses",
    template: "%s | Glafix",
  },
  description:
    "Hand-tested AI tool reviews, comparisons, and how-to guides. Find the right AI stack for your business — tested with real money, real projects.",
  keywords: [
    "AI tools", "AI tool reviews", "best AI tools 2026", "AI for small business",
    "AI software comparison", "no-code AI", "AI SaaS reviews",
  ],
  authors: [{ name: "Glafix" }],
  creator: "Glafix",
  publisher: "Glafix",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    siteName: "Glafix",
    type: "website",
    locale: "en_US",
    url: "https://glafix.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@glafix",
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
