// src/components/Footer.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="footer animate-fade-in" style={{ backgroundColor: 'var(--color-bg-subtle)', borderTop: '1px solid var(--color-border)', padding: '5rem 0 3rem 0', marginTop: '6rem' }}>
      <div className="container">
        
        {/* Footer Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '4rem'
        }}>
          
          {/* Brand Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <Logo size={30} showText={true} />
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-fg-muted)', maxWidth: '280px', margin: 0 }}>
              AllSetTools is a high-performance, client-side utility platform. All operations run 100% locally in your browser memory for maximum privacy.
            </p>
            <div>
              <Link href="/feedback" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8125rem' }}>
                Submit Feedback
              </Link>
            </div>
          </div>

          {/* Popular Tools Column */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-fg)', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Popular Tools
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link href="/tools/word-counter" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>Word Counter</Link>
              </li>
              <li>
                <Link href="/tools/json-formatter" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>JSON Formatter</Link>
              </li>
              <li>
                <Link href="/tools/base64-encoder" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>Base64 Encoder</Link>
              </li>
              <li>
                <Link href="/tools/image-compressor" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>Image Compressor</Link>
              </li>
              <li>
                <Link href="/tools/qr-code-generator" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>QR Code Generator</Link>
              </li>
            </ul>
          </div>

          {/* Categories Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-fg)', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Categories
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link href="/tools/text" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>Text Utilities</Link>
              </li>
              <li>
                <Link href="/tools/dev" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>Developer Tools</Link>
              </li>
              <li>
                <Link href="/tools/image" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>Image Utilities</Link>
              </li>
              <li>
                <Link href="/tools/utility" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>Utility Tools</Link>
              </li>
              <li>
                <Link href="/tools/business" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>Business Sheets</Link>
              </li>
            </ul>
          </div>

          {/* Platform Resources Column */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-fg)', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link href="/blog" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>Blog Tutorials</Link>
              </li>
              <li>
                <Link href="/about" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>About Us</Link>
              </li>
              <li>
                <Link href="/contact" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>Contact Support</Link>
              </li>
              <li>
                <Link href="/admin" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>Admin Console</Link>
              </li>
              <li>
                <Link href="/tools" style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', transition: 'color var(--transition-fast)' }}>All Tools Directory</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Divider */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }} className="footer-bottom">
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-fg-dimmed)', margin: 0, textAlign: 'center' }}>
            © {new Date().getFullYear()} AllSetTools. Handcrafted for privacy. Zero database storage of user inputs.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/privacy" style={{ fontSize: '0.8125rem', color: 'var(--color-fg-dimmed)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: '0.8125rem', color: 'var(--color-fg-dimmed)', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="/security" style={{ fontSize: '0.8125rem', color: 'var(--color-fg-dimmed)', textDecoration: 'none' }}>Security Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
