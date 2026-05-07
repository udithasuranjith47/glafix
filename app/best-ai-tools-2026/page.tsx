import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { AiStackContent } from "@/components/public/AiStackContent";

export const metadata: Metadata = {
  title: { absolute: "Best AI Tools 2026 — The Solo Operator Stack | Glafix" },
  description:
    "The definitive guide to the AI, automation, and no-code tools solo operators use to replace entire teams and run 7-figure businesses in 2026. Independently tested and reviewed.",
};

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
            Every category. Every winner. All independently tested on real projects. This is the
            exact stack we use to run a one-person operation without a full-time team.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground border-t border-border pt-6">
            <span><strong className="text-foreground">30+</strong> tools tested</span>
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

      {/* Dynamic tool cards */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AiStackContent />

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
