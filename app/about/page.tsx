import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "About Glafix — Independent AI Tool Reviews" },
  description:
    "Glafix publishes independent, real-world reviews of AI, automation, and no-code tools for solo operators running 7-figure businesses.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        {/* Header */}
        <div className="mb-14">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            About
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-foreground mb-5 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Built by operators, for operators.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Glafix is an independent publication covering the AI, automation, and no-code tools
            that solo operators actually use to build and scale 7-figure businesses without large
            teams.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-14" />

        {/* Who we are */}
        <section className="mb-12 prose-blog">
          <h2 style={{ fontFamily: "var(--font-playfair)" }}>Who writes here</h2>
          <p>
            Every article on Glafix is written by someone who has paid for and used the tool being
            reviewed — on real projects, with real money on the line. We don&apos;t publish
            summaries of vendor documentation or re-spun press releases.
          </p>
          <p>
            Our editorial focus is tight: AI writing, automation, no-code builders, CRM &amp; funnel
            platforms, and the operational stack that powers modern lean businesses. If a tool
            doesn&apos;t directly help a solo operator make or save money, we don&apos;t cover it.
          </p>

          <h2 style={{ fontFamily: "var(--font-playfair)" }}>Our editorial independence</h2>
          <p>
            Vendors cannot pay to appear in our rankings, comparisons, or &quot;top pick&quot;
            lists. We participate in affiliate programmes — if you buy through one of our links we
            may earn a commission at no cost to you — but affiliate relationships are disclosed on
            every relevant page and have no influence on our ratings.
          </p>
          <p>
            If a tool earns a low rating, it keeps that rating regardless of whether the vendor
            offers affiliate commissions. We have declined affiliate deals from tools we couldn&apos;t
            recommend honestly.
          </p>

          <h2 style={{ fontFamily: "var(--font-playfair)" }}>E-E-A-T signals</h2>
        </section>

        {/* Trust checklist */}
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {[
            "Every tool is tested on live projects before publication",
            "Affiliate relationships are disclosed on every page",
            "Negative findings are published even when they hurt commissions",
            "Pricing and rankings are reviewed and updated quarterly",
            "We cite primary sources: vendor documentation, independent benchmarks",
            "No sponsored content is published without a clear sponsorship label",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
          >
            Read our methodology →
          </Link>
          <Link
            href="/disclosure"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
          >
            Affiliate disclosure →
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
          >
            Contact us →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
