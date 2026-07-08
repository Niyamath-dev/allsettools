// src/app/register/RegisterClient.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { toast } from '@/components/Toast';

export default function RegisterClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
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
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success('Registration request submitted successfully!');
        setRegisteredEmail(email);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || 'Failed to submit registration request.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Network error during registration.');
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
        "@id": "https://allsettools.com/register#webpage",
        "url": "https://allsettools.com/register",
        "name": "Register Console",
        "description": "Register an admin or developer account on AllSetTools. Signups require active admin approval.",
        "isPartOf": {
          "@id": "https://allsettools.com/#website"
        },
        "breadcrumb": {
          "@id": "https://allsettools.com/register#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://allsettools.com/register#breadcrumb",
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
            "name": "Register",
            "item": "https://allsettools.com/register"
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

      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Register' }]} />

      <div style={{ maxWidth: '480px', margin: '2rem auto 0 auto' }}>
        {registeredEmail ? (
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, border: 'none', margin: 0, padding: 0 }}>Request Submitted</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', margin: 0 }}>
              Your account request for <strong style={{ color: 'var(--color-fg)' }}>{registeredEmail}</strong> has been received. 
              The system administrator has been notified. You will be able to log in once your registration is accepted and approved.
            </p>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
              <Link href="/admin" className="btn btn-primary" style={{ padding: '8px 24px' }}>
                Go to Admin Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, border: 'none', margin: '0 0 0.25rem 0', padding: 0 }}>Create Account</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', margin: 0 }}>
                Sign up for access. Registrations require administrator approval.
              </p>
            </div>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input"
                  placeholder="e.g. Marcus Vance"
                  required
                />
              </div>

              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input"
                  placeholder="e.g. marcus@company.com"
                  required
                />
              </div>

              <div>
                <label className="label">Password</label>
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
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="Repeat your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem', padding: '10px' }}
              >
                {submitting ? 'Submitting Request...' : 'Register Account'}
              </button>
            </form>

            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '1.5rem', paddingTop: '1rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-fg-muted)' }}>
              Already registered?{' '}
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
