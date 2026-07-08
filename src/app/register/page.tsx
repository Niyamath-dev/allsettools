// src/app/register/page.tsx
import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: "Account Registration | AllSetTools",
  description: "Register for an AllSetTools account. Signups require administrator authorization before access is granted.",
  robots: {
    index: false,
    follow: false
  }
};

export default function RegisterPage() {
  return <RegisterClient />;
}
