"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, CheckCircle, Check } from "lucide-react";
import { getAiStack, AiStackEntry } from "@/lib/firestore";

/* ─── Persona definitions ─────────────────────────────────────── */

const PERSONAS = [
  {
    id: "all",
    label: "Everyone",
    icon: "🌐",
    desc: "Show the complete AI stack",
  },
  {
    id: "Small Business",
    label: "Small Business",
    icon: "🏪",
    desc: "Running a team, managing clients, growing revenue",
  },
  {
    id: "Solopreneur",
    label: "Solopreneur",
    icon: "🚀",
    desc: "One-person business wearing all hats",
  },
  {
    id: "Freelancer",
    label: "Freelancer",
    icon: "💼",
    desc: "Client work, proposals, and delivery",
  },
  {
    id: "Content Creator",
    label: "Content Creator",
    icon: "🎬",
    desc: "YouTube, blog, social media, newsletters",
  },
  {
    id: "Agency / Team",
    label: "Agency / Team",
    icon: "🏢",
    desc: "Client delivery at scale with a team",
  },
  {
    id: "Developer",
    label: "Developer",
    icon: "💻",
    desc: "Code faster and automate repetitive tasks",
  },
  {
    id: "Student",
    label: "Student",
    icon: "🎓",
    desc: "Essays, research, presentations, productivity",
  },
] as const;

type PersonaId = (typeof PERSONAS)[number]["id"];

/* ─── Persona selector ────────────────────────────────────────── */

function PersonaSelector({
  active,
  onChange,
}: {
  active: PersonaId;
  onChange: (id: PersonaId) => void;
}) {
  return (
    <div className="mb-14">
      <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
        Find Your Stack
      </p>
      <h2
        className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Who are you building for?
      </h2>
      <p className="text-muted-foreground text-sm mb-8">
        Pick your situation — we&apos;ll highlight the tools that matter most for you.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PERSONAS.map((p) => {
          const isActive = active === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`relative group flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-200 ${
                isActive
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              {isActive && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-background" />
                </span>
              )}
              <span className="text-2xl mb-2">{p.icon}</span>
              <span
                className={`text-xs font-bold mb-1 ${
                  isActive ? "text-primary" : "text-foreground"
                }`}
              >
                {p.label}
              </span>
              <span className="text-[10px] text-muted-foreground leading-snug hidden sm:block">
                {p.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Tool card ───────────────────────────────────────────────── */

function ToolCard({ cat }: { cat: AiStackEntry }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
      {/* Header */}
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
            <p className="text-sm font-semibold text-foreground">
              Winner: {cat.winner}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-sm font-bold text-primary">{cat.score}</span>
          </div>
          {cat.audiences?.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {cat.audiences.map((a) => (
                <span
                  key={a}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-muted/40 border border-border text-muted-foreground uppercase tracking-wide"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {cat.verdict}
        </p>

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
          <span className="text-xs text-muted-foreground/60">
            Runner-up: {cat.runnerUp}
          </span>
          <Link
            href={cat.href}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:gap-2.5 transition-all font-medium"
          >
            Full comparison <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

export function AiStackContent() {
  const [entries, setEntries] = useState<AiStackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [persona, setPersona] = useState<PersonaId>("all");

  useEffect(() => {
    getAiStack()
      .then((data) => setEntries(data.sort((a, b) => a.rank - b.rank)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    persona === "all"
      ? entries
      : entries.filter(
          (e) => !e.audiences?.length || e.audiences.includes(persona)
        );

  const activePersona = PERSONAS.find((p) => p.id === persona)!;

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl overflow-hidden animate-pulse"
          >
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
        <p className="text-sm">
          The admin is still setting up this page — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PersonaSelector active={persona} onChange={setPersona} />

      {/* Results header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {persona === "all" ? (
              <>Showing all <span className="text-foreground font-medium">{entries.length}</span> tools</>
            ) : (
              <>
                <span className="text-foreground font-medium">{filtered.length}</span> tool{filtered.length !== 1 ? "s" : ""} matched for{" "}
                <span className="text-primary font-medium">
                  {activePersona.icon} {activePersona.label}
                </span>
              </>
            )}
          </p>
        </div>
        {persona !== "all" && (
          <button
            onClick={() => setPersona("all")}
            className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
          >
            Show all
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl text-muted-foreground">
          <p className="text-2xl mb-3">{activePersona.icon}</p>
          <p className="font-medium mb-1">No tools tagged for {activePersona.label} yet.</p>
          <p className="text-sm">Check back soon — or view the full stack.</p>
          <button
            onClick={() => setPersona("all")}
            className="mt-4 text-sm text-primary underline underline-offset-2"
          >
            Show all tools →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((cat) => (
            <ToolCard key={cat.id} cat={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
