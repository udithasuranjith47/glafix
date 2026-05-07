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
import { getFeaturedPost } from "@/lib/firestore";
import { Post, PostCategory } from "@/types/post";

/* ─── Cited-By strip ─────────────────────────────────────────── */

const AI_ENGINES = [
  { name: "Perplexity AI", glyph: "P" },
  { name: "Bing Copilot", glyph: "B" },
  { name: "ChatGPT", glyph: "G" },
  { name: "Google AI", glyph: "G" },
  { name: "Claude", glyph: "C" },
];

function CitedByStrip() {
  return (
    <div className="border-y border-border/50 bg-card/30 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </div>
  );
}

/* ─── Top Picks 2026 ─────────────────────────────────────────── */

const TOP_PICKS = [
  {
    badge: "All-in-One CRM & Funnels",
    title: "Best AI Marketing Platform",
    description:
      "We tested every major funnel-builder, CRM, and email platform so you don't have to. One stack to replace your whole marketing team.",
    href: "/best-ai-tools-2026",
    tag: "GoHighLevel vs ClickFunnels 2.0",
  },
  {
    badge: "Long-Form AI Writing",
    title: "Best AI Writer 2026",
    description:
      "Side-by-side test of every major AI writing tool on real client projects. Which one actually ships publishable content, and which one needs a full edit?",
    href: "/best-ai-tools-2026",
    tag: "Jasper vs Claude vs ChatGPT",
  },
  {
    badge: "No-Code + Automation",
    title: "Best No-Code Stack",
    description:
      "The exact no-code + automation stack we use to run a 7-figure operation with zero in-house developers. Tested across 200+ workflows.",
    href: "/best-ai-tools-2026",
    tag: "Make vs Zapier vs n8n",
  },
];

function TopPicks() {
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
          {TOP_PICKS.map((pick) => (
            <Link key={pick.title} href={pick.href} className="group block">
              <div className="h-full bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
                {/* Gold top border */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-primary border border-primary/30 rounded px-2 py-0.5 mb-4">
                  {pick.badge}
                </span>

                <h3
                  className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {pick.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {pick.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/60 font-mono">{pick.tag}</span>
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

const PILLARS = [
  {
    icon: "⚡",
    title: "Best AI Tools 2026",
    description: "The master list. Every category, every top pick, ranked.",
    href: "/best-ai-tools-2026",
    hot: true,
  },
  {
    icon: "✍️",
    title: "Best AI Writers & Copywriting Tools",
    description: "Long-form, emails, ads — which AI actually writes at a professional level?",
    href: "/best-ai-tools-2026",
  },
  {
    icon: "🏗️",
    title: "Best No-Code App Builders",
    description: "Ship products without engineers. Webflow, Framer, Bubble compared.",
    href: "/best-ai-tools-2026",
  },
  {
    icon: "📣",
    title: "Best AI Marketing & CRM Platforms",
    description: "GoHighLevel, HubSpot, ClickFunnels — which earns its keep?",
    href: "/best-ai-tools-2026",
  },
  {
    icon: "🔗",
    title: "Best Automation Tools",
    description: "Make vs Zapier vs n8n — tested across 200+ real client workflows.",
    href: "/best-ai-tools-2026",
  },
  {
    icon: "🎬",
    title: "Best AI Video & Content Creation",
    description: "Synthesia, HeyGen, Runway — the AI video stack for solo operators.",
    href: "/best-ai-tools-2026",
  },
];

function PillarGrid() {
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
          {PILLARS.map((p) => (
            <Link key={p.title} href={p.href} className="group block">
              <div className="h-full bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 flex gap-4">
                <span className="text-2xl shrink-0 mt-0.5">{p.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    {p.hot && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-background bg-primary rounded px-1.5 py-0.5">
                        Hot
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
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
          {/* Left — founder note */}
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

          {/* Right — trust signals */}
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

  useEffect(() => {
    getFeaturedPost()
      .then((post) => setFeaturedPost(post))
      .catch(() => setFeaturedPost(null))
      .finally(() => setHeroLoading(false));
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

      {/* 3. Top Picks 2026 */}
      <TopPicks />

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

      {/* 5. Pillar Grid */}
      <PillarGrid />

      {/* 6. Why Trust Us */}
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
