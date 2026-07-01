// src/app/privacy/page.tsx
import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icons';
import { Breadcrumb } from '@/components/Breadcrumb';

export const metadata = {
  title: "Privacy Policy | AllSetTools",
  description: "Read the AllSetTools Privacy Policy. Learn about our 100% client-side, zero-server data processing model that ensures absolute security and privacy."
};

export default function PrivacyPage() {
  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem', paddingBottom: '4rem' }}>
      
      <Breadcrumb items={[
        { label: 'Home', url: '/' },
        { label: 'Privacy Policy' }
      ]} />

      {/* Header Banner */}
      <section style={{
        padding: '3rem 0 2.5rem 0',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '3rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.25rem' }}>
          <div className="icon-wrapper" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)' }}>
            <Icon name="shield-check" style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em', border: 'none', padding: 0, margin: 0, lineHeight: 1.1 }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', margin: '4px 0 0 0', fontWeight: 500 }}>
              Last updated: July 1, 2026
            </p>
          </div>
        </div>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-fg-muted)', maxWidth: '700px', lineHeight: '1.6' }}>
          AllSetTools is engineered with a privacy-first architecture. Because all tools execute entirely inside your browser, your data never leaves your device.
        </p>
      </section>

      <div className="tool-container">
        
        {/* Policy Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>1. Zero Data Transmission Policy</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              AllSetTools provides utility services (formatters, decoders, minifiers, calculators, and converters) that operate 100% client-side. When you paste text, drop code files, or perform actions, the data is processed strictly in your local device's memory (RAM) using client-side JavaScript. We do not transmit, upload, inspect, log, or store your payloads on any remote server.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>2. Browser Local Storage Usage</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              To personalize your workspace, AllSetTools uses standard browser storage mechanism (LocalStorage). This includes storing:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-fg-muted)' }}>
              <li>Your theme preference (Dark or Light Mode).</li>
              <li>Your custom favorites list (bookmarked tools).</li>
              <li>Your list of recently used tools.</li>
            </ul>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              This data is retained solely in your local browser sandbox and can be cleared at any time by emptying your browser cache or site data.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>3. Third-Party API Key Safety</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              Certain premium AI utilities allow you to configure your own OpenAI or Google Gemini API keys.
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-fg-muted)' }}>
              <li><strong>Local Storage:</strong> Your keys are stored only in your local browser sandbox and never shared with AllSetTools servers.</li>
              <li><strong>Direct Client Calls:</strong> API calls are initiated directly from your client machine to the respective provider's endpoints (e.g., api.openai.com) via secure HTTPS tunnels. No intermediary proxy intercepts your keys.</li>
            </ul>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>4. Non-Intrusive Analytics & Cookies</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              We do not track you across the web. We use basic, privacy-friendly telemetry utilities (e.g., local-hosted analytics) to measure page view aggregations and optimize tool responsiveness. These cookies collect no personally identifiable information (PII) and compile no tracking histories.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>5. Children's Privacy</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              AllSetTools collects no personal details from any users. The platform is entirely free and safe for anyone, including minors, as no signup or user profiles exist on our platform.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>6. Contact & Data Concerns</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              If you have any questions regarding our local storage usage, security protocols, or privacy practices, you can submit feedback directly via our feedback page or reach us at <strong style={{ color: 'var(--color-fg)' }}>support@allsettools.dev</strong>.
            </p>
          </div>

        </div>

        {/* Sidebar Nav */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-fg)', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Legal Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/privacy" className="sidebar-nav-item active">
                <Icon name="shield-check" style={{ width: '14px', height: '14px' }} />
                <span>Privacy Policy</span>
              </Link>
              <Link href="/terms" className="sidebar-nav-item">
                <Icon name="file-code" style={{ width: '14px', height: '14px' }} />
                <span>Terms of Service</span>
              </Link>
              <Link href="/security" className="sidebar-nav-item">
                <Icon name="key" style={{ width: '14px', height: '14px' }} />
                <span>Security Policy</span>
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--color-bg-subtle)', borderStyle: 'dashed' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Browser Processing</h4>
            <p style={{ fontSize: '0.75rem', lineHeight: '1.5', margin: 0 }}>
              Confirm your local environment is processing by turning off internet access; all formatters, text counters, and generators will continue running normally.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
