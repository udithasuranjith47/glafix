import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: { absolute: "Affiliate Disclosure — Glafix" },
  description: "Full FTC affiliate disclosure for Glafix. We earn commissions from some links — here's exactly how that works.",
};

export default function DisclosurePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <div className="mb-10">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Legal
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-foreground mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Affiliate Disclosure
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12" />

        <div className="prose-blog space-y-8">
          <section>
            <h2 style={{ fontFamily: "var(--font-playfair)" }}>What this disclosure covers</h2>
            <p>
              In accordance with the U.S. Federal Trade Commission (FTC) guidelines (16 CFR Part
              255), Glafix discloses its material connections to product and service vendors.
            </p>
            <p>
              Glafix participates in affiliate marketing programmes. This means that when you click
              certain links on this site and subsequently make a purchase, Glafix may receive a
              commission from the vendor. This commission comes at <strong>no additional cost to
              you</strong>.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "var(--font-playfair)" }}>How affiliate links are marked</h2>
            <p>
              Affiliate links on Glafix are labelled using one or more of the following conventions:
            </p>
            <ul>
              <li>The notation <strong>(affiliate link)</strong> appearing next to the link</li>
              <li>A disclosure statement at the top of any article containing affiliate links</li>
              <li>The statement <em>&quot;This post contains affiliate links&quot;</em> in the article header</li>
            </ul>
            <p>
              Tool comparison pages and review pages almost always contain affiliate links. When you
              see a &ldquo;Visit Site&rdquo;, &ldquo;Try Free&rdquo;, or &ldquo;Get Started&rdquo; button, assume it is an
              affiliate link unless stated otherwise.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "var(--font-playfair)" }}>Our promise: commissions don&apos;t buy rankings</h2>
            <p>
              Affiliate commissions do not influence our ratings, rankings, or editorial recommendations.
              We have given low ratings — and maintained them — to tools that offer generous
              affiliate commissions. We have recommended tools with no affiliate programme at all
              when they were genuinely the best option.
            </p>
            <p>
              Vendors cannot pay to appear in our &ldquo;Top Pick&rdquo; or &ldquo;Best Of&rdquo; lists. Editorial
              placement is determined solely by the criteria published on our{" "}
              <a href="/methodology">methodology page</a>.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "var(--font-playfair)" }}>Current affiliate relationships</h2>
            <p>
              We currently participate in affiliate programmes with a number of software vendors in
              the AI, automation, CRM, and no-code categories. A full and current list is
              maintained internally and updated when new relationships are established. You can
              request this list by contacting us at{" "}
              <a href="/contact">our contact page</a>.
            </p>
            <p>
              All active affiliate relationships are disclosed either in the individual article or
              in this document.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "var(--font-playfair)" }}>Testimonials and results</h2>
            <p>
              Any income or result figures mentioned on this site represent individual experiences
              and are not guarantees of what you will achieve. Results vary based on effort,
              experience, market conditions, and other factors.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "var(--font-playfair)" }}>Questions</h2>
            <p>
              If you have questions about this disclosure or our affiliate relationships, please
              contact us through our <a href="/contact">contact page</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
