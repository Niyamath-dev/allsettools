// src/app/about/page.tsx
import React from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import Link from 'next/link';

export const metadata = {
  title: 'About Us',
  description: 'Learn more about AllSetTools, the free all-in-one client-side developer utility platform. Built for privacy, simplicity, and speed.',
};

export default function AboutPage() {
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
        "@id": "https://allsettools.com/about#webpage",
        "url": "https://allsettools.com/about",
        "name": "About Us",
        "description": "Learn more about AllSetTools, the free all-in-one client-side developer utility platform. Built for privacy, simplicity, and speed.",
        "isPartOf": {
          "@id": "https://allsettools.com/#website"
        },
        "breadcrumb": {
          "@id": "https://allsettools.com/about#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://allsettools.com/about#breadcrumb",
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
            "name": "About Us",
            "item": "https://allsettools.com/about"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://allsettools.com/about#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the core mission of AllSetTools?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our mission is to provide developers, designers, and web operators with a secure, high-performance, and completely free utility suite. We believe online formatters, hash calculators, and encoders should never compromise user data privacy or restrict functions behind paywalls or registration forms."
            }
          },
          {
            "@type": "Question",
            "name": "How does client-side execution protect my data?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Unlike standard utilities that upload content to remote SQL databases, all calculations on AllSetTools run locally in your browser sandbox using JavaScript. This guarantees that your sensitive API tokens, raw passwords, or binary images never cross the network or get logged on our server logs."
            }
          },
          {
            "@type": "Question",
            "name": "Can I run the platform offline?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Because all modules are compiled as static HTML, CSS, and JS code segments, once your browser caches the assets, you can run all formatters, builders, and math calculators fully offline without any active network connection."
            }
          },
          {
            "@type": "Question",
            "name": "How is AllSetTools funded if it is entirely free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We maintain AllSetTools through minimal, privacy-compliant developer sponsorships and user donations. This pays for our CDN bandwidth and hosting infrastructure while keeping the platform entirely free of trackers, cookie walls, or annoying full-screen ads."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem' }}>
      {/* JSON-LD Schema Markup Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'About Us' }]} />

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.5rem', border: 'none' }}>
          About AllSetTools
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-fg-muted)' }}>
          A secure, high-performance, and completely free workspace for developers and creators.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.7', color: 'var(--color-fg-muted)' }}>
        
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--color-fg)', border: 'none', padding: 0 }}>Our Mission</h2>
          <p>
            Online utilities shouldn&apos;t require you to compromise your data privacy or navigate cluttered interfaces with intrusive ads. AllSetTools was built to provide developers, designers, and business operators with a unified, high-fidelity monochrome workspace containing all their daily formatters, encoders, calculators, and builders in one place.
          </p>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--color-fg)', border: 'none', padding: 0 }}>The Client-Side Advantage</h2>
          <p>
            Unlike traditional online formatters or image compressors that upload your files and strings to remote database nodes, **AllSetTools operates 100% locally in your browser**. 
          </p>
          <p>
            When you paste an API config payload, a private JWT key, or compress a photo, the execution happens on your machine&apos;s CPU using client-side JavaScript, HTML5 Canvas layers, and Web Cryptography APIs. Your sensitive payloads never cross the network.
          </p>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--color-fg)', border: 'none', padding: 0 }}>Core Architecture</h2>
          <ul>
            <li style={{ marginBottom: '0.5rem', listStyleType: 'square', marginLeft: '1rem' }}>
              <strong>Speed</strong>: By removing server-side routing lags, database requests, and cold starts, actions compile in microseconds.
            </li>
            <li style={{ marginBottom: '0.5rem', listStyleType: 'square', marginLeft: '1rem' }}>
              <strong>Privacy</strong>: Zero network uploads, zero session cookies tracking your input strings, and no registration walls.
            </li>
            <li style={{ marginBottom: '0.5rem', listStyleType: 'square', marginLeft: '1rem' }}>
              <strong>Offline Capabilities</strong>: Once cached, AllSetTools formatters and converters run flawlessly without active internet access.
            </li>
          </ul>
        </section>

        {/* FAQs Collapsible Accordion */}
        <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem', marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: 'var(--color-fg)', border: 'none', padding: 0 }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>What is the core mission of AllSetTools?</span>
                <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </summary>
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
                Our mission is to provide developers, designers, and web operators with a secure, high-performance, and completely free utility suite. We believe online formatters, hash calculators, and encoders should never compromise user data privacy or restrict functions behind paywalls or registration forms.
              </p>
            </details>

            <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>How does client-side execution protect my data?</span>
                <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </summary>
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
                Unlike standard utilities that upload content to remote SQL databases, all calculations on AllSetTools run locally in your browser sandbox using JavaScript. This guarantees that your sensitive API tokens, raw passwords, or binary images never cross the network or get logged on our server logs.
              </p>
            </details>

            <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Can I run the platform offline?</span>
                <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </summary>
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
                Yes! Because all modules are compiled as static HTML, CSS, and JS code segments, once your browser caches the assets, you can run all formatters, builders, and math calculators fully offline without any active network connection.
              </p>
            </details>

            <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
              <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>How is AllSetTools funded if it is entirely free?</span>
                <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </summary>
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
                We maintain AllSetTools through minimal, privacy-compliant developer sponsorships and user donations. This pays for our CDN bandwidth and hosting infrastructure while keeping the platform entirely free of trackers, cookie walls, or annoying full-screen ads.
              </p>
            </details>
          </div>
        </section>

        <div className="card" style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--color-bg-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Have suggestions or feedback?</h3>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>We continuously deploy optimization updates and release new tool sets based on user requests.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
            <Link href="/feedback" className="btn btn-secondary">Feedback Portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
