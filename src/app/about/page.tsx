// src/app/about/page.tsx
import React from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | AllSetTools',
  description: 'Learn more about AllSetTools, the free all-in-one client-side developer utility platform. Built for privacy, simplicity, and speed.',
};

export default function AboutPage() {
  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem' }}>
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

        <div className="card" style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--color-bg-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1rem'
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
