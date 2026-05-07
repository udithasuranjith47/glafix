"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getAllPosts } from "@/lib/firestore";
import { Post } from "@/types/post";
import { PostsTable } from "@/components/admin/PostsTable";
import { StatsCard } from "@/components/admin/StatsCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PenSquare, FileText, Globe, FileEdit, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllPosts();
      setPosts(all);
    } catch {
      // fail silently — user sees empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const total = posts.length;
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = total - published;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your Glafix posts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadPosts}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/admin/posts/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <PenSquare className="w-4 h-4" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard label="Total Posts" value={total} icon={FileText} />
          <StatsCard label="Published" value={published} icon={Globe} accent />
          <StatsCard label="Drafts" value={drafts} icon={FileEdit} />
        </div>
      )}

      {/* Posts table */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">All Posts</h2>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : (
          <PostsTable posts={posts} onRefresh={loadPosts} />
        )}
      </div>
    </div>
  );
}
