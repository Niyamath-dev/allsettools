// src/app/security/page.tsx
import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icons';
import { Breadcrumb } from '@/components/Breadcrumb';

export const metadata = {
  title: "Security Policy",
  description: "Read the AllSetTools Security Policy. Learn about our local browser sandbox, HTTPS enforcement, daily CVE scans, and vulnerability disclosure protocol."
};

export default function SecurityPage() {
  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem', paddingBottom: '4rem' }}>
      
      <Breadcrumb items={[
        { label: 'Home', url: '/' },
        { label: 'Security Policy' }
      ]} />

      {/* Header Banner */}
      <section style={{
        padding: '3rem 0 2.5rem 0',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '3rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.25rem' }}>
          <div className="icon-wrapper" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)' }}>
            <Icon name="key" style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em', border: 'none', padding: 0, margin: 0, lineHeight: 1.1 }}>
              Security Policy
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', margin: '4px 0 0 0', fontWeight: 500 }}>
              Last updated: July 1, 2026
            </p>
          </div>
        </div>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-fg-muted)', maxWidth: '700px', lineHeight: '1.6' }}>
          Security is the core foundation of AllSetTools. Our local-first execution model shields your data from network exploits and database leaks.
        </p>
      </section>

      <div className="tool-container">
        
        {/* Policy Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>1. Local Browser Sandboxing</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              Traditional utility websites send your text, documents, and private configurations to a cloud database to perform conversions. This exposes your keys, payloads, and passwords to network sniffing, server log leaks, and database compromises.
            </p>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              AllSetTools solves this by executing 100% of calculations locally. Your inputs are isolated in your browser tab's standard JavaScript environment and processed using CPU-bound loops.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>2. No Intermediary Proxy Relays</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              For tools requiring third-party API communication (like generative AI components), all endpoints are contacted directly from your client sandbox via secure HTTPS.
            </p>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              We do not route your requests through private intermediate proxy servers. This ensures that your API credentials (e.g. OpenAI keys) are communicated strictly between your local client IP and the official provider.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>3. Transport Layer Security (HTTPS)</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              AllSetTools enforces strict HTTPS communication across all pages. We implement HSTS (HTTP Strict Transport Security) to prevent downgrade attacks and mandate TLS 1.3 and TLS 1.2 protocols for all assets and content deliveries.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>4. Dependency Auditing</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              To defend against supply chain attacks, AllSetTools utilizes automated dependency scanners to check all node package dependencies for CVE disclosures. We keep libraries and compilers updated to exclude outdated code blocks and minimize potential client exploit vectors.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>5. Vulnerability Disclosure Protocol</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              We welcome security researchers and developers to inspect our client scripts and layout setups. If you identify a security issue, code leak, or package vulnerability:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-fg-muted)' }}>
              <li><strong>Do Not Disclose Publicly:</strong> Contact us privately to allow time for hotfixes.</li>
              <li><strong>Reporting Channel:</strong> Email us a summary at <strong style={{ color: 'var(--color-fg)' }}>security@allsettools.com</strong>. Please include a brief description of the issue and steps to reproduce.</li>
              <li><strong>Hotfixes:</strong> We aim to audit and publish patches for all critical vulnerabilities within 48 hours of notification.</li>
            </ul>
          </div>

        </div>

        {/* Sidebar Nav */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-fg)', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Legal Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/privacy" className="sidebar-nav-item">
                <Icon name="shield-check" style={{ width: '14px', height: '14px' }} />
                <span>Privacy Policy</span>
              </Link>
              <Link href="/terms" className="sidebar-nav-item">
                <Icon name="file-code" style={{ width: '14px', height: '14px' }} />
                <span>Terms of Service</span>
              </Link>
              <Link href="/security" className="sidebar-nav-item active">
                <Icon name="key" style={{ width: '14px', height: '14px' }} />
                <span>Security Policy</span>
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--color-bg-subtle)', borderStyle: 'dashed' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Zero Server Logs</h4>
            <p style={{ fontSize: '0.75rem', lineHeight: '1.5', margin: 0 }}>
              Because there is no intermediate database, we retain zero server logging of your files, private keys, database schemas, or code outputs.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
