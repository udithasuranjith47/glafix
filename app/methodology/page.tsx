import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: { absolute: "How We Test AI Tools — Glafix Methodology" },
  description:
    "Glafix tests every AI, automation, and no-code tool on real projects before publishing a review. Here is exactly how we evaluate tools.",
};

const CRITERIA = [
  {
    number: "01",
    title: "Real-project testing",
    description:
      "Every tool is tested on actual client projects or internal Glafix workflows — not sandbox demos or vendor-supplied scenarios. We use the tool at the tier most operators would buy (typically a mid-tier paid plan) for a minimum of 30 days before publishing.",
  },
  {
    number: "02",
    title: "Pricing integrity check",
    description:
      "We verify the published pricing against the actual checkout price at the time of review. We note usage limits, per-seat pricing, and add-on costs that appear after sign-up. We review and update pricing quarterly.",
  },
  {
    number: "03",
    title: "Comparative benchmarking",
    description:
      "For category comparison articles (Best AI Writer, Best CRM, etc.), we test each tool on an identical brief or workflow. Results are scored against a common rubric published in the article.",
  },
  {
    number: "04",
    title: "UX and onboarding assessment",
    description:
      "We evaluate tools as a first-time user (cleared cookies, new account), time the onboarding flow, and record where we needed to consult documentation or support. Solo operators have zero tolerance for a steep learning curve.",
  },
  {
    number: "05",
    title: "Integration and API depth",
    description:
      "We test native integrations with the most common solo-operator stack: Zapier/Make, Stripe, Notion, Google Workspace, and at least one CRM. We note whether API access requires a higher tier.",
  },
  {
    number: "06",
    title: "Support quality",
    description:
      "We open at least two real support tickets during the testing period and record response time and resolution quality. AI chat-only support is noted and penalised in the support score.",
  },
  {
    number: "07",
    title: "ROI estimation",
    description:
      "For tools with quantifiable output (AI writers, automation platforms, analytics tools), we estimate the cost-per-hour-saved or cost-per-output-unit and compare it to a human freelancer rate.",
  },
  {
    number: "08",
    title: "Independence declaration",
    description:
      "Before publication, the author declares whether they have an active affiliate relationship with the vendor. This declaration is included in the article metadata. A positive affiliate relationship does not change the review criteria or weighting.",
  },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <div className="mb-10">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            How We Work
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-foreground mb-5 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Our Testing Methodology
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every review on Glafix follows an eight-point testing framework designed to answer one
            question: &ldquo;Does this tool actually help a solo operator make or save money?&rdquo;
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-14" />

        <div className="space-y-8">
          {CRITERIA.map((c) => (
            <div key={c.number} className="flex gap-6 group">
              <div className="shrink-0">
                <span
                  className="text-4xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {c.number}
                </span>
              </div>
              <div className="pt-1">
                <h2
                  className="text-lg font-bold text-foreground mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {c.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm">{c.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 bg-card border border-border rounded-xl">
          <h3 className="text-base font-semibold text-foreground mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            Suggest a tool for review
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you use a tool that hasn&apos;t been covered yet and believe it deserves a review,
            reach out. We prioritise tools with significant organic demand and no dominant existing
            review.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
          >
            Contact us →
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
