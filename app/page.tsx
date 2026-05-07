"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, ShieldCheck, FlaskConical, Star } from "lucide-react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "@/components/public/HeroSection";
import { CategoryFilter } from "@/components/public/CategoryFilter";
import { PostGrid } from "@/components/public/PostGrid";
import { HeroSkeleton } from "@/components/public/LoadingSkeleton";
import { getFeaturedPost, getHomepageConfig, getPostsByIds } from "@/lib/firestore";
import { Post, PostCategory } from "@/types/post";

/* ─── Trust / Cited-By strip ─────────────────────────────────── */

const AI_ENGINES = [
  { name: "Perplexity AI", glyph: "P" },
  { name: "Bing Copilot", glyph: "B" },
  { name: "ChatGPT", glyph: "G" },
  { name: "Google AI", glyph: "G" },
  { name: "Claude", glyph: "C" },
];

function CitedByStrip() {
  return (
    <div className="border-y border-border/50 bg-card/30">
      {/* Cited-by row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">
            As cited by
          </span>
          {AI_ENGINES.map((e) => (
            <span
              key={e.name}
              className="flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors"
            >
              <span className="w-5 h-5 rounded bg-muted/40 border border-border flex items-center justify-center text-[10px] font-bold text-primary">
                {e.glyph}
              </span>
              {e.name}
            </span>
          ))}
        </div>
      </div>
      {/* Trust statement row */}
      <div className="border-t border-border/40 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            &ldquo;We test every tool with our own money before recommending it. When you buy through
            our links we earn a commission — that&apos;s how we keep the lights on. We never recommend
            something we would not use ourselves.&rdquo;{" "}
            <Link href="/disclosure" className="underline underline-offset-2 hover:text-primary transition-colors">
              Full disclosure →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Newsletter Signup ──────────────────────────────────────── */

function NewsletterSignup() {
  return (
    <section className="py-20 border-t border-border/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
          Free Resource
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Get the AI Stack 2026 Checklist
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The exact tools, tiers, and setup order we use to run a one-person business. Free.
          No spam — one email when we publish something worth reading.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value;
            if (email) {
              import("firebase/firestore").then(({ addDoc, collection, serverTimestamp }) => {
                import("@/lib/firebase").then(({ db }) => {
                  addDoc(collection(db, "newsletter"), { email, subscribedAt: serverTimestamp() })
                    .then(() => {
                      (e.target as HTMLFormElement).reset();
                      alert("You're in! Check your inbox.");
                    })
                    .catch(() => alert("Something went wrong — email us directly at hello@glafix.com"));
                });
              });
            }
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="your@email.com"
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-muted/20 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-primary text-background font-semibold text-sm hover:bg-primary/90 transition-all shrink-0"
          >
            Send me the checklist
          </button>
        </form>
        <p className="text-xs text-muted-foreground/60 mt-4">
          Unsubscribe any time. We hate spam as much as you do.
        </p>
      </div>
    </section>
  );
}

/* ─── About Strip ────────────────────────────────────────────── */

function AboutStrip() {
  return (
    <section className="py-16 border-t border-border/50 bg-muted/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center gap-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-2xl">
          🧑‍💻
        </div>
        <div>
          <p className="text-foreground leading-relaxed mb-3">
            Glafix is a one-person operation. Every tool on this site has been tested with real
            client projects and real money — we only publish what passes, and we say so when
            something falls short.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all font-medium"
          >
            About us <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Top Picks (dynamic) ─────────────────────────────────────── */

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

/* ─── Pillar Grid (dynamic) ─────────────────────────────────────── */

const CATEGORY_ICONS: Record<string, string> = {
  Reviews: "⭐",
  Tutorials: "📚",
  "Case Studies": "🏗️",
  Tools: "🔗",
  News: "📣",
};

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

/* ─── Why Trust Us ───────────────────────────────────────────── */

const TRUST_SIGNALS = [
  {
    icon: FlaskConical,
    label: "Real-world tested",
    detail: "Every tool is tested on live projects before we recommend it.",
  },
  {
    icon: ShieldCheck,
    label: "Disclosed affiliates only",
    detail: "We only promote tools we'd pay for ourselves. Affiliate relationships are always disclosed.",
  },
  {
    icon: CheckCircle,
    label: "Updated regularly",
    detail: "Pricing, features, and rankings are reviewed every quarter.",
  },
  {
    icon: Star,
    label: "No paid placements",
    detail: "Vendors cannot pay to appear in our rankings. Period.",
  },
];

function WhyTrustUs() {
  return (
    <section className="py-20 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Why Trust Glafix
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-foreground mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              An independent voice, not a vendor mouthpiece.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Glafix exists because most &ldquo;best tools&rdquo; listicles are written by people who have
              never run an actual business with those tools. Every review here starts with a real
              use case, a real budget, and a real result.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              When we earn a commission from a link, we say so. When a tool disappoints, we say
              that too — even if it means losing affiliate revenue.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
              >
                About the team
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
              >
                How we test
              </Link>
              <Link
                href="/disclosure"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
              >
                Affiliate disclosure
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {TRUST_SIGNALS.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-xl p-5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <Icon className="w-5 h-5 text-primary mb-3" />
                <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */

function HomeContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [topPickPosts, setTopPickPosts] = useState<Post[]>([]);
  const [pillarPosts, setPillarPosts] = useState<Post[]>([]);

  useEffect(() => {
    getFeaturedPost()
      .then((post) => setFeaturedPost(post))
      .catch(() => setFeaturedPost(null))
      .finally(() => setHeroLoading(false));
  }, []);

  useEffect(() => {
    getHomepageConfig().then(async (config) => {
      const [picks, pillars] = await Promise.all([
        getPostsByIds(config.topPicks),
        getPostsByIds(config.pillars),
      ]);
      setTopPickPosts(picks);
      setPillarPosts(pillars);
    }).catch(() => {});
  }, []);

  const activeCategory = category ?? "All";
  const gridCategory =
    category && category !== "All" ? (category as PostCategory) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* 1. Hero */}
      {heroLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <HeroSkeleton />
        </div>
      ) : (
        <HeroSection featuredPost={featuredPost} />
      )}

      {/* 2. Cited-By strip */}
      <CitedByStrip />

      {/* 3. Top Picks (admin-managed) */}
      <TopPicks posts={topPickPosts} />

      {/* 4. Latest Reviews */}
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
        <PostGrid
          category={gridCategory}
          excludeSlug={featuredPost?.slug}
          pageSize={9}
        />
      </section>

      {/* 5. Pillar Grid (admin-managed) */}
      <PillarGrid posts={pillarPosts} />

      {/* 6. Newsletter Signup */}
      <NewsletterSignup />

      {/* 7. About Strip */}
      <AboutStrip />

      {/* 8. Why Trust Us */}
      <WhyTrustUs />

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
