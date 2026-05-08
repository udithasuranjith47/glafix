"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/public/SearchBar";

const categoryLinks = [
  { label: "Reviews",        href: "/category/Reviews" },
  { label: "Roundups",       href: "/category/Roundups" },
  { label: "How-To",         href: "/category/How-To" },
  { label: "Pricing & News", href: "/category/Pricing%20%26%20News" },
  { label: "Case Studies",   href: "/category/Case%20Studies" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Desktop: top row — Logo + Search + CTA ──────────── */}
        <div className="hidden lg:flex items-center gap-6 h-16">
          <Link href="/" className="flex items-center group shrink-0">
            <Logo size={22} textOnly className="group-hover:opacity-80 transition-opacity" />
          </Link>

          <div className="flex-1 flex justify-center">
            <SearchBar className="w-full max-w-md" />
          </div>

          <Link
            href="/best-ai-tools-2026"
            className="shrink-0 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            AI Stack 2026
          </Link>
        </div>

        {/* ── Desktop: category row ────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-7 h-10 border-t border-border/40">
          {categoryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Mobile: top row ─────────────────────────────────── */}
        <div className="lg:hidden flex items-center justify-between h-14">
          <Link href="/" className="flex items-center">
            <Logo size={18} textOnly />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/best-ai-tools-2026"
              className="text-xs font-semibold text-primary"
            >
              AI Stack 2026
            </Link>
            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="lg:hidden pb-3">
          <SearchBar className="w-full" />
        </div>
      </div>

      {/* Mobile nav menu */}
      {menuOpen && (
        <div className="lg:hidden bg-card border-b border-border">
          <nav className="flex flex-col px-4 py-4 gap-3">
            {categoryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
