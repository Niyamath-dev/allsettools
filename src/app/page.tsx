// src/app/page.tsx
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: {
    absolute: "AllSetTools | Free All-In-One Online Web Tools Platform"
  },
  description: "Access 200+ free, fast, and secure client-side web tools. Includes JSON formatters, image compressors, AI tag generators, base64 encoders, and offline-ready developer utilities.",
  keywords: [
    "online web tools",
    "developer utilities",
    "JSON formatter",
    "image compressor",
    "word counter",
    "base64 decoder",
    "free SEO tools",
    "offline web tools",
    "allsettools"
  ],
  alternates: {
    canonical: "https://allsettools.com",
  },
  openGraph: {
    title: "AllSetTools - Free All-In-One Online Web Tools Platform",
    description: "Access 200+ free, fast, and secure client-side web tools. Includes JSON formatters, image compressors, AI tag generators, base64 encoders, and offline-ready developer utilities.",
    url: "https://allsettools.com",
    siteName: "AllSetTools",
    type: "website",
  }
};

export default function Home() {
  return <HomeClient />;
}
