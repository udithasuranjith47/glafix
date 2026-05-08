import Link from "next/link";
import { ArrowRight, CheckCircle, ShieldCheck, FlaskConical, Star } from "lucide-react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "@/components/public/HeroSection";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import HomeClient from "./HomeClient";
import { Post, PostCategory } from "@/types/post";

/* ─── Server-side featured post fetch ───────────────────────── */

const PROJECT_ID = "glafix-32914";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function fetchFeaturedPost(): Promise<Post | null> {
  try {
    const res = await fetch(`${FIRESTORE_BASE}:runQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "posts" }],
          where: {
            compositeFilter: {
              op: "AND",
              filters: [
                {
                  fieldFilter: {
                    field: { fieldPath: "featured" },
                    op: "EQUAL",
                    value: { booleanValue: true },
                  },
                },
                {
                  fieldFilter: {
                    field: { fieldPath: "status" },
                    op: "EQUAL",
                    value: { stringValue: "published" },
                  },
                },
              ],
            },
          },
          select: {
            fields: [
              { fieldPath: "title" },
              { fieldPath: "slug" },
              { fieldPath: "excerpt" },
              { fieldPath: "category" },
              { fieldPath: "featuredImage" },
              { fieldPath: "publishedAt" },
              { fieldPath: "readTime" },
            ],
          },
          limit: 1,
        },
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;

    type FirestoreValue = {
      stringValue?: string;
      timestampValue?: string;
      integerValue?: string;
      doubleValue?: string;
    };
    const rows: Array<{
      document?: { name: string; fields: Record<string, FirestoreValue> };
    }> = await res.json();

    const doc = rows[0]?.document;
    if (!doc) return null;

    const f = doc.fields;
    const str = (k: string) => f[k]?.stringValue ?? "";
    const ts = (k: string) => f[k]?.timestampValue ?? f[k]?.stringValue ?? "";
    const num = (k: string) =>
      parseInt(f[k]?.integerValue ?? f[k]?.doubleValue ?? "1", 10);

    return {
      id: doc.name.split("/").pop() ?? "",
      title: str("title"),
      slug: str("slug"),
      excerpt: str("excerpt"),
      category: str("category") as PostCategory,
      featuredImage: str("featuredImage"),
      publishedAt: ts("publishedAt"),
      readTime: num("readTime"),
      status: "published",
      featured: true,
      content: "",
      seoTitle: "",
      seoDescription: "",
      createdAt: null,
      updatedAt: null,
    };
  } catch {
    return null;
  }
}

/* ─── Static sections ────────────────────────────────────────── */

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
      <div className="border-t border-border/40 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            &ldquo;We test every tool with our own money before recommending it. When you buy through
            our links we earn a commission at no cost to you — that&apos;s how we keep the lights on.
            We never recommend something we would not use ourselves.&rdquo;{" "}
            <Link
              href="/disclosure"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              Full disclosure →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

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
        <NewsletterForm />
      </div>
    </section>
  );
}

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

const TRUST_SIGNALS = [
  {
    icon: FlaskConical,
    label: "Real-world tested",
    detail: "Every tool is tested on live projects before we recommend it.",
  },
  {
    icon: ShieldCheck,
    label: "Disclosed affiliates only",
    detail:
      "We only promote tools we'd pay for ourselves. Affiliate relationships are always disclosed.",
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

/* ─── Page ───────────────────────────────────────────────────── */

export default async function HomePage() {
  const featuredPost = await fetchFeaturedPost();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* H1 headline + featured post card — fully server-rendered */}
      <HeroSection featuredPost={featuredPost} />

      {/* Trust strip — static, server-rendered */}
      <CitedByStrip />

      {/* Dynamic: TopPicks, PostGrid, PillarGrid — client islands */}
      <HomeClient excludeSlug={featuredPost?.slug} />

      {/* Static footer sections — server-rendered */}
      <NewsletterSignup />
      <AboutStrip />
      <WhyTrustUs />
      <Footer />
    </div>
  );
}
