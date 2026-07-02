// src/app/contact/page.tsx
import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the AllSetTools team. Request new developer utility tools, report bugs, ask support questions, or contact us for partnership opportunities.",
  keywords: [
    "contact allsettools",
    "request web tool",
    "submit bug report",
    "developer tools support",
    "allsettools contact"
  ],
  alternates: {
    canonical: "https://allsettools.dev/contact",
  },
  openGraph: {
    title: "Contact Us",
    description: "Get in touch with the AllSetTools team. Request new developer utility tools, report bugs, ask support questions, or contact us for partnership opportunities.",
    url: "https://allsettools.dev/contact",
    siteName: "AllSetTools",
    type: "website",
  }
};

export default function Contact() {
  return <ContactClient />;
}
