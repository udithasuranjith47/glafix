"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
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

export default function CategoryPage() {
  const { category: rawCategory } = useParams<{ category: string }>();
  const category = decodeURIComponent(rawCategory) as PostCategory;
  const isValid = VALID_CATEGORIES.includes(category);

  useEffect(() => {
    if (isValid) {
      document.title = `${category} | Glafix`;
    }
  }, [category, isValid]);

  if (!isValid) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              Unknown Category
            </h1>
            <Link href="/" className="text-primary hover:underline text-sm">
              ← Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Separator */}
        <div className="h-px bg-border mb-12" />

        {/* Grid */}
        <div className="pb-24">
          <PostGrid category={category} pageSize={9} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
