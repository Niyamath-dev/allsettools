// src/components/Footer.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/registry';
import { toast } from './Toast';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    // Save to localStorage to simulate database subscriber storage
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (subscribers.includes(email)) {
      toast.show('You are already subscribed!', 'info');
    } else {
      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      toast.success('Thank you for subscribing to AllSetTools!');
    }
    setEmail('');
  };

  return (
    <footer className="footer animate-fade-in">
      <div className="container">
        {/* Support Banner / Buy me a coffee */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 2rem',
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-sm)'
        }} className="support-banner">
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-fg)' }}>
            Want to support?
          </span>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffdd00',
              color: '#000000',
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            className="bmc-btn"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ marginRight: '2px' }}
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
            Buy me a coffee
          </a>
        </div>

        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link href="/" style={{ marginBottom: '0.25rem', textDecoration: 'none', display: 'inline-block' }}>
              <Logo size={28} showText={true} />
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-fg-muted)', maxWidth: '280px' }}>
              A free, all-in-one online tools platform. Built client-side for maximum security, speed, and privacy.
            </p>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '8px' }}>
              <Link href="/feedback" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                Feedback
              </Link>
            </div>
          </div>

          {/* Categories Columns */}
          <div>
            <h4 className="footer-title">Categories</h4>
            <ul className="footer-links">
              {CATEGORIES.slice(0, 4).map(c => (
                <li key={c.id}>
                  <Link href={`/#category-${c.id}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="footer-title">&nbsp;</h4>
            <ul className="footer-links">
              {CATEGORIES.slice(4).map(c => (
                <li key={c.id}>
                  <Link href={`/#category-${c.id}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div>
            <h4 className="footer-title">Newsletter</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
              Get notified when we launch new developer, text, or design tools. No spam.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                style={{ fontSize: '0.8125rem', padding: '8px 12px' }}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px' }}>
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)' }}>
            © {new Date().getFullYear()} AllSetTools. All rights reserved. User data remains 100% private and client-side.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link href="/privacy" style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)' }}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)' }}>Terms</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--color-fg-dimmed)' }}>GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
