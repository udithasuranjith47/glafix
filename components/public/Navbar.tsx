"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";

const navLinks = [
  { label: "AI Stack 2026", href: "/best-ai-tools-2026", highlight: true },
  { label: "Reviews", href: "/category/Reviews" },
  { label: "Tutorials", href: "/category/Tutorials" },
  { label: "Case Studies", href: "/category/Case%20Studies" },
  { label: "Tools", href: "/category/Tools" },
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
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size={28} className="group-hover:opacity-80 transition-opacity" />
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Glafix
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.highlight
                    ? "text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
                    : "text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-card border-b border-border">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.highlight
                    ? "text-sm font-semibold text-primary"
                    : "text-sm text-muted-foreground hover:text-primary transition-colors"
                }
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
