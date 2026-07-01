// src/app/donate/page.tsx
"use client";

import React, { useState } from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Icon } from '@/components/Icons';
import { toast } from '@/components/Toast';

export default function DonatePage() {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const cryptoWallets = [
    {
      name: 'Bitcoin (BTC)',
      address: 'bc1qxy2kg338g2t382f534ac3825345a96719vx',
      tag: 'BTC Network'
    },
    {
      name: 'Ethereum (ETH) / ERC-20 Tokens',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      tag: 'Ethereum Mainnet'
    },
    {
      name: 'USDC (Multi-chain)',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      tag: 'Polygon / Arbitrum / Optimism'
    }
  ];

  const handleCopy = (address: string, name: string) => {
    navigator.clipboard.writeText(address);
    setCopiedType(name);
    toast.success(`${name} address copied to clipboard!`);
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem', paddingBottom: '5rem' }}>
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Donate & Support' }]} />

      {/* Header */}
      <div style={{ marginBottom: '3rem', marginTop: '1.5rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--color-bg-subtle)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)',
          padding: '4px 14px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--color-fg-muted)',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1rem'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'inline-block' }}></span>
          Support Open Source & Privacy
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.75rem', border: 'none', padding: 0 }}>
          Keep AllSetTools 100% Free
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-fg-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          We design secure, browser-local utilities that protect your data. We do not run annoying popups or sell tracking cookies. Help us cover hosting, API operations, and active development.
        </p>
      </div>

      {/* Sponsor Channels Grid */}
      <div className="grid-cols-3" style={{ gap: '2rem', marginBottom: '4rem' }}>
        
        {/* Buy Me A Coffee */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--color-border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-hover)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffdd00'
              }}>
                <Icon name="rocket" style={{ width: '20px', height: '20px' }} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, border: 'none', padding: 0 }}>Buy Me a Coffee</h2>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: 'var(--color-fg-muted)', marginBottom: '1.5rem' }}>
              Send a quick, one-time micro-donation of $5, $10, or custom amounts to fuel developer coding sprints.
            </p>
          </div>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '0.875rem' }}
          >
            Donate $5 or More ↗
          </a>
        </div>

        {/* GitHub Sponsors */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--color-border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-hover)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-fg)'
              }}>
                <Icon name="terminal" style={{ width: '20px', height: '20px' }} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, border: 'none', padding: 0 }}>GitHub Sponsors</h2>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: 'var(--color-fg-muted)', marginBottom: '1.5rem' }}>
              Become an official project sponsor. Display your profile badge or corporate logo on our landing workspace page.
            </p>
          </div>
          <a
            href="https://github.com/sponsors"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '0.875rem' }}
          >
            Sponsor on GitHub ↗
          </a>
        </div>

        {/* Custom PayPal Checkout */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--color-border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-hover)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}>
                <Icon name="credit-card" style={{ width: '20px', height: '20px' }} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, border: 'none', padding: 0 }}>PayPal Checkout</h2>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: 'var(--color-fg-muted)', marginBottom: '1.5rem' }}>
              Prefer traditional checkout? Make secure payments using cards, balances, or banking options.
            </p>
          </div>
          <a
            href="https://paypal.me"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '0.875rem' }}
          >
            Donate via PayPal ↗
          </a>
        </div>

      </div>

      {/* Cryptocurrency Wallets section */}
      <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', border: 'none', padding: 0 }}>
          Cryptocurrency Support
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', marginBottom: '2rem' }}>
          We accept decentralized, secure contributions in digital assets. Click on any address block below to copy the raw payload instantly.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cryptoWallets.map((wallet) => {
            const isCopied = copiedType === wallet.name;
            return (
              <div
                key={wallet.name}
                onClick={() => handleCopy(wallet.address, wallet.name)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  userSelect: 'none'
                }}
                className="crypto-row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-fg)' }}>{wallet.name}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      color: 'var(--color-fg-muted)'
                    }}>{wallet.tag}</span>
                  </div>
                  <span style={{
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-fg-dimmed)',
                    wordBreak: 'break-all',
                    marginTop: '2px'
                  }}>{wallet.address}</span>
                </div>

                <button
                  className="btn btn-secondary"
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.75rem',
                    minWidth: '96px',
                    borderColor: isCopied ? 'var(--color-success)' : 'var(--color-border)',
                    color: isCopied ? 'var(--color-success)' : 'var(--color-fg)'
                  }}
                >
                  {isCopied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Info section */}
      <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center', border: 'none', padding: 0 }}>
          Where Does Your Funding Go?
        </h2>
        <div className="grid-cols-3" style={{ gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Hosting & CDN Costs</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
              We serve 130+ browser utilities worldwide. Your funds help pay our domain name renewals, static CDN caches, and server maintenance logs.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Advanced AI API Scaling</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
              Providing free fallback heuristic generation scripts and proxy servers requires token bandwidth. Sponsorship covers these relays.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>New Tool Engineering</h3>
            <p style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
              We consistently build and test advanced text utilities, image compressors, and developer formatters. Donations translate to direct coding hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
