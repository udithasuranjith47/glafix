import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo size={20} />
              <span
                className="font-bold text-foreground"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Glafix
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Independent reviews, real-world tests, and side-by-side comparisons of the AI,
              automation, and no-code tools built for solo operators.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-4 leading-relaxed max-w-xs">
              Glafix participates in affiliate programmes. Some links may earn us a commission at
              no cost to you.{" "}
              <Link href="/disclosure" className="underline underline-offset-2 hover:text-primary transition-colors">
                Full disclosure →
              </Link>
            </p>
          </div>

          {/* Reviews */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-4 uppercase tracking-wider">
              Categories
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Reviews",        href: "/category/Reviews" },
                { label: "Roundups",       href: "/category/Roundups" },
                { label: "How-To",         href: "/category/How-To" },
                { label: "Pricing & News", href: "/category/Pricing%20%26%20News" },
                { label: "Case Studies",   href: "/category/Case%20Studies" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-4 uppercase tracking-wider">
              Site
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "AI Stack 2026", href: "/best-ai-tools-2026" },
                { label: "About", href: "/about" },
                { label: "Methodology", href: "/methodology" },
                { label: "Disclosure", href: "/disclosure" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Glafix. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/disclosure" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Affiliate Disclosure
            </Link>
            <Link href="/methodology" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Methodology
            </Link>
            <Link href="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
