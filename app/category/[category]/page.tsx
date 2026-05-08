import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { PostGrid } from "@/components/public/PostGrid";
import { Badge } from "@/components/ui/badge";
import {
  CategoryGroup,
  PostCategory,
  CATEGORY_GROUPS,
  GROUP_CATEGORY_MAP,
  ALL_CATEGORY_VALUES,
} from "@/types/post";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* ─── Group metadata ─────────────────────────────────────────── */

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

/* ─── Route resolution ───────────────────────────────────────── */

const VALID_GROUPS = CATEGORY_GROUPS.map((g) => g.label) as CategoryGroup[];

function resolveCategory(raw: string):
  | { type: "group"; group: CategoryGroup; categories: PostCategory[] }
  | { type: "single"; category: PostCategory }
  | null {
  const decoded = decodeURIComponent(raw);

  // Check if it's a known group name (Reviews, Roundups, How-To, etc.)
  if (VALID_GROUPS.includes(decoded as CategoryGroup)) {
    const group = decoded as CategoryGroup;
    return { type: "group", group, categories: GROUP_CATEGORY_MAP[group] };
  }

  // Check if it's an individual PostCategory (Tool Review, Tutorial, etc.)
  if (ALL_CATEGORY_VALUES.includes(decoded as PostCategory)) {
    return { type: "single", category: decoded as PostCategory };
  }

  return null;
}

/* ─── Metadata ───────────────────────────────────────────────── */

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: raw } = await params;
  const resolved = resolveCategory(raw);
  if (!resolved) return { title: "Category Not Found" };

  const title =
    resolved.type === "group"
      ? GROUP_META[resolved.group].headline
      : resolved.category;
  const description =
    resolved.type === "group"
      ? GROUP_META[resolved.group].description
      : `Browse all ${resolved.category} articles on Glafix.`;

  return {
    title: { absolute: `${title} | Glafix` },
    description,
    openGraph: {
      title: `${title} — Glafix`,
      description,
      type: "website",
      siteName: "Glafix",
    },
    twitter: { card: "summary", title: `${title} — Glafix`, description },
  };
}

/* ─── Page ───────────────────────────────────────────────────── */

export default async function CategoryPage({ params }: Props) {
  const { category: raw } = await params;
  const resolved = resolveCategory(raw);

  if (!resolved) notFound();

  const headline =
    resolved.type === "group"
      ? GROUP_META[resolved.group].headline
      : resolved.category;

  const description =
    resolved.type === "group"
      ? GROUP_META[resolved.group].description
      : `All ${resolved.category} articles — hand-tested tools, real results.`;

  const subChips =
    resolved.type === "group" ? resolved.categories : null;

  const gridCategory: PostCategory | PostCategory[] =
    resolved.type === "group" ? resolved.categories : resolved.category;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-32 lg:pt-40 pb-12 animate-fade-in-up">
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
            {headline}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            {description}
          </p>

          {/* Sub-type chips (groups only) */}
          {subChips && (
            <div className="flex flex-wrap gap-2 mt-6">
              {subChips.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${encodeURIComponent(cat)}`}
                  className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground bg-muted/20 hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-border mb-12" />

        <div className="pb-24">
          <PostGrid category={gridCategory} pageSize={9} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
