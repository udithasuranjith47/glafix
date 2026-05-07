"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { getSearchablePosts, PostMeta } from "@/lib/firestore";

// Module-level cache — fetched once per session
let postsCache: PostMeta[] | null = null;

async function loadPosts(): Promise<PostMeta[]> {
  if (postsCache) return postsCache;
  postsCache = await getSearchablePosts();
  return postsCache;
}

interface SearchResult extends PostMeta {}

export function SearchBar({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-load published post metadata once
  useEffect(() => {
    loadPosts().then(setPosts).catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // Debounced AI search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setOpen(true);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, posts }),
        });
        const data = await res.json();
        const slugs: string[] = data.results ?? [];
        const matched = slugs
          .map((slug) => posts.find((p) => p.slug === slug))
          .filter(Boolean) as SearchResult[];
        setResults(matched);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [query, posts]);

  function clear() {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
          open || query
            ? "border-primary/50 bg-background shadow-md shadow-primary/5"
            : "border-border bg-muted/20 hover:border-border/80"
        }`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
        ) : (
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length) setOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === "Escape") clear();
          }}
          placeholder="Search AI tools, reviews…"
          className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
        {query && (
          <button
            onClick={clear}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-[60]">
          {loading && results.length === 0 && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              AI is searching…
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <div className="px-4 py-4 text-sm text-muted-foreground text-center">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {results.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              onClick={() => { setOpen(false); setQuery(""); }}
              className={`flex flex-col gap-1 px-4 py-3 hover:bg-muted/40 transition-colors ${
                i > 0 ? "border-t border-border/50" : ""
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 rounded px-1.5 py-0.5 shrink-0">
                  {post.category}
                </span>
                <span className="text-sm font-medium text-foreground truncate">{post.title}</span>
              </div>
              {post.excerpt && (
                <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
              )}
            </Link>
          ))}

          {results.length > 0 && (
            <div className="px-4 py-2 border-t border-border/50 bg-muted/10">
              <p className="text-[10px] text-muted-foreground/60">Ranked by AI relevance · gpt-4o-mini</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
