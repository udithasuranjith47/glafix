"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/public/SearchBar";

const navLinks = [
  { label: "AI Stack 2026", href: "/best-ai-tools-2026", highlight: true },
  { label: "Reviews", href: "/category/Reviews" },
  { label: "Tutorials", href: "/category/Tutorials" },
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
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Desktop row ────────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-6 h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0">
            <Logo size={48} className="group-hover:opacity-80 transition-opacity rounded-lg" />
          </Link>

          {/* Search bar — centered, takes remaining space */}
          <div className="flex-1 flex justify-center">
            <SearchBar className="w-full max-w-md" />
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-6 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.highlight
                    ? "text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    : "text-sm text-muted-foreground hover:text-primary transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Mobile row ──────────────────────────────────────── */}
        <div className="lg:hidden flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Logo size={40} className="rounded-md" />
          </Link>
          <button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile search bar — always visible below the logo row */}
        <div className="lg:hidden pb-3">
          <SearchBar className="w-full" />
        </div>
      </div>

      {/* Mobile nav menu */}
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
