// src/app/tools/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolById, TOOLS, CATEGORIES } from '@/lib/registry';
import ToolClientWrapper from './ToolClientWrapper';
import CategorySEOView from './CategorySEOView';

interface Props {
  params: Promise<{ id: string }>;
}

// Statically pre-renders all tools and all categories under the /tools/[id] dynamic segment
export async function generateStaticParams() {
  const toolParams = TOOLS.map((tool) => ({
    id: tool.id,
  }));
  
  const categoryParams = CATEGORIES.map((cat) => ({
    id: cat.id,
  }));

  return [...toolParams, ...categoryParams];
}

// Helper to extract a short SEO benefit from a description
function getSeoBenefit(description: string): string {
  let benefit = description.split(/[.!?]/)[0].trim();
  benefit = benefit.replace(/^(Free\s+|Online\s+|Client-side\s+)/i, '');
  return benefit.charAt(0).toUpperCase() + benefit.slice(1);
}

// Page SEO Metadata Generator for both tools and categories
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // 1. Resolve Tool Metadata
  const tool = getToolById(id);
  if (tool) {
    const benefit = getSeoBenefit(tool.description);
    return {
      title: `${tool.name} – ${benefit}`,
      description: tool.description,
      keywords: [...tool.keywords, 'free online tool', 'allsettools'],
      openGraph: {
        title: `${tool.name} – ${benefit}`,
        description: tool.description,
        url: `https://allsettools.dev/tools/${tool.id}`,
      }
    };
  }

  // 2. Resolve Category Metadata
  const category = CATEGORIES.find(c => c.id === id);
  if (category) {
    const benefit = getSeoBenefit(category.description);
    return {
      title: `${category.name} – ${benefit}`,
      description: `Access premium 100% offline-ready ${category.name.toLowerCase()} tools. ${category.description} Free, instant, and private browser-local calculations.`,
      alternates: {
        canonical: `https://allsettools.dev/tools/${id}`
      }
    };
  }

  return {};
}

export default async function ToolPage({ params }: Props) {
  const { id } = await params;
  
  // 1. Check if ID matches a Tool
  const tool = getToolById(id);
  if (tool) {
    return <ToolClientWrapper tool={tool} />;
  }

  // 2. Check if ID matches a Category
  const category = CATEGORIES.find(c => c.id === id);
  if (category) {
    return <CategorySEOView category={category} />;
  }

  // 3. Fallback to 404
  notFound();
}
