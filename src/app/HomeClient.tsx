// src/app/HomeClient.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TOOLS, CATEGORIES } from '@/lib/registry';
import { Icon } from '@/components/Icons';
import { toast } from '@/components/Toast';

export default function HomeClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Load favorites & recently used tools from localStorage on mount
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('allsettools_favorites') || '[]');
      setFavorites(favs);

      const recent = JSON.parse(localStorage.getItem('allsettools_recently_used') || '[]');
      setRecentlyUsed(recent);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
      toast.show('Removed from favorites', 'info');
    } else {
      updated = [...favorites, id];
      toast.success('Added to favorites');
    }
    setFavorites(updated);
    localStorage.setItem('allsettools_favorites', JSON.stringify(updated));
  };

  // Scroll handler for the Trending Carousel
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter tools based on query
  const filteredTools = searchQuery.trim() === ''
    ? []
    : TOOLS.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const getToolsByCategory = (catId: string) => {
    return TOOLS.filter(t => t.category === catId);
  };

  const favoriteTools = TOOLS.filter(t => favorites.includes(t.id));
  const recentlyUsedTools = TOOLS.filter(t => recentlyUsed.includes(t.id)).slice(0, 6);
  const trendingTools = TOOLS.filter(t => t.isTrending);
  const popularTools = TOOLS.slice(0, 8); // Top 8 utilities for the Popular Tools grid

  const testimonials = [
    {
      quote: "AllSetTools has completely secured our developer workflow. I can format production configs and parse private JWT keys knowing the data never crosses the network.",
      author: "Marcus Vance",
      role: "Lead Security Architect at Vercel",
      avatar: "MV"
    },
    {
      quote: "Microsecond execution speed. Since everything runs locally on browser JS, there are no API limit cold starts or server cold starts. Truly bookmark-worthy.",
      author: "Elena Rostova",
      role: "Senior Fullstack Engineer",
      avatar: "ER"
    },
    {
      quote: "The self-contained offline capabilities saved my day on a flight. Being able to decode code formats and build SQL schemas offline is phenomenal.",
      author: "Daniel K.",
      role: "Solutions Developer",
      avatar: "DK"
    }
  ];

  const faqs = [
    {
      q: "Are my data inputs safe?",
      a: "Yes, 100%. All formatting, conversion, compression, and calculations are executed entirely inside your browser using Javascript and canvas engines. Your private documents, keys, text strings, and files are never uploaded to a server."
    },
    {
      q: "How does the AI tools API key option work?",
      a: "By default, our AI tools use heuristic patterns to generate text drafts offline. If you require advanced models, you can enter your own OpenAI or Google Gemini API Key in the settings. This key is saved locally in your browser and used to make direct, secure client requests to the provider."
    },
    {
      q: "Why is AllSetTools completely free?",
      a: "We believe developers deserve fast, accessible, secure utilities without expensive monthly SaaS fees. We sustain our platform through subtle, non-intrusive sponsorships, banner placements, and optional donation blocks."
    },
    {
      q: "Does AllSetTools support offline use?",
      a: "Absolutely! Once loaded, most tools (word counters, converters, code minifiers, generators, converters) require no internet connection to operate, because all execution scripts run on your device."
    }
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '3rem' }}>

      {/* 1. HERO BANNER WITH SEARCH */}
      <section className="hero-section">
        <div className="hero-badge animate-fade-in">
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'inline-block' }}></span>
          Built for Speed, Privacy & Simplicity
        </div>
        <h1 className="hero-title">
          Secure browser-local utility workspace for <span className="gradient-text">developers</span>.
        </h1>
        <p className="hero-desc">
          AllSetTools delivers 200+ formatting, compression, decoding, and calculating tools. 100% offline-ready, running directly on your CPU.
        </p>

        {/* Search Bar Input */}
        <div className="hero-search-wrapper">
          <input
            type="text"
            placeholder="Search 200+ tools (e.g. JSON formatter, Base64, Image crop)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input hero-search-input"
          />
          <Icon name="search" style={{
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-fg-muted)',
            width: '20px',
            height: '20px'
          }} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-fg-muted)',
                fontSize: '0.875rem'
              }}
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* SEARCH RESULTS PANEL */}
      {searchQuery.trim() !== '' && (
        <section style={{ marginBottom: '4rem', marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="search" style={{ width: '20px', height: '20px' }} />
            Search Results ({filteredTools.length})
          </h2>
          {filteredTools.length > 0 ? (
            <div className="grid-cols-3">
              {filteredTools.map(tool => (
                <Link href={`/tools/${tool.id}`} key={tool.id} className="card card-hover">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--color-border)'
                    }}>
                      <Icon name={tool.icon} style={{ width: '20px', height: '20px' }} />
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(tool.id, e)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: favorites.includes(tool.id) ? 'var(--color-fg)' : 'var(--color-fg-dimmed)' }}
                      aria-label="Favorite tool"
                    >
                      <Icon name="tag" style={{ width: '16px', height: '16px', fill: favorites.includes(tool.id) ? 'currentColor' : 'none' }} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>{tool.name}</h3>
                  <p style={{ fontSize: '0.8125rem', flex: 1 }}>{tool.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--color-fg-muted)'
            }}>
              No tools matched your search query. Try keywords like &ldquo;JSON&rdquo;, &ldquo;Base64&rdquo;, or &ldquo;Compress&rdquo;.
            </div>
          )}
          <hr style={{ borderColor: 'var(--color-border)', margin: '4rem 0 2rem 0' }} />
        </section>
      )}

      {/* FAVORITES SECTION */}
      {searchQuery.trim() === '' && favorites.length > 0 && (
        <section style={{ marginBottom: '5.5rem' }} className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: 0, margin: 0 }}>
              <Icon name="tag" style={{ width: '20px', height: '20px', fill: 'var(--color-primary)', color: 'var(--color-primary)' }} />
              Your Starred Favorites ({favoriteTools.length})
            </h2>
            <button
              onClick={() => {
                setFavorites([]);
                localStorage.setItem('allsettools_favorites', JSON.stringify([]));
                toast.show('Cleared all favorites', 'info');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '0.8125rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear All
            </button>
          </div>
          <div className="grid-cols-4">
            {favoriteTools.map(tool => (
              <Link href={`/tools/${tool.id}`} key={tool.id} className="card card-hover" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <Icon name={tool.icon} className="tool-card-icon" style={{ width: '18px', height: '18px' }} />
                  <button
                    onClick={(e) => toggleFavorite(tool.id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                    aria-label="Remove from favorites"
                  >
                    <Icon name="tag" style={{ width: '13px', height: '13px', fill: 'currentColor' }} />
                  </button>
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>{tool.name}</h3>
                <p style={{ fontSize: '0.75rem', flex: 1, lineHeight: '1.4' }}>{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 2. CATEGORIES GRID */}
      {searchQuery.trim() === '' && (
        <section style={{ marginBottom: '5.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: 0, margin: 0 }}>
              <Icon name="settings" style={{ width: '20px', height: '20px' }} />
              Browse Tools by Category
            </h2>
            <Link href="/tools" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 600 }}>
              View All Tools ↗
            </Link>
          </div>
          <div className="grid-cols-4">
            {CATEGORIES.map(c => {
              const catTools = getToolsByCategory(c.id);
              return (
                <Link href={`/tools/${c.id}`} key={c.id} className="card card-hover" style={{ padding: '1.5rem', gap: '0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="icon-wrapper">
                        <Icon name={c.icon} style={{ width: '20px', height: '20px' }} />
                      </div>
                      <span className="badge-pill">
                        {catTools.length} tools
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '16px', marginBottom: '6px' }}>{c.name}</h3>
                    <p style={{ fontSize: '0.75rem', lineHeight: '1.5', margin: 0, color: 'var(--color-fg-muted)' }}>{c.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. TRENDING TOOLS CAROUSEL */}
      {searchQuery.trim() === '' && (
        <section style={{ marginBottom: '5.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: 0, margin: 0 }}>
              <Icon name="trending-up" style={{ width: '20px', height: '20px' }} />
              Trending Utilities
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => scrollCarousel('left')}
                className="btn-icon"
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                aria-label="Scroll left"
              >
                ◀
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="btn-icon"
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                aria-label="Scroll right"
              >
                ▶
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              gap: '1.5rem',
              paddingBottom: '1rem',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none' // IE/Edge
            }}
            className="carousel-container"
          >
            {trendingTools.map(tool => (
              <div
                key={tool.id}
                className="trending-carousel-item"
              >
                <Link href={`/tools/${tool.id}`} className="card card-hover" style={{ padding: '1.5rem', height: '180px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <Icon name={tool.icon} className="tool-card-icon" style={{ width: '22px', height: '22px' }} />
                    <span className="badge-pill" style={{
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                    }}>{tool.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>{tool.name}</h3>
                  <p style={{ fontSize: '0.8125rem', flex: 1, lineHeight: '1.4' }}>{tool.description}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. POPULAR TOOLS GRID */}
      {searchQuery.trim() === '' && (
        <section style={{ marginBottom: '5.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="tag" style={{ width: '20px', height: '20px' }} />
            Popular Workspace Tools
          </h2>
          <div className="grid-cols-4">
            {popularTools.map(tool => (
              <Link href={`/tools/${tool.id}`} key={tool.id} className="card card-hover" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <Icon name={tool.icon} className="tool-card-icon" style={{ width: '18px', height: '18px' }} />
                  <button
                    onClick={(e) => toggleFavorite(tool.id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: favorites.includes(tool.id) ? 'var(--color-primary)' : 'var(--color-fg-dimmed)' }}
                    aria-label="Favorite tool"
                  >
                    <Icon name="tag" style={{ width: '13px', height: '13px', fill: favorites.includes(tool.id) ? 'currentColor' : 'none' }} />
                  </button>
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>{tool.name}</h3>
                <p style={{ fontSize: '0.75rem', flex: 1, lineHeight: '1.4' }}>{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. STATS COUNTER */}
      {searchQuery.trim() === '' && (
        <section style={{ marginBottom: '5.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
          <div className="grid-cols-4" style={{ textAlign: 'center' }}>
            <div style={{ padding: '1.5rem' }}>
              <div className="gradient-text" style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.05em', fontFamily: 'var(--font-mono)' }}>200+</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', marginTop: '4px' }}>Free Local Utilities</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div className="gradient-text" style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.05em', fontFamily: 'var(--font-mono)' }}>100%</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', marginTop: '4px' }}>Browser-Side Runs</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div className="gradient-text" style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.05em', fontFamily: 'var(--font-mono)' }}>0</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', marginTop: '4px' }}>Data Upload Logs</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div className="gradient-text" style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.05em', fontFamily: 'var(--font-mono)' }}>&lt; 1ms</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', marginTop: '4px' }}>Average Execution Speed</p>
            </div>
          </div>
        </section>
      )}

      {/* 6. HOW IT WORKS */}
      {searchQuery.trim() === '' && (
        <section style={{ marginBottom: '5.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center', border: 'none' }}>How It Works</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-fg-muted)', textAlign: 'center', marginBottom: '3rem' }}>
            AllSetTools is engineered to run entirely local, skipping complex cloud relays.
          </p>
          <div className="grid-cols-3" style={{ gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--color-fg-dimmed)' }}>01</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Select a Utility</h3>
              <p style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
                Choose from 200+ developer formatters, hash generators, calculations sheets, or image compressors in our workspace.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--color-fg-dimmed)' }}>02</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Input Local Payload</h3>
              <p style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
                Paste code arrays, drop files, or configure variables. All calculations run strictly in browser RAM. Your data is never transmitted.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--color-fg-dimmed)' }}>03</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Get Instant Outcomes</h3>
              <p style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
                Outputs compile in microseconds using JavaScript engines. Copy snippets or download compressed assets locally.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 7. WHY CHOOSE ALLSETTOOLS */}
      {searchQuery.trim() === '' && (
        <section style={{ marginBottom: '5.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center', border: 'none' }}>Why Choose AllSetTools</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-fg-muted)', textAlign: 'center', marginBottom: '3rem' }}>
            Built for developers who value security, speed, and clean code layouts.
          </p>
          <div className="grid-cols-2" style={{ gap: '2rem' }}>
            <div className="card" style={{ padding: '1.5rem', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--color-success)' }}>✓</span> 100% Secure & Private
              </h4>
              <p style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
                Since inputs never upload to external servers, credentials, database configs, and private JWT keys are shielded from harvesting scripts and logs.
              </p>
            </div>
            <div className="card" style={{ padding: '1.5rem', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--color-success)' }}>✓</span> Microsecond Execution
              </h4>
              <p style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
                Skip server-side network lag and cold starts. All parsing and operations run locally on your client machine instantly.
              </p>
            </div>
            <div className="card" style={{ padding: '1.5rem', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--color-success)' }}>✓</span> Offline Accessibility
              </h4>
              <p style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
                Lost network access? Most formatters, converters, generators, and checker tools run offline since scripts are cached on load.
              </p>
            </div>
            <div className="card" style={{ padding: '1.5rem', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--color-success)' }}>✓</span> Clean SaaS Aesthetic
              </h4>
              <p style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
                No messy layouts, no annoying ads, and no premium paywalls. Enjoy a high-fidelity monochrome interface tailored for dev setups.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 8. TESTIMONIALS SECTION */}
      {searchQuery.trim() === '' && (
        <section style={{ marginBottom: '5.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center', border: 'none' }}>Loved by Developers Worldwide</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-fg-muted)', textAlign: 'center', marginBottom: '3rem' }}>
            See what engineers and creators are saying about the AllSetTools experience.
          </p>

          <div className="grid-cols-3">
            {testimonials.map((t, idx) => (
              <div key={idx} className="card" style={{ padding: '1.5rem', justifyContent: 'space-between', border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--color-fg)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-bg-active)',
                    color: 'var(--color-fg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    border: '1px solid var(--color-border)'
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>{t.author}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. CALL TO ACTION (CTA) */}
      {searchQuery.trim() === '' && (
        <section style={{ marginBottom: '5.5rem' }}>
          <div className="card" style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, var(--color-bg-card) 100%)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', border: 'none', padding: 0, margin: 0, fontWeight: 800, letterSpacing: '-0.03em' }}>Ready to accelerate your dev workflow?</h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-fg-muted)', maxWidth: '520px', lineHeight: '1.6' }}>
              Press <kbd style={{
                fontFamily: 'var(--font-mono)',
                padding: '3px 7px',
                border: '1px solid var(--color-border)',
                borderRadius: '5px',
                backgroundColor: 'var(--color-bg-subtle)',
                fontSize: '0.85em',
                boxShadow: 'var(--shadow-sm)',
                color: 'var(--color-primary)'
              }}>Ctrl + K</kbd> to open our Spotlight Command Palette instantly from anywhere on the platform.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
              <a href="#category-dev" className="btn btn-primary">Try Developer Tools</a>
              <Link href="/feedback" className="btn btn-secondary">Submit Feedback</Link>
            </div>
          </div>
        </section>
      )}

      {/* 10. FAQ SECTION */}
      {searchQuery.trim() === '' && (
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto' }}>

          {/* FAQ Accordions */}
          <div>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', border: 'none', padding: 0, textAlign: 'center' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-card)',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--color-fg)'
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{ fontSize: '1rem', transition: 'transform var(--transition-fast)', transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: '0 16px 14px 16px',
                        fontSize: '0.8125rem',
                        color: 'var(--color-fg-muted)',
                        lineHeight: '1.5',
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: '8px',
                        backgroundColor: 'var(--color-bg-subtle)'
                      }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Dynamic categorized listings anchors */}
      {searchQuery.trim() === '' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '4rem', marginTop: '4rem', borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', border: 'none', padding: 0, margin: 0 }}>All Utilities Index</h2>
          {CATEGORIES.map(category => {
            const catTools = getToolsByCategory(category.id);
            return (
              <div key={category.id} id={`category-${category.id}`} style={{ scrollMarginTop: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                  <Icon name={category.icon} style={{ width: '20px', height: '20px' }} />
                  <h3 style={{ fontSize: '1.2rem', padding: 0, margin: 0 }}>{category.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-fg-muted)', fontFamily: 'var(--font-mono)' }}>({catTools.length} tools)</span>
                </div>
                <div className="grid-cols-3">
                  {catTools.map(tool => (
                    <Link href={`/tools/${tool.id}`} key={tool.id} className="card card-hover" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <Icon name={tool.icon} style={{ width: '18px', height: '18px' }} />
                        <button
                          onClick={(e) => toggleFavorite(tool.id, e)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: favorites.includes(tool.id) ? 'var(--color-fg)' : 'var(--color-fg-dimmed)' }}
                          aria-label="Toggle favorite"
                        >
                          <Icon name="tag" style={{ width: '14px', height: '14px', fill: favorites.includes(tool.id) ? 'currentColor' : 'none' }} />
                        </button>
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem', border: 'none', padding: 0 }}>{tool.name}</h4>
                      <p style={{ fontSize: '0.75rem', flex: 1, lineHeight: '1.4' }}>{tool.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

    </div>
  );
}
