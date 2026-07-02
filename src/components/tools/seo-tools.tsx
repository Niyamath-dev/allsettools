// src/components/tools/seo-tools.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { toast } from '@/components/Toast';

const copyToClipboard = (text: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard!');
};

// 1. Meta Tag Generator with Search Preview
export const MetaTagGenerator: React.FC = () => {
  const [title, setTitle] = useState('AllSetTools - Free All-In-One Online Web Tools Platform');
  const [desc, setDesc] = useState('Explore free client-side formatting, encoders, and optimization tools.');
  const [author, setAuthor] = useState('');
  const [robots, setRobots] = useState('index, follow');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const tags = [
      `<!-- Primary Meta Tags -->`,
      `<title>${title}</title>`,
      `<meta name="title" content="${title}">`,
      `<meta name="description" content="${desc}">`,
      author ? `<meta name="author" content="${author}">` : '',
      `<meta name="robots" content="${robots}">`
    ].filter(t => t !== '').join('\n');
    setOutput(tags);
  }, [title, desc, author, robots]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="label">Title Tag (Max 60 chars)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
            <span style={{ fontSize: '0.75rem', color: title.length > 60 ? 'var(--color-danger)' : 'var(--color-fg-muted)' }}>{title.length} / 60 characters</span>
          </div>
          <div>
            <label className="label">Meta Description (Max 160 chars)</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="input" style={{ height: '80px' }} />
            <span style={{ fontSize: '0.75rem', color: desc.length > 160 ? 'var(--color-danger)' : 'var(--color-fg-muted)' }}>{desc.length} / 160 characters</span>
          </div>
          <div className="grid-cols-2" style={{ gap: '8px' }}>
            <div>
              <label className="label">Author</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="input" placeholder="Optional" />
            </div>
            <div>
              <label className="label">Robots Directive</label>
              <select value={robots} onChange={(e) => setRobots(e.target.value)} className="input">
                <option value="index, follow">Index, Follow</option>
                <option value="noindex, nofollow">Noindex, Nofollow</option>
                <option value="index, nofollow">Index, Nofollow</option>
              </select>
            </div>
          </div>
        </div>

        {/* Google SERP Preview */}
        <div>
          <label className="label">Google Search Results Mockup</label>
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#0d0d0d', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.75rem', color: '#8e9196', display: 'block', marginBottom: '2px' }}>https://allsettools.com</span>
            <h4 style={{ fontSize: '1.25rem', color: '#8ab4f8', fontWeight: 'normal', margin: '0 0 4px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title || 'Please enter title'}</h4>
            <p style={{ fontSize: '0.875rem', color: '#bdc1c6', lineHeight: '1.4', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{desc || 'Please enter description'}</p>
          </div>
        </div>
      </div>

      <div>
        <label className="label">Generated HTML Code</label>
        <textarea readOnly value={output} className="input textarea" style={{ height: '140px', fontFamily: 'var(--font-mono)' }} />
        <button onClick={() => copyToClipboard(output)} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Copy Tags</button>
      </div>
    </div>
  );
};

// 2. Sitemap Generator
export const SitemapGenerator: React.FC = () => {
  const [domain, setDomain] = useState('https://allsettools.com');
  const [paths, setPaths] = useState('/\n/blog\n/admin\n/privacy');
  const [freq, setFreq] = useState('weekly');
  const [output, setOutput] = useState('');

  const generateSitemap = () => {
    const list = paths.split('\n').filter(p => p.trim() !== '');
    const date = new Date().toISOString().split('T')[0];

    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      list.map(p => {
        const fullUrl = domain.replace(/\/$/, '') + (p.startsWith('/') ? p : `/${p}`);
        return `  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${p === '/' ? '1.0' : '0.8'}</priority>\n  </url>`;
      }).join('\n'),
      `</urlset>`
    ].join('\n');

    setOutput(xml);
    toast.success('XML Sitemap generated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Site Domain URL</label>
          <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Change Frequency</label>
          <select value={freq} onChange={(e) => setFreq(e.target.value)} className="input">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Paths (one per line)</label>
        <textarea value={paths} onChange={(e) => setPaths(e.target.value)} className="input" style={{ height: '100px' }} />
      </div>
      <button onClick={generateSitemap} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Generate Sitemap</button>
      
      {output && (
        <div>
          <label className="label">Generated XML Sitemap</label>
          <textarea readOnly value={output} className="input textarea" style={{ height: '180px', fontFamily: 'var(--font-mono)' }} />
          <button onClick={() => copyToClipboard(output)} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Copy XML</button>
        </div>
      )}
    </div>
  );
};

// 3. Robots.txt Generator
export const RobotsTxtGenerator: React.FC = () => {
  const [sitemap, setSitemap] = useState('https://allsettools.com/sitemap.xml');
  const [userAgent, setUserAgent] = useState('*');
  const [disallow, setDisallow] = useState('/admin\n/api');
  const [output, setOutput] = useState('');

  const generateRobots = () => {
    const list = disallow.split('\n').filter(p => p.trim() !== '');
    const lines = [
      `User-agent: ${userAgent}`,
      list.map(p => `Disallow: ${p}`).join('\n'),
      `Allow: /`,
      sitemap ? `\nSitemap: ${sitemap}` : ''
    ].filter(l => l !== '').join('\n');
    setOutput(lines);
    toast.success('Robots.txt generated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">User-Agent</label>
          <input type="text" value={userAgent} onChange={(e) => setUserAgent(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Sitemap URL</label>
          <input type="text" value={sitemap} onChange={(e) => setSitemap(e.target.value)} className="input" />
        </div>
      </div>
      <div>
        <label className="label">Disallowed Paths (one per line)</label>
        <textarea value={disallow} onChange={(e) => setDisallow(e.target.value)} className="input" style={{ height: '80px' }} />
      </div>
      <button onClick={generateRobots} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Generate Robots.txt</button>

      {output && (
        <div>
          <label className="label">Robots.txt Output</label>
          <textarea readOnly value={output} className="input textarea" style={{ height: '140px', fontFamily: 'var(--font-mono)' }} />
          <button onClick={() => copyToClipboard(output)} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Copy Output</button>
        </div>
      )}
    </div>
  );
};

// 4. Keyword Density Checker
export const KeywordDensityChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [density, setDensity] = useState<{ word: string; count: number; percent: number }[]>([]);

  const checkDensity = () => {
    if (!text) return;
    const cleanText = text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ' ');
    const words = cleanText.split(/\s+/).filter(w => w.length > 2);
    
    // Stop words to clean density stats
    const stops = ['the', 'and', 'for', 'you', 'with', 'this', 'that', 'your', 'from', 'are', 'was', 'were'];
    const filtered = words.filter(w => !stops.includes(w));
    
    const freq: Record<string, number> = {};
    filtered.forEach(w => freq[w] = (freq[w] || 0) + 1);

    const total = filtered.length;
    const sorted = Object.keys(freq)
      .map(w => ({
        word: w,
        count: freq[w],
        percent: parseFloat(((freq[w] / total) * 100).toFixed(1))
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setDensity(sorted);
    toast.success('Density metrics computed!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Content Text Body</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="input textarea" placeholder="Paste copy to analyze keyword ratios..." />
      </div>
      <button onClick={checkDensity} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Analyze Density</button>

      {density.length > 0 && (
        <div>
          <label className="label">Keyword Density Rankings</label>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '8px 0' }}>Keyword</th>
                <th style={{ padding: '8px 0' }}>Count</th>
                <th style={{ padding: '8px 0' }}>Density</th>
              </tr>
            </thead>
            <tbody>
              {density.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '8px 0', fontFamily: 'var(--font-mono)' }}>{item.word}</td>
                  <td style={{ padding: '8px 0' }}>{item.count} times</td>
                  <td style={{ padding: '8px 0' }}>{item.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 5. Open Graph Generator
export const OpenGraphGenerator: React.FC = () => {
  const [title, setTitle] = useState('AllSetTools Workspace');
  const [type, setType] = useState('website');
  const [url, setUrl] = useState('https://allsettools.com');
  const [img, setImg] = useState('https://allsettools.com/og-cover.png');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const og = [
      `<!-- Open Graph Meta Tags -->`,
      `<meta property="og:title" content="${title}">`,
      `<meta property="og:type" content="${type}">`,
      `<meta property="og:url" content="${url}">`,
      `<meta property="og:image" content="${img}">`,
      `<!-- Twitter Cards -->`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${title}">`
    ].join('\n');
    setOutput(og);
  }, [title, type, url, img]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">OG Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input">
            <option value="website">Website</option>
            <option value="article">Article</option>
          </select>
        </div>
      </div>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Canonical URL</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Feature Image URL</label>
          <input type="text" value={img} onChange={(e) => setImg(e.target.value)} className="input" />
        </div>
      </div>

      <div>
        <label className="label">Generated OG Tags</label>
        <textarea readOnly value={output} className="input textarea" style={{ height: '140px', fontFamily: 'var(--font-mono)' }} />
        <button onClick={() => copyToClipboard(output)} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Copy OG Code</button>
      </div>
    </div>
  );
};

// 6. Schema Generator
export const SchemaGenerator: React.FC = () => {
  const [schemaType, setSchemaType] = useState('FAQ');
  const [q, setQ] = useState('Is this tool secure?');
  const [a, setA] = useState('Yes, all calculations occur client-side in Javascript.');
  const [output, setOutput] = useState('');

  useEffect(() => {
    let schemaObj = {};
    if (schemaType === 'FAQ') {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
          "@type": "Question",
          "name": q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": a
          }
        }]
      };
    } else {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": q,
        "description": a
      };
    }
    setOutput(`<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`);
  }, [schemaType, q, a]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ width: '100%' }}>
        <label className="label">Schema Type</label>
        <select value={schemaType} onChange={(e) => setSchemaType(e.target.value)} className="input" style={{ width: '180px' }}>
          <option value="FAQ">FAQ Page Schema</option>
          <option value="Article">Article Schema</option>
        </select>
      </div>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">{schemaType === 'FAQ' ? 'Question' : 'Headline'}</label>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">{schemaType === 'FAQ' ? 'Answer text' : 'Article Description'}</label>
          <input type="text" value={a} onChange={(e) => setA(e.target.value)} className="input" />
        </div>
      </div>

      <div>
        <label className="label">LD+JSON Schema Output</label>
        <textarea readOnly value={output} className="input textarea" style={{ height: '160px', fontFamily: 'var(--font-mono)' }} />
        <button onClick={() => copyToClipboard(output)} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Copy JSON-LD</button>
      </div>
    </div>
  );
};

// 7. SEO Analyzer
export const SEOAnalyzer: React.FC = () => {
  const [code, setCode] = useState('<!DOCTYPE html>\n<html>\n<head>\n  <title>AllSetTools</title>\n</head>\n<body>\n  <h1>Welcome</h1>\n  <img src="logo.png">\n</body>\n</html>');
  const [issues, setIssues] = useState<string[]>([]);
  const [score, setScore] = useState(100);

  const analyzeMarkup = () => {
    const list: string[] = [];
    let currentScore = 100;

    // Check title tag
    if (!code.match(/<title>[\s\S]*?<\/title>/i)) {
      list.push('✖ Missing <title> tag in page head.');
      currentScore -= 20;
    }
    // Check h1 tag
    if (!code.match(/<h1>[\s\S]*?<\/h1>/i)) {
      list.push('✖ Heading 1 (<h1>) element was not found.');
      currentScore -= 25;
    }
    // Check image alt tags
    const images = code.match(/<img[^>]*>/gi);
    if (images) {
      const missingAlt = images.some(img => !img.match(/alt\s*=\s*['"][^'"]*['"]/i));
      if (missingAlt) {
        list.push('✖ Some image tags do not contain alt descriptions.');
        currentScore -= 15;
      }
    }
    // Check meta descriptions
    if (!code.match(/<meta[^>]*name=["']description["'][^>]*>/i)) {
      list.push('✖ Missing meta description tag.');
      currentScore -= 20;
    }

    setIssues(list);
    setScore(Math.max(currentScore, 0));
    toast.success('SEO Audit finished!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">HTML Markup Code</label>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} className="input textarea" placeholder="Paste your HTML page structure..." />
      </div>
      <button onClick={analyzeMarkup} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Analyze Code</button>

      {score < 100 && (
        <div className="card" style={{ padding: '1.25rem', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>SEO Health Audit Score:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: score > 70 ? 'var(--color-success)' : 'var(--color-danger)' }}>{score} / 100</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '1rem', color: 'var(--color-danger)', fontSize: '0.875rem' }}>
            {issues.map((iss, i) => <span key={i}>{iss}</span>)}
          </div>
        </div>
      )}
      {score === 100 && issues.length === 0 && code && (
        <div style={{ color: 'var(--color-success)', fontSize: '0.875rem' }}>
          ✓ Excellent! Basic SEO elements (Title, H1, Meta Description, Alt attributes) pass the audit checks.
        </div>
      )}
    </div>
  );
};

// 8. UTM Builder
export const UTMBuilder: React.FC = () => {
  const [url, setUrl] = useState('https://mysite.com');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');

  useEffect(() => {
    if (!url) {
      setGeneratedUrl('');
      return;
    }

    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      if (source) parsedUrl.searchParams.set('utm_source', source);
      if (medium) parsedUrl.searchParams.set('utm_medium', medium);
      if (campaign) parsedUrl.searchParams.set('utm_campaign', campaign);
      if (term) parsedUrl.searchParams.set('utm_term', term);
      if (content) parsedUrl.searchParams.set('utm_content', content);
      setGeneratedUrl(parsedUrl.toString());
    } catch {
      setGeneratedUrl('');
    }
  }, [url, source, medium, campaign, term, content]);

  const applyPreset = (pSource: string, pMedium: string) => {
    setSource(pSource);
    setMedium(pMedium);
    toast.success(`Applied ${pSource} / ${pMedium} preset`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="label">Website URL *</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input"
              placeholder="e.g. https://example.com"
            />
          </div>
          <div>
            <label className="label">Campaign Source (utm_source) *</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="input"
              placeholder="e.g. google, newsletter, facebook"
            />
          </div>
          <div>
            <label className="label">Campaign Medium (utm_medium)</label>
            <input
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              className="input"
              placeholder="e.g. cpc, email, social, banner"
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="label">Campaign Name (utm_campaign)</label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="input"
              placeholder="e.g. summer_promo, product_launch"
            />
          </div>
          <div>
            <label className="label">Campaign Term (utm_term)</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="input"
              placeholder="e.g. running_shoes, running+shoes"
            />
          </div>
          <div>
            <label className="label">Campaign Content (utm_content)</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input"
              placeholder="e.g. logolink, textlink"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted)', display: 'flex', alignItems: 'center' }}>Presets:</span>
        <button type="button" onClick={() => applyPreset('google', 'cpc')} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Google Ads</button>
        <button type="button" onClick={() => applyPreset('facebook', 'social_ad')} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Facebook Ad</button>
        <button type="button" onClick={() => applyPreset('newsletter', 'email')} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Newsletter</button>
        <button type="button" onClick={() => applyPreset('linkedin', 'organic_social')} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>LinkedIn</button>
      </div>

      {generatedUrl && (
        <div style={{ marginTop: '1rem' }}>
          <label className="label">Generated Campaign URL</label>
          <textarea
            readOnly
            value={generatedUrl}
            className="input textarea"
            style={{ height: '80px', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
            <button onClick={() => copyToClipboard(generatedUrl)} className="btn btn-primary">Copy Link</button>
            <button
              onClick={() => {
                setUrl('https://mysite.com');
                setSource('');
                setMedium('');
                setCampaign('');
                setTerm('');
                setContent('');
                toast.success('Form cleared!');
              }}
              className="btn btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 9. SERP Preview Tool
export const SERPPreview: React.FC = () => {
  const [title, setTitle] = useState('AllSetTools - Free All-In-One Online Web Tools Platform');
  const [description, setDescription] = useState('Free, high-performance, and secure online tools. Dev, text, formatting, image compression, sitemaps, and calculators.');
  const [url, setUrl] = useState('https://allsettools.com/tools/serp-preview');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="label">Page Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px' }}>
              <span style={{ color: title.length > 60 || title.length < 30 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                {title.length > 60 ? 'Too Long (Truncation risk)' : title.length < 30 ? 'Too Short' : 'Optimal'}
              </span>
              <span>{title.length} / 60 characters</span>
            </div>
            <div style={{
              height: '4px',
              backgroundColor: 'var(--color-border)',
              borderRadius: '2px',
              marginTop: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min((title.length / 60) * 100, 100)}%`,
                backgroundColor: title.length > 60 ? 'var(--color-danger)' : title.length < 30 ? 'var(--color-warning)' : 'var(--color-success)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <div>
            <label className="label">Meta Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              style={{ height: '80px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px' }}>
              <span style={{ color: description.length > 160 || description.length < 110 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                {description.length > 160 ? 'Too Long (Truncation risk)' : description.length < 110 ? 'Too Short' : 'Optimal'}
              </span>
              <span>{description.length} / 160 characters</span>
            </div>
            <div style={{
              height: '4px',
              backgroundColor: 'var(--color-border)',
              borderRadius: '2px',
              marginTop: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min((description.length / 160) * 100, 100)}%`,
                backgroundColor: description.length > 160 ? 'var(--color-danger)' : description.length < 110 ? 'var(--color-warning)' : 'var(--color-success)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <div>
            <label className="label">Target Link URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input"
            />
          </div>
        </div>

        {/* Right Side Mockup */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="label" style={{ margin: 0 }}>Result Preview</label>
            <div className="d-flex gap-1" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`btn ${device === 'desktop' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px', fontSize: '0.75rem', border: 'none' }}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`btn ${device === 'mobile' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '4px 10px', fontSize: '0.75rem', border: 'none' }}
              >
                Mobile
              </button>
            </div>
          </div>

          {/* Google Rendering Sandbox */}
          <div
            className="card"
            style={{
              padding: '1.25rem',
              backgroundColor: '#ffffff',
              color: '#1a0dab',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              maxWidth: device === 'mobile' ? '360px' : '100%',
              margin: device === 'mobile' ? '0 auto' : '0',
              fontFamily: 'arial, sans-serif',
              boxShadow: 'var(--shadow-sm)',
              boxSizing: 'border-box'
            }}
          >
            {/* Google Breadcrumb / Path header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#202124', marginBottom: '4px', textDecoration: 'none' }}>
              <span style={{ fontWeight: 'normal', color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                {url ? url.replace(/https?:\/\/(www\.)?/, '').split('/')[0] : 'mysite.com'}
              </span>
              <span style={{ color: '#5f6368', fontSize: '10px' }}>&rsaquo;</span>
              <span style={{ color: '#5f6368', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {url ? url.replace(/https?:\/\/(www\.)?/, '').split('/').slice(1).join(' › ') : 'subpage'}
              </span>
            </div>

            {/* Google Title */}
            <h4
              style={{
                fontSize: device === 'mobile' ? '18px' : '20px',
                color: '#1a0dab',
                lineHeight: '1.3',
                margin: '0 0 4px 0',
                fontWeight: 'normal',
                fontFamily: 'arial, sans-serif',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              {title ? (title.length > 60 ? `${title.slice(0, 57)}...` : title) : 'Please enter title'}
            </h4>

            {/* Google Description */}
            <p
              style={{
                fontSize: '14px',
                color: '#4d5156',
                lineHeight: '1.57',
                margin: 0,
                fontFamily: 'arial, sans-serif',
                wordBreak: 'break-word'
              }}
            >
              {description ? (description.length > 160 ? `${description.slice(0, 155)}...` : description) : 'Please enter description'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 10. Headline Analyzer
export const HeadlineAnalyzer: React.FC = () => {
  const [headline, setHeadline] = useState('How to Write Catchy Headlines: 7 Magic Secrets Revealed');
  const [score, setScore] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [powerCount, setPowerCount] = useState(0);
  const [emotionCount, setEmotionCount] = useState(0);
  const [analysis, setAnalysis] = useState<{ powerList: string[]; emotionList: string[]; tips: string[] }>({
    powerList: [],
    emotionList: [],
    tips: []
  });

  const analyzeHeadline = () => {
    if (!headline.trim()) {
      setScore(0);
      setWordCount(0);
      setCharCount(0);
      setPowerCount(0);
      setEmotionCount(0);
      setAnalysis({ powerList: [], emotionList: [], tips: [] });
      return;
    }

    const words = headline.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w !== '');
    setWordCount(words.length);
    setCharCount(headline.length);

    // List arrays
    const powerDict = ['free', 'easy', 'secret', 'magic', 'instant', 'unlock', 'win', 'boost', 'skyrocket', 'ultimate', 'best', 'revealed', 'proven', 'hacks', 'tricks', 'surprising'];
    const emotionDict = ['hate', 'fear', 'love', 'click', 'guaranteed', 'shocked', 'warning', 'caution', 'threat', 'success', 'fail', 'bad', 'epic', 'life-changing', 'mistake', 'avoid'];

    const matchedPower = words.filter(w => powerDict.includes(w));
    const matchedEmotion = words.filter(w => emotionDict.includes(w));

    setPowerCount(matchedPower.length);
    setEmotionCount(matchedEmotion.length);

    // Score computation metrics
    let computedScore = 40; // baseline

    // Length score metrics
    if (words.length >= 6 && words.length <= 12) {
      computedScore += 25; // optimal length
    } else if (words.length > 12) {
      computedScore += 10; // slightly wordy
    } else {
      computedScore += 5; // too short
    }

    // Power words additions
    if (matchedPower.length > 0) {
      computedScore += Math.min(matchedPower.length * 10, 20);
    }
    // Emotional words additions
    if (matchedEmotion.length > 0) {
      computedScore += Math.min(matchedEmotion.length * 10, 15);
    }

    // Number presence check (e.g. listicles)
    if (/\d+/.test(headline)) {
      computedScore += 10;
    }

    // Caps check
    if (/[A-Z]/.test(headline) && headline !== headline.toUpperCase()) {
      computedScore += 5; // Title case bonus
    }

    const finalScore = Math.min(computedScore, 100);
    setScore(finalScore);

    // Tips building
    const currentTips: string[] = [];
    if (words.length < 6) currentTips.push('Consider adding more descriptive words. Optimal length is 6-12 words.');
    if (words.length > 12) currentTips.push('This title is a bit long. Try tightening it for better readability on smaller screens.');
    if (matchedPower.length === 0) currentTips.push('Add a Power word (e.g., Best, Revealed, Proven, Secrets) to inspire confidence.');
    if (matchedEmotion.length === 0) currentTips.push('Add an Emotional modifier (e.g., Shocking, Life-changing, Mistakes) to spike curiosity.');
    if (!/\d+/.test(headline)) currentTips.push('Including a number (e.g., 7 Ways, 10 Steps) can boost CTR by up to 36%.');

    setAnalysis({
      powerList: Array.from(new Set(matchedPower)),
      emotionList: Array.from(new Set(matchedEmotion)),
      tips: currentTips
    });

    toast.success('Analysis refreshed!');
  };

  useEffect(() => {
    analyzeHeadline();
  }, [headline]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Headline or Email Subject Line</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="input"
          placeholder="e.g. 10 Proven Secrets to Skyrocket Your Business Growth"
        />
      </div>

      <div className="grid-cols-3" style={{ gap: '1.25rem' }}>
        {/* Score Card */}
        <div className="card d-flex flex-column align-items-center justify-content-center" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-fg-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quality Score</span>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: score > 70 ? 'var(--color-success)' : score > 45 ? 'var(--color-warning)' : 'var(--color-danger)', margin: '0.5rem 0' }}>
            {score}
          </div>
          <span className="badge rounded-pill" style={{
            backgroundColor: score > 70 ? 'rgba(16, 185, 129, 0.15)' : score > 45 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: score > 70 ? 'var(--color-success)' : score > 45 ? 'var(--color-warning)' : 'var(--color-danger)',
            fontSize: '0.75rem'
          }}>
            {score > 70 ? 'Very Catchy' : score > 45 ? 'Moderate' : 'Needs Work'}
          </span>
        </div>

        {/* Word Counts */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, border: 'none', padding: 0, margin: '0 0 1rem 0' }}>Word Statistics</h4>
          <div className="d-flex flex-column gap-2" style={{ fontSize: '0.8125rem' }}>
            <div className="d-flex justify-content-between">
              <span>Word Count:</span>
              <span className="fw-bold">{wordCount}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Character Count:</span>
              <span className="fw-bold">{charCount}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Power Words:</span>
              <span className="fw-bold">{powerCount}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Emotion Words:</span>
              <span className="fw-bold">{emotionCount}</span>
            </div>
          </div>
        </div>

        {/* Word Lists */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, border: 'none', padding: 0, margin: '0 0 1rem 0' }}>Detected Key Words</h4>
          <div className="d-flex flex-column gap-2" style={{ fontSize: '0.75rem' }}>
            <div>
              <div style={{ color: 'var(--color-fg-muted)', fontWeight: 600, marginBottom: '4px' }}>Power Words:</div>
              <div className="d-flex flex-wrap gap-1">
                {analysis.powerList.length > 0 ? (
                  analysis.powerList.map((w, idx) => (
                    <span key={idx} className="badge bg-primary text-white">{w}</span>
                  ))
                ) : (
                  <span style={{ color: 'var(--color-fg-dimmed)' }}>None detected</span>
                )}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--color-fg-muted)', fontWeight: 600, marginBottom: '4px' }}>Emotion Words:</div>
              <div className="d-flex flex-wrap gap-1">
                {analysis.emotionList.length > 0 ? (
                  analysis.emotionList.map((w, idx) => (
                    <span key={idx} className="badge bg-secondary text-white">{w}</span>
                  ))
                ) : (
                  <span style={{ color: 'var(--color-fg-dimmed)' }}>None detected</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Headline Optimizations */}
      {analysis.tips.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', borderColor: 'var(--color-warning)' }}>
          <h4 className="fw-semibold text-warning" style={{ fontSize: '0.9rem', border: 'none', padding: 0, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            💡 Opportunities for Improvement
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--color-fg-muted)' }}>
            {analysis.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.tips.length === 0 && headline.trim() && (
        <div className="card text-success" style={{ padding: '1rem', borderColor: 'var(--color-success)', fontSize: '0.8125rem' }}>
          ✓ Excellent! Your headline is structured optimally, includes power/emotion elements, and uses numeric hooks.
        </div>
      )}
    </div>
  );
};

// 11. Canonical URL Generator
export const CanonicalURLGenerator: React.FC = () => {
  const [url, setUrl] = useState('https://mysite.com/blog/seo-tips');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (!url.trim()) {
      setOutput('');
      return;
    }
    const cleanUrl = url.trim().toLowerCase();
    setOutput(`<link rel="canonical" href="${cleanUrl}" />`);
  }, [url]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Target Page Absolute URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input"
          placeholder="e.g. https://mybrand.com/products/software"
        />
      </div>

      {output && (
        <div>
          <label className="label">Generated HTML Canonical Tag</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '70px', fontFamily: 'var(--font-mono)' }}
          />
          <button onClick={() => copyToClipboard(output)} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Copy Canonical Tag</button>
        </div>
      )}
    </div>
  );
};

// 12. Long-Tail Keyword Generator
export const LongTailKeywordGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState('seo audit');
  const [list, setList] = useState<string[]>([]);

  const generateKeywords = () => {
    if (!keyword.trim()) {
      setList([]);
      return;
    }

    const kw = keyword.toLowerCase().trim();
    const questions = ['how to do', 'why use', 'what is the best', 'where to find'];
    const modifiers = ['for beginners', 'tools', 'strategy guide', 'checklist 2026', 'step by step', 'explained'];
    const commercial = ['free', 'best', 'cheap', 'professional', 'online'];

    const items: string[] = [];
    questions.forEach(q => items.push(`${q} ${kw}`));
    modifiers.forEach(m => items.push(`${kw} ${m}`));
    commercial.forEach(c => items.push(`${c} ${kw}`));

    setList(items);
    toast.success('Long-tail combinations generated!');
  };

  useEffect(() => {
    generateKeywords();
  }, [keyword]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">Focus Root Keyword</label>
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="input"
          placeholder="e.g. digital marketing, web hosting"
        />
      </div>

      {list.length > 0 && (
        <div>
          <label className="label">Long-Tail Variations (Click to Copy)</label>
          <div className="grid-cols-2" style={{ gap: '8px', maxHeight: '300px', overflowY: 'auto', padding: '4px' }}>
            {list.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  navigator.clipboard.writeText(item);
                  toast.success(`Copied "${item}"`);
                }}
                className="card card-hover"
                style={{ padding: '10px', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 13. Robots Meta Tag Generator
export const RobotsMetaGenerator: React.FC = () => {
  const [index, setIndex] = useState('index');
  const [follow, setFollow] = useState('follow');
  const [snippet, setSnippet] = useState('max-snippet:-1');
  const [imagePreview, setImagePreview] = useState('max-image-preview:large');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const parts = [index, follow, snippet, imagePreview].filter(p => p !== '');
    setOutput(`<meta name="robots" content="${parts.join(', ')}" />`);
  }, [index, follow, snippet, imagePreview]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Indexation</label>
          <select value={index} onChange={e => setIndex(e.target.value)} className="input">
            <option value="index">Index (Allow search indexing)</option>
            <option value="noindex">Noindex (Block search indexing)</option>
          </select>
        </div>
        <div>
          <label className="label">Links Follow</label>
          <select value={follow} onChange={e => setFollow(e.target.value)} className="input">
            <option value="follow">Follow (Follow outbound links)</option>
            <option value="nofollow">Nofollow (Do not follow links)</option>
          </select>
        </div>
      </div>

      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Snippet Limits</label>
          <select value={snippet} onChange={e => setSnippet(e.target.value)} className="input">
            <option value="max-snippet:-1">Standard Max Snippet (-1)</option>
            <option value="nosnippet">Nosnippet (No preview description)</option>
          </select>
        </div>
        <div>
          <label className="label">Image Preview scale</label>
          <select value={imagePreview} onChange={e => setImagePreview(e.target.value)} className="input">
            <option value="max-image-preview:large">Large Previews (Large)</option>
            <option value="max-image-preview:standard">Standard Previews</option>
            <option value="noimageindex">Noimageindex (Do not index photos)</option>
          </select>
        </div>
      </div>

      {output && (
        <div>
          <label className="label">Generated Robots Meta Tag</label>
          <textarea
            readOnly
            value={output}
            className="input textarea"
            style={{ height: '70px', fontFamily: 'var(--font-mono)' }}
          />
          <button onClick={() => copyToClipboard(output)} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Copy Robots Tag</button>
        </div>
      )}
    </div>
  );
};

// 14. Keyword Clustering Tool
export const KeywordClusteringTool: React.FC = () => {
  const [input, setInput] = useState("best react tools\nreact tools for seo\nnextjs deployment guide\nseo checklist nextjs\nreact seo performance");
  const [clusters, setClusters] = useState<Record<string, string[]>>({});

  const clusterKeywords = () => {
    if (!input.trim()) return;
    const keywords = input.split('\n').map(k => k.trim()).filter(k => k !== '');
    
    const groups: Record<string, string[]> = {};
    keywords.forEach(kw => {
      const words = kw.toLowerCase().split(/\s+/);
      let anchor = 'General';
      if (words.includes('react')) anchor = 'React Ecosystem';
      else if (words.includes('nextjs') || words.includes('next.js')) anchor = 'Next.js';
      else if (words.includes('seo')) anchor = 'SEO Optimization';
      
      if (!groups[anchor]) {
        groups[anchor] = [];
      }
      groups[anchor].push(kw);
    });

    setClusters(groups);
    toast.success('Keywords clustered successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Keyword List (one per line)</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '200px', fontFamily: 'var(--font-mono)' }}
            placeholder="Paste raw keyword list here..."
          />
        </div>
        <div>
          <label className="label">Semantic Clusters</label>
          <div className="card" style={{ padding: '1.25rem', height: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.keys(clusters).length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--color-fg-dimmed)' }}>Click Cluster keywords to see grouped buckets.</span>
            ) : (
              Object.entries(clusters).map(([name, list], idx) => (
                <div key={idx} style={{ fontSize: '0.8125rem' }}>
                  <div style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '4px' }}>{name} ({list.length})</div>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, color: 'var(--color-fg-muted)' }}>
                    {list.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <button onClick={clusterKeywords} disabled={!input.trim()} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Cluster Keywords
      </button>
    </div>
  );
};

// 15. Search Intent Analyzer
export const SearchIntentAnalyzer: React.FC = () => {
  const [input, setInput] = useState("buy domain names\nwhat is clv calculator\nstripe customer portal login\nbest roas calculator tools");
  const [results, setResults] = useState<{ keyword: string; intent: string; color: string }[]>([]);

  const analyzeIntent = () => {
    if (!input.trim()) return;
    const keywords = input.split('\n').map(k => k.trim()).filter(k => k !== '');

    const analyzed = keywords.map(kw => {
      const lower = kw.toLowerCase();
      let intent = 'Commercial';
      let color = 'var(--color-primary)';

      if (lower.includes('how') || lower.includes('what') || lower.includes('guide') || lower.includes('learn')) {
        intent = 'Informational';
        color = '#3b82f6';
      } else if (lower.includes('buy') || lower.includes('pricing') || lower.includes('checkout') || lower.includes('purchase')) {
        intent = 'Transactional';
        color = 'var(--color-success)';
      } else if (lower.includes('login') || lower.includes('portal') || lower.includes('signin') || lower.includes('dashboard')) {
        intent = 'Navigational';
        color = '#8b5cf6';
      }

      return { keyword: kw, intent, color };
    });

    setResults(analyzed);
    toast.success('Keywords search intents analyzed!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Analyze Keyword List</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input textarea"
            style={{ height: '200px', fontFamily: 'var(--font-mono)' }}
            placeholder="Paste keyword lines here..."
          />
        </div>
        <div>
          <label className="label">Search Intent Mapping</label>
          <div className="card" style={{ padding: '1.25rem', height: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {results.length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--color-fg-dimmed)' }}>Run analysis to map keyword intents.</span>
            ) : (
              results.map((r, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.8125rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{r.keyword}</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--color-bg-subtle)',
                    border: `1px solid ${r.color}`,
                    color: r.color,
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>{r.intent}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <button onClick={analyzeIntent} disabled={!input.trim()} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Analyze Search Intents
      </button>
    </div>
  );
};

// 16. Content Calendar Generator
export const ContentCalendarGenerator: React.FC = () => {
  const [topics, setTopics] = useState("React SEO Hacks\nNext.js Build Optimization\nAutomating Marketing Spend");
  const [frequency, setFrequency] = useState('3');
  const [calendar, setCalendar] = useState<{ day: string; topic: string; channel: string }[]>([]);

  const generateCalendar = () => {
    if (!topics.trim()) return;
    const list = topics.split('\n').map(t => t.trim()).filter(t => t !== '');
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const channels = ['Twitter/X Thread', 'Blog Post', 'LinkedIn Article', 'Social Image Post'];

    const scheduled = list.map((topic, idx) => {
      const day = days[idx % days.length];
      const channel = channels[idx % channels.length];
      return { day, topic, channel };
    });

    setCalendar(scheduled);
    toast.success('Weekly Editorial Calendar Generated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-cols-2" style={{ gap: '1rem' }}>
        <div>
          <label className="label">Topic Ideas (one per line)</label>
          <textarea
            value={topics}
            onChange={e => setTopics(e.target.value)}
            className="input textarea"
            style={{ height: '140px' }}
            placeholder="Enter blog/social media themes..."
          />
        </div>
        <div>
          <label className="label">Target Weekly Count</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value)} className="input">
            <option value="1">1 Post per week</option>
            <option value="3">3 Posts per week</option>
            <option value="5">Daily (Mon-Fri)</option>
          </select>
        </div>
      </div>

      <button onClick={generateCalendar} disabled={!topics.trim()} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Generate Calendar
      </button>

      {calendar.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', marginTop: '0.5rem' }}>
          <label className="label">Scheduled Editorial Log</label>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Scheduled Day</th>
                <th style={{ padding: '8px' }}>Topic Theme</th>
                <th style={{ padding: '8px' }}>Distribution Channel</th>
              </tr>
            </thead>
            <tbody>
              {calendar.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{item.day}</td>
                  <td style={{ padding: '8px' }}>{item.topic}</td>
                  <td style={{ padding: '8px', color: 'var(--color-fg-muted)' }}>{item.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


