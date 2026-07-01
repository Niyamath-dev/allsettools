// src/app/blog/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BLOG_POSTS, BlogPost } from '@/lib/blog';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Icon } from '@/components/Icons';
import { toast } from '@/components/Toast';

export default function BlogIndex() {
  const [filter, setFilter] = useState<'all' | 'security' | 'performance' | 'tutorials'>('all');
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Merge default posts with custom posts from Admin panel
  React.useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem('allsettools_local_blog_posts') || '[]');
      setPosts([...local, ...BLOG_POSTS]);
    } catch (e) {
      setPosts(BLOG_POSTS);
    }
  }, []);

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(p => p.category === filter);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Invalid email address.');
      return;
    }
    const subs = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (!subs.includes(email)) {
      subs.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subs));
    }
    toast.success('Successfully subscribed to newsletter!');
    setEmail('');
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem' }}>
      <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: 'Blog' }]} />
      
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
          Security & Optimization Insights
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-fg-muted)', maxWidth: '600px' }}>
          Tutorials, performance audits, and deep dives into browser-based tooling privacy.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        <button onClick={() => setFilter('all')} className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}>All Articles</button>
        <button onClick={() => setFilter('security')} className={`btn ${filter === 'security' ? 'btn-primary' : 'btn-secondary'}`}>Security</button>
        <button onClick={() => setFilter('performance')} className={`btn ${filter === 'performance' ? 'btn-primary' : 'btn-secondary'}`}>Performance</button>
        <button onClick={() => setFilter('tutorials')} className={`btn ${filter === 'tutorials' ? 'btn-primary' : 'btn-secondary'}`}>Tutorials</button>
      </div>

      <div className="tool-container">
        {/* Articles List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredPosts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="card card-hover" style={{ padding: '1.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-fg-muted)', display: 'block', marginBottom: '0.5rem' }}>
                {post.category}
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, border: 'none', padding: 0, marginBottom: '0.5rem', lineHeight: '1.3' }}>
                {post.title}
              </h2>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{post.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-fg-dimmed)' }}>
                <span>By {post.author} • {post.publishedAt}</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Sidebar Newsletter Widget */}
        <aside>
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg-subtle)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Subscribe to Updates</h3>
            <p style={{ fontSize: '0.8125rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Get technical insights and new utility alerts delivered straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="email"
                placeholder="developer@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                required
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Join Newsletter</button>
            </form>
          </div>
        </aside>
      </div>

      {/* FAQs Collapsible Accordion */}
      <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem', marginTop: '3rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: 'var(--color-fg)', border: 'none', padding: 0 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Who drafts the articles on this blog?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              All posts are written by developers, security engineers, and devops specialists to offer technical advice on offline applications and optimization techniques.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Can I submit a tutorial to be featured here?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              Yes! We welcome guest contributors. Please outline your proposed topic and send details to support@allsettools.dev or via our Contact form.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Is the email newsletter subscription list real?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              For this demo platform, newsletter registrations are saved in your local cache database and are not synced with external campaign servers.
            </p>
          </details>

          <details className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 600, fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>How often is new technical content added?</span>
              <span className="accent-color" style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--color-fg-muted)', lineHeight: '1.6', cursor: 'default', margin: 0 }}>
              We publish detailed tutorials, performance writeups, and security guidelines bi-weekly.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
