// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ScrollReset } from "@/components/ScrollReset";
import { CommandPalette } from "@/components/CommandPalette";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AllSetTools | Free All-In-One Online Web Tools Platform",
    template: "%s | AllSetTools",
  },
  description: "Free, high-performance, and secure online tools. Dev, text, formatting, image compression, AI tag generation, sitemaps, and financial calculators client-side.",
  metadataBase: new URL("https://allsettools.com"),
  keywords: ["online tools", "dev tools", "json formatter", "image compressor", "word counter", "base64", "free web tools"],
  authors: [{ name: "AllSetTools Team" }],
  openGraph: {
    title: "AllSetTools - Free All-In-One Online Web Tools Platform",
    description: "Free, high-performance, and secure online tools. Dev, text, formatting, image compression, AI tools, and calculators.",
    url: "https://allsettools.com",
    siteName: "AllSetTools",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AllSetTools - Free All-In-One Online Web Tools Platform",
    description: "Free, high-performance, and secure online tools.",
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
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      style={{ scrollBehavior: 'smooth' }}
      suppressHydrationWarning={true}
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-2926632423448738" />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JESG6DQSEL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-JESG6DQSEL');
          `}
        </Script>
      </head>
      <body
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}
        suppressHydrationWarning={true}
      >
        <ScrollReset />
        <Header />
        <main style={{ flex: 1, paddingTop: 'calc(64px + 2rem)', paddingBottom: '4rem' }}>
          {children}
        </main>
        <Footer />
        <BackToTop />
        <CommandPalette />
        <ToastProvider />
      </body>
    </html>
  );
}
