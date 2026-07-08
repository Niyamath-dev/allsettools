// src/app/forgot-password/ForgotClient.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { toast } from '@/components/Toast';

export default function ForgotClient() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success('Password reset link requested successfully!');
        setRequested(true);
      } else {
        toast.error(data.error || 'Failed to request password reset.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error('Network error during request.');
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
        "@id": "https://allsettools.com/forgot-password#webpage",
        "url": "https://allsettools.com/forgot-password",
        "name": "Forgot Password",
        "description": "Request a password reset link for your AllSetTools account.",
        "isPartOf": {
          "@id": "https://allsettools.com/#website"
        },
        "breadcrumb": {
          "@id": "https://allsettools.com/forgot-password#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://allsettools.com/forgot-password#breadcrumb",
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
            "name": "Forgot Password",
            "item": "https://allsettools.com/forgot-password"
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

      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Forgot Password' }]} />

      <div style={{ maxWidth: '440px', margin: '3rem auto 0 auto' }}>
        {requested ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto'
            }}>
              ✉
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, border: 'none', margin: 0, padding: 0 }}>Check Your Inbox</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', margin: 0 }}>
              If an approved account exists for <strong style={{ color: 'var(--color-fg)' }}>{email}</strong>, a password reset link has been dispatched to your email address. It will expire in 1 hour.
            </p>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
              <Link href="/admin" className="btn btn-primary" style={{ padding: '8px 24px' }}>
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, border: 'none', margin: '0 0 0.25rem 0', padding: 0 }}>Reset Password</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', margin: 0 }}>
                Enter your account email below to receive a secure password reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label">Account Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input"
                  placeholder="e.g. name@company.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem', padding: '10px' }}
              >
                {submitting ? 'Requesting Link...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '1.5rem', paddingTop: '1rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-fg-muted)' }}>
              Recall password?{' '}
              <Link href="/admin" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
