// src/app/reset-password/page.tsx
import { Metadata } from 'next';
import ResetClient from './ResetClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Reset Password | AllSetTools",
  description: "Configure a new password for your AllSetTools account.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading password reset console...</div>}>
      <ResetClient />
    </Suspense>
  );
}
