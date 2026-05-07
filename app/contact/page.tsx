import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Mail, MessageSquare, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Contact Glafix" },
  description: "Get in touch with the Glafix team for editorial enquiries, tool review suggestions, or press.",
};

const REASONS = [
  {
    icon: FileText,
    title: "Tool review request",
    description:
      "Suggest an AI, automation, or no-code tool you'd like us to review. Include the tool name, your use case, and why you think it deserves coverage.",
  },
  {
    icon: MessageSquare,
    title: "Editorial / corrections",
    description:
      "Found an error in pricing, a broken link, or outdated information? Let us know and we'll update within 48 hours.",
  },
  {
    icon: Mail,
    title: "Press & media",
    description:
      "For press enquiries, interview requests, or data citation permissions, email us directly with your publication and deadline.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        <div className="mb-12">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Get in Touch
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-foreground mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Contact
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            No contact form — just a real email. We respond to every message.
          </p>
        </div>

        {/* Email CTA */}
        <div className="mb-12 p-6 bg-card border border-border rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Email us at</p>
          <a
            href="mailto:hello@glafix.com"
            className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            hello@glafix.com
          </a>
          <p className="text-sm text-muted-foreground mt-2">
            Typical response time: within 24 hours on business days.
          </p>
        </div>

        {/* Reason cards */}
        <div className="space-y-4 mb-12">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">
            What to include in your message
          </p>
          {REASONS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4 p-5 bg-card border border-border rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground/60 leading-relaxed pt-6 border-t border-border">
          Vendor outreach, link exchange requests, and unsolicited sponsored content pitches are
          not answered. If you are a vendor and would like your tool reviewed, it goes through the
          same process as any other tool request — we decide whether to cover it independently.
        </div>
      </main>

      <Footer />
    </div>
  );
}
