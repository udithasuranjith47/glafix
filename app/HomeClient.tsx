"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryFilter } from "@/components/public/CategoryFilter";
import { PostGrid } from "@/components/public/PostGrid";
import { getHomepageConfig, getPostsByIds } from "@/lib/firestore";
import { Post, PostCategory, CategoryGroup, GROUP_CATEGORY_MAP } from "@/types/post";

/* ─── Category icons ─────────────────────────────────────────── */

const CATEGORY_ICONS: Record<string, string> = {
  "Tool Review":      "⭐",
  "Comparison":       "⚖️",
  "Best Of":          "🏆",
  "Tutorial":         "📚",
  "Pricing & Value":  "💰",
  "Alternatives":     "🔄",
  "By Industry":      "🏭",
  "By Role":          "👤",
  "By Task":          "🔧",
  "Prompting Guide":  "💬",
  "Automation":       "⚡",
  "AI News":          "📣",
  "Statistics":       "📊",
  "Case Study":       "🏗️",
  "Beginner Guide":   "🎓",
  "AI vs Human":      "🤖",
  "Free Resources":   "🎁",
  "Content Creation": "✍️",
};

/* ─── Top Picks ──────────────────────────────────────────────── */

function TopPicks({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <section className="py-20 bg-muted/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Editor&apos;s Top Picks
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Top Picks 2026
            </h2>
          </div>
          <Link
            href="/best-ai-tools-2026"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all"
          >
            See full stack <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <div className="h-full bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-primary border border-primary/30 rounded px-2 py-0.5 mb-4">
                  {post.category}
                </span>
                <h3
                  className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/60">{post.readTime} min read</span>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pillar Grid ────────────────────────────────────────────── */

function PillarGrid({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-2">
            Evergreen Comparisons
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            The Money Pages
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Deep comparison posts built for operators who have already decided to buy — they just
            need to know which one.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post, i) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <div className="h-full bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 flex gap-4">
                <span className="text-2xl shrink-0 mt-0.5">
                  {CATEGORY_ICONS[post.category] ?? "📄"}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {i === 0 && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-background bg-primary rounded px-1.5 py-0.5">
                        Hot
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{post.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main dynamic content ───────────────────────────────────── */

interface Props {
  excludeSlug?: string;
}

function HomeContentInner({ excludeSlug }: Props) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [topPickPosts, setTopPickPosts] = useState<Post[]>([]);
  const [pillarPosts, setPillarPosts] = useState<Post[]>([]);

  useEffect(() => {
    getHomepageConfig()
      .then(async (config) => {
        const [picks, pillars] = await Promise.all([
          getPostsByIds(config.topPicks),
          getPostsByIds(config.pillars),
        ]);
        setTopPickPosts(picks);
        setPillarPosts(pillars);
      })
      .catch(() => {});
  }, []);

  const activeCategory = category ?? "All";
  const gridCategory =
    category && category !== "All"
      ? (GROUP_CATEGORY_MAP[category as CategoryGroup] ?? (category as PostCategory))
      : undefined;

  return (
    <>
      <TopPicks posts={topPickPosts} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl sm:text-3xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {activeCategory === "All" ? "Latest Reviews" : activeCategory}
            </h2>
          </div>
          <CategoryFilter activeCategory={activeCategory} />
        </div>
        <PostGrid category={gridCategory} excludeSlug={excludeSlug} pageSize={9} />
      </section>

      <PillarGrid posts={pillarPosts} />
    </>
  );
}

export default function HomeClient({ excludeSlug }: Props) {
  return (
    <Suspense>
      <HomeContentInner excludeSlug={excludeSlug} />
    </Suspense>
  );
}
