// src/app/forgot-password/page.tsx
import { Metadata } from 'next';
import ForgotClient from './ForgotClient';

export const metadata: Metadata = {
  title: "Forgot Password | AllSetTools",
  description: "Request a password reset link for your AllSetTools account.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ForgotPasswordPage() {
  return <ForgotClient />;
}
