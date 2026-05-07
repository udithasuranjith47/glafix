"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, Home, LayoutGrid, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllPosts, getHomepageConfig, setHomepageConfig } from "@/lib/firestore";
import { Post } from "@/types/post";

const MAX_TOP_PICKS = 3;
const MAX_PILLARS = 6;

export default function HomepagePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [topPicks, setTopPicks] = useState<string[]>([]);
  const [pillars, setPillars] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.allSettled([getAllPosts(), getHomepageConfig()]).then(([postsResult, configResult]) => {
      if (postsResult.status === "fulfilled") {
        setPosts(postsResult.value);
      } else {
        toast.error("Failed to load posts");
      }
      if (configResult.status === "fulfilled") {
        setTopPicks(configResult.value.topPicks);
        setPillars(configResult.value.pillars);
      }
      setLoading(false);
    });
  }, []);

  function toggleSection(
    id: string,
    current: string[],
    setter: (v: string[]) => void,
    max: number
  ) {
    if (current.includes(id)) {
      setter(current.filter((x) => x !== id));
    } else if (current.length < max) {
      setter([...current, id]);
    } else {
      toast.error(`Maximum ${max} posts allowed in this section`);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await setHomepageConfig({ topPicks, pillars });
      toast.success("Homepage updated");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
              Homepage Sections
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Choose which published posts appear in each homepage section.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      {/* Top Picks */}
      <Section
        icon={<Star className="w-4 h-4 text-primary" />}
        title="Editor's Top Picks"
        subtitle={`Select up to ${MAX_TOP_PICKS} posts. These appear as the featured cards below the hero.`}
        count={topPicks.length}
        max={MAX_TOP_PICKS}
        posts={posts}
        selected={topPicks}
        onToggle={(id) => toggleSection(id, topPicks, setTopPicks, MAX_TOP_PICKS)}
      />

      {/* Pillars */}
      <Section
        icon={<LayoutGrid className="w-4 h-4 text-primary" />}
        title="The Money Pages (Pillar Grid)"
        subtitle={`Select up to ${MAX_PILLARS} posts. These appear in the comparison grid further down the page.`}
        count={pillars.length}
        max={MAX_PILLARS}
        posts={posts}
        selected={pillars}
        onToggle={(id) => toggleSection(id, pillars, setPillars, MAX_PILLARS)}
      />

      {posts.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No posts yet. Create and publish a post first.
        </div>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  subtitle,
  count,
  max,
  posts,
  selected,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  count: number;
  max: number;
  posts: Post[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {count}/{max}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>

      <div className="space-y-2">
        {posts.map((post) => {
          const isPublished = post.status === "published";
          const isSelected = selected.includes(post.id);
          const order = selected.indexOf(post.id) + 1;
          return (
            <button
              key={post.id}
              type="button"
              disabled={!isPublished}
              onClick={() => isPublished && onToggle(post.id)}
              title={!isPublished ? "Publish this post first to add it to homepage sections" : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                !isPublished
                  ? "bg-muted/10 border-border/50 opacity-50 cursor-not-allowed"
                  : isSelected
                  ? "bg-primary/10 border-primary/40 text-foreground"
                  : "bg-card border-border text-muted-foreground hover:border-primary/20 hover:text-foreground cursor-pointer"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground"
                }`}
              >
                {isSelected ? order : ""}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground truncate">{post.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!isPublished && (
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5">
                    Draft
                  </span>
                )}
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/60 border border-primary/20 rounded px-1.5 py-0.5">
                  {post.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
