"use client";

import { useState, useEffect, useCallback } from "react";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { Post, PostCategory } from "@/types/post";
import { getPublishedPosts, getPublishedPostsByCategory } from "@/lib/firestore";
import { PostCard } from "./PostCard";
import { PostGridSkeleton } from "./LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PostGridProps {
  category?: PostCategory | PostCategory[];
  excludeSlug?: string;
  pageSize?: number;
}

export function PostGrid({ category, excludeSlug, pageSize = 9 }: PostGridProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (reset = false) => {
      try {
        const { posts: newPosts, lastDoc: newLastDoc } = category
          ? await getPublishedPostsByCategory(category, pageSize, reset ? undefined : lastDoc ?? undefined)
          : await getPublishedPosts(pageSize, reset ? undefined : lastDoc ?? undefined);

        const filtered = excludeSlug
          ? newPosts.filter((p) => p.slug !== excludeSlug)
          : newPosts;

        setPosts((prev) => (reset ? filtered : [...prev, ...filtered]));
        setLastDoc(newLastDoc);
        setHasMore(newPosts.length === pageSize);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    },
    [category, excludeSlug, pageSize, lastDoc]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setLastDoc(null);
    setPosts([]);
    setHasMore(true);

    const doFetch = async () => {
      try {
        const { posts: newPosts, lastDoc: newLastDoc } = category
          ? await getPublishedPostsByCategory(category, pageSize)
          : await getPublishedPosts(pageSize);

        const filtered = excludeSlug
          ? newPosts.filter((p) => p.slug !== excludeSlug)
          : newPosts;

        setPosts(filtered);
        setLastDoc(newLastDoc);
        setHasMore(newPosts.length === pageSize);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError(err instanceof Error ? err.message : "Failed to load posts. Check Firestore indexes.");
      } finally {
        setLoading(false);
      }
    };

    doFetch();
  }, [category, excludeSlug, pageSize]);

  async function loadMore() {
    setLoadingMore(true);
    await fetchPosts();
    setLoadingMore(false);
  }

  if (loading) return <PostGridSkeleton count={pageSize} />;

  if (error) {
    return (
      <div className="text-center py-16 rounded-xl border border-destructive/20 bg-destructive/5 p-8">
        <p className="text-destructive font-semibold mb-2">Could not load posts</p>
        <p className="text-muted-foreground text-xs leading-relaxed max-w-lg mx-auto">{error}</p>
        <p className="text-muted-foreground text-xs mt-3">
          If this is a new project, run{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-primary">
            firebase deploy --only firestore:indexes
          </code>{" "}
          to create required database indexes.
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No posts found.</p>
        <p className="text-muted-foreground text-sm mt-2">
          {category ? `No posts in this category yet.` : "Check back soon."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={loadingMore}
            className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary min-w-[160px]"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading…
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
