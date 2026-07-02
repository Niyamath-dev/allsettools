// src/app/admin/page.tsx
import { Metadata } from 'next';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: "Admin Portal | AllSetTools",
  description: "Secure workspace administration control console for local integrations.",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return <AdminClient />;
}
