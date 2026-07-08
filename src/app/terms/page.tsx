// src/app/terms/page.tsx
import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icons';
import { Breadcrumb } from '@/components/Breadcrumb';

export const metadata = {
  title: "Terms of Service",
  description: "Read the AllSetTools Terms of Service. Understand the terms, liability disclaimers, and payload ownership clauses governing your use of our platform."
};

export default function TermsPage() {
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
        "@id": "https://allsettools.com/terms#webpage",
        "url": "https://allsettools.com/terms",
        "name": "Terms of Service",
        "description": "Read the AllSetTools Terms of Service. Understand the terms, liability disclaimers, and payload ownership clauses governing your use of our platform.",
        "isPartOf": {
          "@id": "https://allsettools.com/#website"
        },
        "breadcrumb": {
          "@id": "https://allsettools.com/terms#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://allsettools.com/terms#breadcrumb",
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
            "name": "Terms of Service",
            "item": "https://allsettools.com/terms"
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

      <Breadcrumb items={[
        { label: 'Home', url: '/' },
        { label: 'Terms of Service' }
      ]} />

      {/* Header Banner */}
      <section style={{
        padding: '3rem 0 2.5rem 0',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '3rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.25rem' }}>
          <div className="icon-wrapper" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)' }}>
            <Icon name="file-code" style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em', border: 'none', padding: 0, margin: 0, lineHeight: 1.1 }}>
              Terms of Service
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', margin: '4px 0 0 0', fontWeight: 500 }}>
              Last updated: July 1, 2026
            </p>
          </div>
        </div>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-fg-muted)', maxWidth: '700px', lineHeight: '1.6' }}>
          By accessing AllSetTools, you agree to these Terms. If you do not agree, please discontinue using the platform.
        </p>
      </section>

      <div className="tool-container">
        
        {/* Policy Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>1. Acceptance & Use</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              AllSetTools is a free-to-use utility catalog. By using this website, you agree to comply with all applicable local, national, and international laws. Access is granted for personal and professional development purposes. No registration is required.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>2. Client-Side Operations & Warranty Disclaimer</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              All calculations, formatting, encoding, and media conversions are provided &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo;, without warranty of any kind. 
            </p>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              While we attempt to keep our converters (e.g. JSON formatters, business sheets) accurate and error-free, AllSetTools does not represent or warrant the complete accuracy or reliability of any outputs. You are responsible for double-checking all files, code strings, or generated results before deploying them to production environments.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>3. Intellectual Property of Payloads</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              We assert no ownership rights over any inputs you paste or files you drop into the platform. 
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-fg-muted)' }}>
              <li>All database scripts, text layouts, JWT structures, QR code designs, and media files processed on this site belong exclusively to you.</li>
              <li>Since all operations are local, no data is cached, cloned, or retained by AllSetTools.</li>
            </ul>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>4. Prohibited Platform Misuse</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              You agree not to engage in malicious operations against AllSetTools, including:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-fg-muted)' }}>
              <li>Spamming or sending high-volume automated requests that degrade navigation speed for other users.</li>
              <li>Scraping tool scripts, libraries, or articles for commercial duplication.</li>
              <li>Injecting malicious JavaScript, SQL scripts, or viruses into custom input boxes (though inputs are sandboxed in your browser, attempting exploits is strictly prohibited).</li>
            </ul>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>5. Limitation of Liability</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              In no event shall AllSetTools, its developers, or sponsors be liable for any direct, indirect, incidental, consequential, or punitive damages (including loss of code files, database corruptions, calculator errors, or business disruptions) arising out of your use or inability to use the tools.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>6. Changes to These Terms</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-fg-muted)' }}>
              We reserve the right to modify these terms at any time. Updates will be posted on this page with an updated &ldquo;Last updated&rdquo; timestamp. Continued usage of the site represents acceptance of the updated terms.
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
              <Link href="/privacy" className="sidebar-nav-item">
                <Icon name="shield-check" style={{ width: '14px', height: '14px' }} />
                <span>Privacy Policy</span>
              </Link>
              <Link href="/terms" className="sidebar-nav-item active">
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
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Open Source & Free</h4>
            <p style={{ fontSize: '0.75rem', lineHeight: '1.5', margin: 0 }}>
              This platform does not feature paid memberships or monthly billing. You are free to run these tools as much as your browser allows.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
