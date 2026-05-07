import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Star, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: { absolute: "Best AI Tools 2026 — The Solo Operator Stack | Glafix" },
  description:
    "The definitive guide to the AI, automation, and no-code tools solo operators use to replace entire teams and run 7-figure businesses in 2026. Independently tested and reviewed.",
};

const CATEGORIES = [
  {
    rank: 1,
    category: "All-in-One Marketing & CRM",
    winner: "GoHighLevel",
    runnerUp: "ClickFunnels 2.0",
    verdict:
      "The single best platform for solo operators who need funnels, CRM, email, SMS, and automation under one login. Replaces 5–8 separate SaaS subscriptions.",
    pros: ["Unlimited sub-accounts", "White-label ready", "Built-in automation"],
    href: "/category/Reviews",
    score: 9.4,
  },
  {
    rank: 2,
    category: "AI Writing & Long-Form Content",
    winner: "Claude (Anthropic)",
    runnerUp: "Jasper AI",
    verdict:
      "Consistently outperforms GPT-4 on nuanced long-form content, analysis, and brand-voice consistency. The go-to for content teams replacing human writers.",
    pros: ["200K context window", "Superior instruction-following", "Best for analysis"],
    href: "/category/Reviews",
    score: 9.2,
  },
  {
    rank: 3,
    category: "Workflow Automation",
    winner: "Make (formerly Integromat)",
    runnerUp: "Zapier",
    verdict:
      "More powerful than Zapier at a fraction of the cost. The visual scenario builder handles complex multi-step automations that Zapier Zaps can't match.",
    pros: ["Visual flow builder", "10x cheaper at scale", "Error handling built-in"],
    href: "/category/Tools",
    score: 9.1,
  },
  {
    rank: 4,
    category: "No-Code Website & App Builder",
    winner: "Webflow",
    runnerUp: "Framer",
    verdict:
      "The industry standard for design-quality no-code sites. Steep learning curve but the output looks hand-coded. Framer is faster to launch but less flexible.",
    pros: ["CMS built-in", "Native hosting", "Full design control"],
    href: "/category/Tools",
    score: 8.9,
  },
  {
    rank: 5,
    category: "AI Video Creation",
    winner: "HeyGen",
    runnerUp: "Synthesia",
    verdict:
      "HeyGen's avatar quality is now at a level where viewers don't immediately clock it as AI. Best for explainer videos, product demos, and onboarding content.",
    pros: ["Photorealistic avatars", "50+ languages", "API access"],
    href: "/category/Reviews",
    score: 8.7,
  },
  {
    rank: 6,
    category: "SEO & Content Research",
    winner: "Ahrefs",
    runnerUp: "Semrush",
    verdict:
      "The most accurate backlink database in the industry. Solo operators who publish content regularly will recoup the subscription cost in the first month.",
    pros: ["Best backlink data", "Content Gap tool", "Rank Tracker"],
    href: "/category/Tools",
    score: 8.8,
  },
];

export default function BestAiToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.769 0.188 70.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.769 0.188 70.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5">
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.18em]">
              Updated May 2026
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            The Best AI Tools for Solo Operators in 2026
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
            Six categories. Six winners. All independently tested on real projects. This is the
            exact stack we use to run a 7-figure operation without a full-time team.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground border-t border-border pt-6">
            <span><strong className="text-foreground">30+</strong> tools tested</span>
            <span><strong className="text-foreground">6</strong> categories covered</span>
            <span><strong className="text-foreground">90 days</strong> of testing per tool</span>
            <span><strong className="text-foreground">0</strong> paid placements</span>
          </div>
        </div>
      </section>

      {/* Affiliate disclosure banner */}
      <div className="border-y border-border/50 bg-muted/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Disclosure:</strong> Some links on this page are
            affiliate links. If you purchase through them, we earn a commission at no cost to you.
            This does not influence our ratings.{" "}
            <Link href="/disclosure" className="underline underline-offset-2 hover:text-primary transition-colors">
              Full disclosure →
            </Link>
          </p>
        </div>
      </div>

      {/* Tool cards */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.rank}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/10">
                <div className="flex items-center gap-3">
                  <span
                    className="text-2xl font-bold text-primary/30"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    #{cat.rank}
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {cat.category}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      Winner: {cat.winner}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                  <span className="text-sm font-bold text-primary">{cat.score}</span>
                </div>
              </div>

              {/* Card body */}
              <div className="px-6 py-5">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{cat.verdict}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {cat.pros.map((pro) => (
                    <span
                      key={pro}
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2.5 py-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {pro}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/60">
                    Runner-up: {cat.runnerUp}
                  </span>
                  <Link
                    href={cat.href}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all font-medium"
                  >
                    Full comparison <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 bg-card border border-border rounded-xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <h2
            className="text-2xl font-bold text-foreground mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Want the full breakdown?
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Each tool above has a dedicated review with real benchmarks, pricing analysis, and a
            verdict on whether the ROI stacks up.
          </p>
          <Link
            href="/category/Reviews"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-background font-semibold text-sm hover:bg-primary/90 transition-all"
          >
            Browse all reviews <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
