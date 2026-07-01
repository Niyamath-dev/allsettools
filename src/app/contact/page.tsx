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

  const submitContact = (e: React.FormEvent) => {
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

    try {
      const existing = JSON.parse(localStorage.getItem('allsettools_contact_messages') || '[]');
      existing.push(payload);
      localStorage.setItem('allsettools_contact_messages', JSON.stringify(existing));
      toast.success('Your message has been sent successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to register inquiry.');
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
    </div>
  );
}
