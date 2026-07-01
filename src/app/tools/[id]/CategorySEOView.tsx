// src/app/tools/[id]/CategorySEOView.tsx
import React from 'react';
import Link from 'next/link';
import { CATEGORIES, TOOLS, Category } from '@/lib/registry';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Icon } from '@/components/Icons';

interface CategorySEOViewProps {
  category: Category;
}

export default function CategorySEOView({ category }: CategorySEOViewProps) {
  const categoryTools = TOOLS.filter(t => t.category === category.id);

  // Programmatic FAQs based on category ID
  const categoryFaqs: Record<string, { q: string, a: string }[]> = {
    text: [
      { q: "How do text tools process my documents?", a: "All parsing, case converting, sorting, and deduplication run inside your browser. No letters or character strings are uploaded to server nodes." },
      { q: "Can I use the Markdown editor offline?", a: "Yes, the HTML preview parsing executes locally in Javascript, meaning you can write and compile layouts without internet access." }
    ],
    dev: [
      { q: "Is pasting JSON codes here secure?", a: "Yes. Our JSON tools do not send network payloads. The formatting, validation, and tree-node parsing run entirely in client-side script contexts." },
      { q: "What library parses the JWT decryptions?", a: "We decode JWT payloads locally using built-in Base64 URL decoding, ensuring no credentials leak." }
    ],
    image: [
      { q: "Are my photos uploaded during compression?", a: "No. The compressor, cropping overlay, and format converters draw content directly onto local HTML5 <canvas> nodes to process pixels offline." },
      { q: "Is barcode generation done via external APIs?", a: "No, Barcode Code39 and QR codes are compiled entirely offline in the browser and exported as scalable inline SVGs." }
    ],
    ai: [
      { q: "How do I secure my AI API credentials?", a: "Your API keys are stored only in your local browser storage. Requests are made directly from your client IP to OpenAI/Gemini servers without proxy servers." }
    ],
    seo: [
      { q: "Do the density analyzers crawler track my site?", a: "No, they read the raw HTML code you provide and map elements in real time. We make no requests to your live pages." }
    ],
    business: [
      { q: "Is printable invoice creation safe?", a: "Yes, your client rosters, item descriptions, and banking numbers are stored solely in your current browser memory." }
    ],
    utility: [
      { q: "Are password strength calculations reliable?", a: "Yes, we evaluate password entropy metrics client-side using length and character varieties, with no server lookup logs." }
    ]
  };

  const currentFaqs = categoryFaqs[category.id] || [
    { q: "Are these tools free to use?", a: "Yes, all tools are completely free, with no usage limits, no paywalls, and no registration requirements." }
  ];

  // Programmatic SEO JSON-LD schema markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${category.name} Tools Catalogue`,
    "description": category.description,
    "url": `https://allsettools.dev/tools/${category.id}`,
    "numberOfItems": categoryTools.length,
    "itemListElement": categoryTools.map((t, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": t.name,
      "url": `https://allsettools.dev/tools/${t.id}`
    }))
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem', paddingBottom: '4rem' }}>
      
      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb items={[
        { label: 'Home', url: '/' },
        { label: 'Tools Directory', url: '/tools' },
        { label: category.name }
      ]} />

      {/* Header Banner */}
      <section style={{
        padding: '3rem 0 2.5rem 0',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '3rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.25rem' }}>
          <div className="icon-wrapper" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)' }}>
            <Icon name={category.icon} style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em', border: 'none', padding: 0, margin: 0, lineHeight: 1.1 }}>
              {category.name}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', margin: '4px 0 0 0', fontWeight: 500 }}>
              Free All-In-One Programmatic Toolsets
            </p>
          </div>
        </div>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-fg-muted)', maxWidth: '700px', lineHeight: '1.6' }}>
          {category.description} Access secure, offline-ready Utilities running directly inside your browser. No limits, no data leakage.
        </p>
      </section>

      <div className="tool-container">
        
        {/* Tools Listings */}
        <div>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', border: 'none', padding: 0 }}>Available {category.name} ({categoryTools.length})</h2>
          
          <div className="grid-cols-2" style={{ gap: '1.25rem' }}>
            {categoryTools.map(tool => (
              <Link href={`/tools/${tool.id}`} key={tool.id} className="card card-hover" style={{ padding: '1.5rem', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <Icon name={tool.icon} className="tool-card-icon" style={{ width: '18px', height: '18px' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{tool.name}</h3>
                  </div>
                  <p style={{ fontSize: '0.8125rem', lineHeight: '1.5', margin: 0, color: 'var(--color-fg-muted)' }}>{tool.description}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all var(--transition-fast)'
                  }} className="launch-link">
                    Launch Tool ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Programmatic FAQ markup section */}
          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', border: 'none', padding: 0 }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentFaqs.map((faq, idx) => (
                <div key={idx} className="card" style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-fg)' }}>Q: {faq.q}</h4>
                  <p style={{ fontSize: '0.8125rem', lineHeight: '1.5', margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar categories index navigation */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-fg)', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              Categories List
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CATEGORIES.map(c => {
                const isActive = c.id === category.id;
                return (
                  <Link
                    key={c.id}
                    href={`/tools/${c.id}`}
                    className={`sidebar-nav-item${isActive ? ' active' : ''}`}
                  >
                    <Icon name={c.icon} style={{ width: '14px', height: '14px' }} />
                    <span>{c.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--color-bg-subtle)', borderStyle: 'dashed' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>100% Privacy Sealed</h4>
            <p style={{ fontSize: '0.75rem', lineHeight: '1.5', margin: 0 }}>
              All actions are processed client-side. We never store inputs, payloads, keys, or metadata logs on external databases.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
