import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo size={20} />
              <span
                className="font-bold text-foreground"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Glafix
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deep analysis and reviews of high-ticket AI SaaS products for
              founders, operators, and investors.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2">
              {["Reviews", "Tutorials", "Case Studies", "Tools", "News"].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      href={`/category/${cat}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Published by
            </h4>
            <p className="text-sm text-muted-foreground">
              Glafix is an independent publication dedicated to
              cutting through the noise in AI SaaS.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Glafix. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for founders who move fast.
          </p>
        </div>
      </div>
    </footer>
  );
}
