// src/app/blog/[slug]/BlogPostClient.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost, BLOG_POSTS } from '@/lib/blog';
import { Breadcrumb } from '@/components/Breadcrumb';

interface ClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: ClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem('allsettools_local_blog_posts') || '[]');
      const merged = [...local, ...BLOG_POSTS];
      const found = merged.find(p => p.slug === slug);
      setPost(found || null);
    } catch (e) {
      setPost(BLOG_POSTS.find(p => p.slug === slug) || null);
    }
    setLoading(false);
  }, [slug]);

  // Simple custom parser for formatting blog markdown into HTML
  const formatBody = (md: string) => {
    let html = md
      .replace(/^# (.*$)/gim, '<h1 style="font-size: 2.25rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; border: none;">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; border: none; padding: 0;">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.2rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem;">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background-color: var(--color-bg-hover); padding: 2px 5px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.85em; border: 1px solid var(--color-border);">$1</code>')
      .replace(/^- (.*$)/gim, '<li style="margin-left: 1.5rem; margin-bottom: 0.5rem; list-style-type: disc;">$1</li>')
      .replace(/\n\n/g, '<br />')
      .replace(/^(>)(.*$)/gim, '<blockquote style="border-left: 3px solid var(--color-primary); padding-left: 1rem; color: var(--color-fg-muted); margin: 1.5rem 0;">$2</blockquote>');

    return html;
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p>Loading article content...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1 style={{ fontSize: '2rem', border: 'none' }}>Article Not Found</h1>
        <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>The requested blog post could not be located in our database.</p>
        <Link href="/blog" className="btn btn-primary">Back to Blog</Link>
      </div>
    );
  }

  // Get related posts (exclude current)
  const related = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="container animate-fade-in" style={{ marginTop: '1rem' }}>
      <Breadcrumb
        items={[
          { label: 'Home', url: '/' },
          { label: 'Blog', url: '/blog' },
          { label: post.title }
        ]}
      />

      <article style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '3rem', marginBottom: '3rem' }}>
        {/* Article Header */}
        <header style={{ marginBottom: '2.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            color: 'var(--color-fg-muted)',
            border: '1px solid var(--color-border)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            display: 'inline-block',
            marginBottom: '1rem'
          }}>{post.category}</span>
          
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: '1.2', marginBottom: '1rem', border: 'none' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-fg-muted)' }}>
            <span>By {post.author}</span>
            <span>•</span>
            <span>{post.publishedAt}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Article Body */}
        <div
          dangerouslySetInnerHTML={{ __html: formatBody(post.content) }}
          style={{
            lineHeight: '1.7',
            fontSize: '1.05rem',
            color: 'var(--color-fg-muted)'
          }}
          className="blog-content"
        />
      </article>

      {/* Related Posts Section */}
      {related.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Related Articles</h3>
          <div className="grid-cols-2">
            {related.map(p => (
              <Link href={`/blog/${p.slug}`} key={p.slug} className="card card-hover" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--color-fg-dimmed)', display: 'block', marginBottom: '0.25rem' }}>{p.category}</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', border: 'none', padding: 0 }}>{p.title}</h4>
                <p style={{ fontSize: '0.75rem', flex: 1 }}>{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <div style={{ textAlign: 'center' }}>
        <Link href="/blog" className="btn btn-secondary">
          ← Back to Blog Index
        </Link>
      </div>
    </div>
  );
}
