// src/app/reset-password/ResetClient.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { toast } from '@/components/Toast';

export default function ResetClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      toast.error('Invalid or missing parameters in reset link.');
      return;
    }

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token, newPassword: password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast.success('Password updated successfully!');
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Reset password submit error:', err);
      toast.error('Network error during reset.');
    } finally {
      setSubmitting(false);
    }
  };

  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://allsettools.com/#organization",
        "name": "AllSetTools",
        "url": "https://allsettools.com",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://allsettools.com/#logo",
          "url": "https://allsettools.com/ALL%20Set%20Tools%20logo.png",
          "caption": "AllSetTools Logo"
        },
        "image": {
          "@id": "https://allsettools.com/#logo"
        },
        "description": "Free 100% offline-ready web utilities and programmatic toolsets."
      },
      {
        "@type": "WebSite",
        "@id": "https://allsettools.com/#website",
        "url": "https://allsettools.com",
        "name": "AllSetTools",
        "description": "Free 100% offline-ready web utilities and programmatic toolsets.",
        "publisher": {
          "@id": "https://allsettools.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://allsettools.com/?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://allsettools.com/reset-password#webpage",
        "url": "https://allsettools.com/reset-password",
        "name": "Reset Password",
        "description": "Configure a new password for your AllSetTools account.",
        "isPartOf": {
          "@id": "https://allsettools.com/#website"
        },
        "breadcrumb": {
          "@id": "https://allsettools.com/reset-password#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://allsettools.com/reset-password#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://allsettools.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Reset Password",
            "item": "https://allsettools.com/reset-password"
          }
        ]
      }
    ]
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem', paddingBottom: '4rem' }}>
      {/* JSON-LD Schema Markup Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Reset Password' }]} />

      <div style={{ maxWidth: '440px', margin: '3rem auto 0 auto' }}>
        {success ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, border: 'none', margin: 0, padding: 0 }}>Password Updated</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', margin: 0 }}>
              Your account password has been successfully reset. You can now use your new credentials to sign in.
            </p>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
              <Link href="/admin" className="btn btn-primary" style={{ padding: '8px 24px' }}>
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, border: 'none', margin: '0 0 0.25rem 0', padding: 0 }}>Define New Password</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', margin: 0 }}>
                Configure a secure password for <strong style={{ color: 'var(--color-fg)' }}>{email || 'your account'}</strong>.
              </p>
            </div>

            {!token || !email ? (
              <div className="card" style={{ padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: 'var(--color-danger)', fontSize: '0.8125rem', textAlign: 'center' }}>
                Missing email or verification token. Ensure you clicked the link correctly from your email inbox.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="label">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input"
                    placeholder="At least 6 characters"
                    required
                  />
                </div>

                <div>
                  <label className="label">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input"
                    placeholder="Repeat new password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem', padding: '10px' }}
                >
                  {submitting ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            )}

            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '1.5rem', paddingTop: '1rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-fg-muted)' }}>
              <Link href="/admin" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
