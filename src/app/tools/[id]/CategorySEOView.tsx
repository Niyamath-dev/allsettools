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
      { q: "Can I use the Markdown editor offline?", a: "Yes, the HTML preview parsing executes locally in Javascript, meaning you can write and compile layouts without internet access." },
      { q: "Is there a character limit for text counting?", a: "There is no server-imposed limit. Our counters can process files as large as your device memory permits." },
      { q: "Do formatting tools store diff comparisons?", a: "No, text comparisons are computed entirely in-memory and disappear once you refresh the tab." }
    ],
    dev: [
      { q: "Is pasting JSON codes here secure?", a: "Yes. Our JSON tools do not send network payloads. The formatting, validation, and tree-node parsing run entirely in client-side script contexts." },
      { q: "What library parses the JWT decryptions?", a: "We decode JWT payloads locally using built-in Base64 URL decoding, ensuring no credentials leak." },
      { q: "Can the XML formatter handle invalid tags?", a: "The formatter attempts to repair basic open/close tag nesting errors client-side and points out severe syntax errors." },
      { q: "Do the HTML/CSS minifiers compress code effectively?", a: "Yes, they strip comments, remove layout spacing, and compress variable blocks locally using highly optimized regular expression parsers." }
    ],
    image: [
      { q: "Are my photos uploaded during compression?", a: "No. The compressor, cropping overlay, and format converters draw content directly onto local HTML5 <canvas> nodes to process pixels offline." },
      { q: "Is barcode generation done via external APIs?", a: "No, Barcode Code39 and QR codes are compiled entirely offline in the browser and exported as scalable inline SVGs." },
      { q: "What image export formats are supported?", a: "You can convert images to WebP, PNG, JPEG, and BMP formats, which are compiled locally via browser canvas rendering APIs." },
      { q: "Is there a file size limit on image uploads?", a: "The limits are defined by your local device's memory performance; we recommend processing images under 50MB for smooth operations." }
    ],
    ai: [
      { q: "How do I secure my AI API credentials?", a: "Your API keys are stored only in your local browser storage. Requests are made directly from your client IP to OpenAI/Gemini servers without proxy servers." },
      { q: "What happens if I do not provide an API key?", a: "Our AI tools fallback to local heuristic models and offline dictionaries to help you draft tags and content skeletons." },
      { q: "Do the AI content generators log the queries?", a: "No. Because calls bypass AllSetTools servers entirely, we have no access to your prompts or generated content." },
      { q: "Can I inspect the direct AI calls?", a: "Yes. You can open your browser's Network Inspector tab to verify that calls connect directly to official API servers like api.openai.com." }
    ],
    seo: [
      { q: "Do the density analyzers crawler track my site?", a: "No, they read the raw HTML code you provide and map elements in real time. We make no requests to your live pages." },
      { q: "How is keyword density calculated?", a: "The system strips HTML tags, filters out stop-words, and calculates the exact frequency percentage of each word locally." },
      { q: "Can I generate a Sitemap XML file here?", a: "Yes. You can input your URL structure and priority tags to compile a valid XML schema structure that is downloadable directly." },
      { q: "Are the Meta Tag generators SEO compliant?", a: "Yes, they adhere strictly to schema guidelines, Open Graph specifications, and Google search card constraints." }
    ],
    business: [
      { q: "Is printable invoice creation safe?", a: "Yes, your client rosters, item descriptions, and banking numbers are stored solely in your current browser memory." },
      { q: "Can I download or export my sheets?", a: "Yes, invoices and calculation tables are exportable as standard CSV files or print-optimized PDF formats." },
      { q: "Are these calculators updated for tax changes?", a: "The calculation rules use standard static tax formulas. We encourage double-checking values for critical accounting transactions." },
      { q: "Is database backup possible for invoice logs?", a: "Logs are backed up via LocalStorage. You can clear or wipe them by resetting your browser site data cache." }
    ],
    utility: [
      { q: "Are password strength calculations reliable?", a: "Yes, we evaluate password entropy metrics client-side using length and character varieties, with no server lookup logs." },
      { q: "How is the random password generator secure?", a: "It uses the browser's native cryptographically secure pseudo-random number generator (CSPRNG), ensuring high entropy values." },
      { q: "What algorithms are supported in text hash calculations?", a: "We support MD5, SHA-1, SHA-256, and SHA-512, which are compiled client-side using JavaScript crypto libraries." },
      { q: "Can I use the unit converters without internet?", a: "Yes. The unit conversion calculations are purely mathematical formulas and execute instantly offline." }
    ],
    misc: [
      { q: "What kinds of tools are inside the Miscellaneous section?", a: "The section houses calendar builders, holiday planners, random choose spinners, and simple list randomizers." },
      { q: "Do calendar planners sync with external apps?", a: "No, all schedules are stored locally. You can print the calendar layouts or save them to your browser storage." },
      { q: "How is the random list selector determined?", a: "We use local pseudo-random generators to shuffle and draw items, ensuring fair random draws offline." },
      { q: "Are there daily usage limits on these planners?", a: "No, all calculators and spinners are completely free with no usage limits." }
    ]
  };

  const currentFaqs = categoryFaqs[category.id] || [
    { q: "Are these tools free to use?", a: "Yes, all tools are completely free, with no usage limits, no paywalls, and no registration requirements." },
    { q: "Why are calculations done client-side?", a: "Doing operations client-side provides microsecond-fast speeds, removes server latency, and guarantees absolute privacy for your data." },
    { q: "Does AllSetTools track my activity?", a: "No. We do not inspect your inputs, files, or derived outputs. We only track generic page count metrics for sizing optimizations." },
    { q: "Can I contribute a new tool request?", a: "Yes, we welcome developer proposals! You can submit details through our feedback portal or inspect our contact details." }
  ];

  // Programmatic SEO JSON-LD schema markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${category.name} Tools Catalogue`,
    "description": category.description,
    "url": `https://allsettools.com/tools/${category.id}`,
    "numberOfItems": categoryTools.length,
    "itemListElement": categoryTools.map((t, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": t.name,
      "url": `https://allsettools.com/tools/${t.id}`
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
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', border: 'none', padding: 0 }}>FAQs</h2>
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
