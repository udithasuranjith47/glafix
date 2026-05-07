import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { PostGrid } from "@/components/public/PostGrid";
import { Badge } from "@/components/ui/badge";
import { PostCategory } from "@/types/post";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const VALID_CATEGORIES: PostCategory[] = [
  "Reviews",
  "Tutorials",
  "Case Studies",
  "Tools",
  "News",
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Reviews: "In-depth breakdowns of high-ticket AI SaaS tools — ROI, features, and verdict.",
  Tutorials: "Step-by-step guides to building, integrating, and scaling AI-powered workflows.",
  "Case Studies": "Real stories of operators deploying AI SaaS at scale with measurable results.",
  Tools: "Curated spotlights on AI tools worth your attention and budget.",
  News: "What's happening in the high-ticket AI SaaS landscape right now.",
};

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: raw } = await params;
  const category = decodeURIComponent(raw);
  const description = CATEGORY_DESCRIPTIONS[category];

  if (!description) return { title: "Category Not Found" };

  return {
    title: { absolute: `${category} | Glafix` },
    description,
    openGraph: {
      title: `${category} — Glafix`,
      description,
      type: "website",
      siteName: "Glafix",
    },
    twitter: { card: "summary", title: `${category} — Glafix`, description },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: raw } = await params;
  const category = decodeURIComponent(raw) as PostCategory;

  if (!VALID_CATEGORIES.includes(category)) notFound();

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
            {category}
          </h1>
          {CATEGORY_DESCRIPTIONS[category] && (
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              {CATEGORY_DESCRIPTIONS[category]}
            </p>
          )}
        </div>

        <div className="h-px bg-border mb-12" />

        <div className="pb-24">
          <PostGrid category={category} pageSize={9} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
