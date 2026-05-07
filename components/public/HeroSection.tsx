"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/utils";

interface HeroSectionProps {
  featuredPost: Post | null;
}

export function HeroSection({ featuredPost }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-20 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.769 0.188 70.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.769 0.188 70.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.769 0.188 70.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline block */}
        <div className="max-w-4xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-semibold uppercase tracking-[0.18em]">
              AI Tools · Automation · No-Code
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-[1.08] tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Scale Your One-Person Business with AI.
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
            Hand-tested AI and no-code tools to help you do more with less. Run lean, ship
            faster, and keep the profits.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/best-ai-tools-2026"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary text-background font-semibold text-sm hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 group"
            >
              See Our AI Stack 2026
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/category/Reviews"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground text-sm font-medium hover:border-primary/40 hover:text-primary transition-all duration-200"
            >
              Browse Reviews
            </Link>
          </div>
        </div>

        {/* Featured post card */}
        {featuredPost && (
          <div className="mt-16 animate-fade-in-up animation-delay-200">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-primary/40" />
              Featured Review
            </p>
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div
                className={`relative grid gap-0 rounded-xl overflow-hidden border border-border gold-border-glow transition-all duration-500 ${
                  featuredPost.featuredImage ? "lg:grid-cols-2" : ""
                }`}
              >
                {featuredPost.featuredImage && (
                  <div className="relative h-64 lg:h-auto lg:min-h-[420px] overflow-hidden">
                    <Image
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60 hidden lg:block" />
                  </div>
                )}
                <div className="bg-card p-8 lg:p-12 flex flex-col justify-center">
                  <Badge
                    variant="outline"
                    className="self-start mb-4 border-primary/40 text-primary text-xs uppercase tracking-wider"
                  >
                    {featuredPost.category}
                  </Badge>
                  <h2
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors duration-300"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {featuredPost.readTime} min read
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {formatDate(featuredPost.publishedAt)}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    Read full review <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
