// src/app/contact/page.tsx
"use client";

import React, { useState } from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { toast } from '@/components/Toast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      id: Math.random().toString(36).substring(2, 9),
      name: name || 'Anonymous Client',
      email,
      subject,
      message,
      submittedAt: new Date().toLocaleString()
    };

    // 1. Save locally as fallback
    let localSaved = false;
    try {
      const existing = JSON.parse(localStorage.getItem('allsettools_contact_messages') || '[]');
      existing.push(payload);
      localStorage.setItem('allsettools_contact_messages', JSON.stringify(existing));
      localSaved = true;
    } catch (err) {
      console.error('Local Storage error:', err);
    }

    // 2. Post to API to sync with Google Sheets
    try {
      const customUrl = localStorage.getItem('allsettools_google_sheet_url') || localStorage.getItem('allsettools_contact_sheet_url') || '';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (customUrl) {
        headers['x-sheet-url'] = customUrl;
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Your message has been sent!');
      } else {
        const errorData = await res.json().catch(() => ({}));
        const isNotConfigured = res.status === 400 || (errorData.error && errorData.error.includes('not configured'));
        if (isNotConfigured) {
          if (localSaved) {
            toast.success('Message saved locally. (Google Sheets not configured in dashboard)');
          } else {
            toast.error('Failed to register inquiry.');
          }
        } else {
          toast.error(errorData.error || 'Failed to sync to Google Sheets.');
        }
      }
    } catch (err) {
      console.error('Google Sheets sync error:', err);
      if (localSaved) {
        toast.success('Message saved locally (Failed to sync with Google Sheets).');
      } else {
        toast.error('Failed to submit message.');
      }
    }

    setName('');
    setEmail('');
    setSubject('General Inquiry');
    setMessage('');
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem' }}>
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Contact Us' }]} />

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.5rem', border: 'none' }}>
          Contact AllSetTools Team
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-fg-muted)', maxWidth: '600px' }}>
          Reach out for partnership inquiries, custom tool requests, or self-hosting support.
        </p>
      </div>

      <div className="tool-container">

        {/* Contact Form */}
        <form onSubmit={submitContact} className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', border: 'none', padding: 0 }}>Send a Message</h3>

          <div className="grid-cols-2" style={{ gap: '1rem' }}>
            <div>
              <label className="label">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Your Name" />
            </div>
            <div>
              <label className="label">Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@domain.com" required />
            </div>
          </div>

          <div>
            <label className="label">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)} className="input">
              <option value="General Inquiry">General Inquiry</option>
              <option value="Sponsorship & Ads">Sponsorship & Ads</option>
              <option value="Custom Tool Request">Custom Tool Request</option>
              <option value="Bug Report">Technical Bug Report</option>
            </select>
          </div>

          <div>
            <label className="label">Message Details *</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="input textarea"
              placeholder="Provide a detailed message of what you need..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            Submit Message
          </button>
        </form>

        {/* Sidebar Info Card */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', gap: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Contact Details</h4>

            <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <strong style={{ color: 'var(--color-fg)' }}>Support Email:</strong>
                <p style={{ color: 'var(--color-fg-muted)', fontSize: '0.8125rem', marginTop: '2px' }}>support@allsettools.dev</p>
              </div>
              <div>
                <strong style={{ color: 'var(--color-fg)' }}>Average Response:</strong>
                <p style={{ color: 'var(--color-fg-muted)', fontSize: '0.8125rem', marginTop: '2px' }}>Within 24 business hours</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--color-bg-subtle)', borderStyle: 'dashed' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Self-Hosting?</h4>
            <p style={{ fontSize: '0.75rem', lineHeight: '1.5' }}>
              AllSetTools is open source and supports standalone Docker deployments. Check out our installation guides inside the README file.
            </p>
          </div>
        </aside>

      </div>

      {/* FAQs Collapsible Accordion */}
      <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem', marginTop: '3rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: 'var(--color-fg)', border: 'none', padding: 0 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>How long does it take to receive a response?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              We read every submission and aim to respond to bug reports, custom tool inquiries, and sponsor partnerships within 24 business hours.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Can I request a custom developer utility?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              Yes, absolutely! We prioritize new tools based on user demand. Select &apos;Custom Tool Request&apos; in the subject dropdown and describe your format specifications.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Is there a direct email support line?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              Yes, you can write directly to our technical support team at support@allsettools.dev for assistance with self-hosting, tools bugs, or sponsorship.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Where are contact submissions logged?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              Submissions are automatically synced to your configured Google Sheets spreadsheet via secure API integration. If no integration is active, they are securely saved locally inside your browser session database.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
