"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPostById } from "@/lib/firestore";
import { Post } from "@/types/post";
import { PostForm } from "@/components/admin/PostForm";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPostById(id)
      .then((p) => {
        if (!p) setError(true);
        else setPost(p);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <h1
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Edit Post
        </h1>
        {post && (
          <p className="text-muted-foreground text-sm mt-1 font-mono truncate">
            /blog/{post.slug}
          </p>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 text-destructive py-8 justify-center">
            <AlertCircle className="w-5 h-5" />
            <p>Post not found or could not be loaded.</p>
          </div>
        ) : post ? (
          <PostForm post={post} />
        ) : null}
      </div>
    </div>
  );
}
