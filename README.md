# ToolHub - Free All-in-One Online Web Tools Platform

ToolHub is a modern, premium, high-performance web utility workspace featuring **130+ developer, text, design, and financial tools** running entirely client-side in the browser. 

The user interface follows a strict black-and-white minimalist SaaS aesthetic inspired by Vercel, Linear, and Notion.

---

## Technical Stack & Architecture

- **Framework**: Next.js (App Router) + TypeScript.
- **Styling**: Vanilla CSS with unified design system variables (`src/styles/theme.css` & `src/app/globals.css`).
- **Core Principle**: **Zero Server Latency & 100% Privacy**. User inputs (configs, keys, images, JWTs) are processed directly in the client browser using Web Crypto, Canvas, Media, and LocalStorage APIs.
- **SEO & Performance Optimization**: Dynamic sitemaps, semantic breadcrumb tags, automated meta-header generations, and complete static route pre-renderings (`generateStaticParams`).

---

## Project Folder Directory Structure

```
toolhub/
├── prisma/
│   └── schema.prisma         # Database schemas for feedback, subscriptions & posts
├── src/
│   ├── app/
│   │   ├── admin/            # Administrative dashboard (analytics, feedback logs)
│   │   ├── blog/             # Dynamic tutorial blog list and dynamic article reader
│   │   ├── feedback/         # User feedback log forms
│   │   ├── tools/            # Dynamic parameterized tool workspace wrapper page
│   │   ├── globals.css       # Core typography, scrollbars, buttons & resets
│   │   ├── layout.tsx        # Base metadata headers, Inter fonts & header/footers
│   │   ├── page.tsx          # Landing workspace search dashboard
│   │   ├── robots.ts         # Automated search engine robots directives
│   │   └── sitemap.ts        # Dynamic XML sitemap generator mapping
│   ├── components/
│   │   ├── tools/            # Modular suites (text, dev, image, AI, SEO, business, utility)
│   │   ├── Breadcrumb.tsx    # Page navigation indicators
│   │   ├── CommandPalette.tsx # Spotlight Ctrl+K search overlays
│   │   ├── Icons.tsx         # Vector SVG inline libraries
│   │   └── Toast.tsx         # Notification alerts
│   └── lib/
│       ├── blog.ts           # Precompiled articles list database
│       └── registry.ts       # Central 130+ tools index catalog mappings
```

---

## Deployment Guide

### Option 1: Vercel (Recommended)
ToolHub is optimized for Vercel edge networks. Since all tool components are static-compiled, hosting is completely free:
1. Connect your repository to Vercel.
2. Ensure the Framework Preset is set to **Next.js**.
3. Set your build command to `npm run build`.
4. Click **Deploy**.

### Option 2: Self-Hosted Docker Build
We provide support for standalone node setups. Create a `Dockerfile` in the root:
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```
Build and run using:
```bash
docker build -t toolhub-app .
docker run -p 3000:3000 toolhub-app
```

---

## SEO & Crawling Strategy

To maintain high SERP visibility, ToolHub automatically implements:
1. **Dynamic Schema Markup**: Every tool detail page loads a structured JSON-LD format matching `FAQPage` or `Article` profiles to display Google Rich snippets.
2. **Instant SERP Visualizer**: The SEO meta-tag builder displays a live pixel-accurate mockup of Google search results to check word lengths.
3. **Crawl Optimizations**: Robots rules disallow heavy admin pages (`/admin`) and secure api segments, prioritizing crawled categories in `/sitemap.xml`.
4. **Structured Breadcrumbs**: Breadcrumb tags are rendered using semantic HTML anchors for structured search pathways.

---

## Local Verification & Development

Start the development server:
```bash
npm run dev
```

Run TypeScript and Next production compilation validation checks:
```bash
npx tsc --noEmit
npm run build
```
