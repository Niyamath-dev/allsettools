// src/app/tools/page.tsx
import React from 'react';
import Link from 'next/link';
import { CATEGORIES, TOOLS } from '@/lib/registry';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Icon } from '@/components/Icons';

export const metadata = {
  title: 'Tools Directories',
  description: 'Browse the full catalog of free developer tools, text converters, image compressors, SEO checklists, and financial calculators.',
};

export default function CategoriesIndexPage() {
  const getToolsByCategory = (catId: string) => {
    return TOOLS.filter(t => t.category === catId);
  };

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
        "@id": "https://allsettools.com/tools#webpage",
        "url": "https://allsettools.com/tools",
        "name": "Tools Directories",
        "description": "Browse the full catalog of free developer tools, text converters, image compressors, SEO checklists, and financial calculators.",
        "isPartOf": {
          "@id": "https://allsettools.com/#website"
        },
        "breadcrumb": {
          "@id": "https://allsettools.com/tools#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://allsettools.com/tools#breadcrumb",
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
            "name": "Tools Directories",
            "item": "https://allsettools.com/tools"
          }
        ]
      }
    ]
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem', paddingBottom: '5rem' }}>
      
      {/* JSON-LD Schema Markup Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'All Tools' }]} />

      <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.5rem', border: 'none' }}>
          Tools Directories
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-fg-muted)', maxWidth: '600px' }}>
          Explore our collection of 200+ offline-ready client-side utilities organized by category.
        </p>
      </div>

      <div className="grid-cols-2" style={{ gap: '2rem' }}>
        {CATEGORIES.map(category => {
          const categoryTools = getToolsByCategory(category.id);
          return (
            <div key={category.id} className="card" style={{ padding: '2rem', justifyContent: 'space-between', border: '1px solid var(--color-border)' }}>
              <div>
                {/* Category Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                      <Icon name={category.icon} style={{ width: '20px', height: '20px' }} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, border: 'none', padding: 0, margin: 0 }}>
                      {category.name}
                    </h2>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-fg-muted)' }}>
                    {categoryTools.length} utilities
                  </span>
                </div>

                <p style={{ fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.5rem', color: 'var(--color-fg-muted)' }}>
                  {category.description}
                </p>

                {/* Sublist of first 3 tools */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-fg-dimmed)', fontWeight: 700, letterSpacing: '0.05em' }}>
                    Popular Utilities:
                  </span>
                  {categoryTools.slice(0, 3).map(tool => (
                    <Link
                      href={`/tools/${tool.id}`}
                      key={tool.id}
                      className="category-tool-link"
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-fg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 6px',
                        borderRadius: 'var(--radius-xs)'
                      }}
                    >
                      <Icon name={tool.icon} style={{ width: '12px', height: '12px', opacity: 0.6 }} />
                      <span>{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                <Link href={`/tools/${category.id}`} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.8125rem' }}>
                  Explore All {category.name} ↗
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
