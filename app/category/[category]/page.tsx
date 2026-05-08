import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { PostGrid } from "@/components/public/PostGrid";
import { Badge } from "@/components/ui/badge";
import { CategoryGroup, CATEGORY_GROUPS, GROUP_CATEGORY_MAP } from "@/types/post";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const GROUP_META: Record<CategoryGroup, { description: string; headline: string }> = {
  Reviews: {
    headline: "Reviews & Comparisons",
    description:
      "In-depth tool reviews, head-to-head comparisons, and honest alternatives — for buyers who need a clear answer.",
  },
  Roundups: {
    headline: "Best Of & Roundups",
    description:
      "Curated lists of the best AI tools by use case, industry, role, and task. High traffic, highly shareable.",
  },
  "How-To": {
    headline: "How-To & Guides",
    description:
      "Step-by-step tutorials, prompting guides, automation workflows, and beginner explainers — built for operators.",
  },
  "Pricing & News": {
    headline: "Pricing & News",
    description:
      "Every pricing plan explained, plus the AI news and statistics that actually matter for running a business.",
  },
  "Case Studies": {
    headline: "Case Studies & Real Results",
    description:
      "First-person data: real tools, real money, real outcomes — so you can make decisions based on evidence.",
  },
};

const VALID_GROUPS = CATEGORY_GROUPS.map((g) => g.label);

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: raw } = await params;
  const group = decodeURIComponent(raw) as CategoryGroup;
  const meta = GROUP_META[group];
  if (!meta) return { title: "Category Not Found" };

  return {
    title: { absolute: `${meta.headline} | Glafix` },
    description: meta.description,
    openGraph: {
      title: `${meta.headline} — Glafix`,
      description: meta.description,
      type: "website",
      siteName: "Glafix",
    },
    twitter: { card: "summary", title: `${meta.headline} — Glafix`, description: meta.description },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: raw } = await params;
  const group = decodeURIComponent(raw) as CategoryGroup;

  if (!VALID_GROUPS.includes(group)) notFound();

  const meta = GROUP_META[group];
  const categories = GROUP_CATEGORY_MAP[group];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-32 pb-12 animate-fade-in-up">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Articles
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <Badge
              variant="outline"
              className="border-primary/40 text-primary uppercase tracking-widest text-xs"
            >
              Category
            </Badge>
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {meta.headline}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            {meta.description}
          </p>

          {/* Sub-type chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground bg-muted/20"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-border mb-12" />

        <div className="pb-24">
          <PostGrid category={categories} pageSize={9} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
