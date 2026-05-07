"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, CheckCircle } from "lucide-react";
import { getAiStack, AiStackEntry } from "@/lib/firestore";

export function AiStackContent() {
  const [entries, setEntries] = useState<AiStackEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAiStack()
      .then((data) => setEntries(data.sort((a, b) => a.rank - b.rank)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
            <div className="h-16 bg-muted/20 border-b border-border" />
            <div className="p-6 space-y-3">
              <div className="h-3 bg-muted/30 rounded w-3/4" />
              <div className="h-3 bg-muted/30 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <p className="text-lg font-medium mb-2">Nothing here yet.</p>
        <p className="text-sm">The admin is still setting up this page — check back soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {entries.map((cat) => (
        <div
          key={cat.id}
          className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
        >
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/10">
            <div className="flex items-center gap-3">
              <span
                className="text-2xl font-bold text-primary/30"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                #{cat.rank}
              </span>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {cat.category}
                </p>
                <p className="text-sm font-semibold text-foreground">Winner: {cat.winner}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
              <span className="text-sm font-bold text-primary">{cat.score}</span>
            </div>
          </div>

          {/* Card body */}
          <div className="px-6 py-5">
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{cat.verdict}</p>

            {cat.pros.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {cat.pros.filter(Boolean).map((pro) => (
                  <span
                    key={pro}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2.5 py-1"
                  >
                    <CheckCircle className="w-3 h-3" />
                    {pro}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground/60">Runner-up: {cat.runnerUp}</span>
              <Link
                href={cat.href}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all font-medium"
              >
                Full comparison <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
