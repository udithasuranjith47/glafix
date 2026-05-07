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
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.769 0.188 70.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.769 0.188 70.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up">
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            High-Ticket AI SaaS Analysis
          </p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Glafix
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
            Deep-dive reviews, build tutorials, and case studies on the AI SaaS
            tools transforming how elite operators run their businesses.
          </p>
        </div>

        {featuredPost && (
          <div className="animate-fade-in-up animation-delay-200">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
              Featured
            </p>
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="relative grid lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-border gold-border-glow transition-all duration-500">
                {featuredPost.featuredImage && (
                  <div className="relative h-64 lg:h-auto lg:min-h-[400px] overflow-hidden">
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
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
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
                    Read full story
                    <ArrowRight className="w-4 h-4" />
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
