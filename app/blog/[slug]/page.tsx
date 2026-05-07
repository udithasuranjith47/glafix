"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ReadingProgress } from "@/components/public/ReadingProgress";
import { TableOfContents } from "@/components/public/TableOfContents";
import { RelatedPosts } from "@/components/public/RelatedPosts";
import { ShareButtons } from "@/components/public/ShareButtons";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@/types/post";
import { getPostBySlug, getRelatedPosts } from "@/lib/firestore";
import { formatDate, extractHeadings, injectHeadingIds } from "@/lib/utils";
import { Clock, Calendar } from "lucide-react";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const fetchedPost = await getPostBySlug(slug);
        if (!fetchedPost) {
          setNotFoundState(true);
          return;
        }
        setPost(fetchedPost);
        const relatedPosts = await getRelatedPosts(fetchedPost.category, slug, 3);
        setRelated(relatedPosts);
      } catch {
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.seoTitle || post.title} | Glafix`;
    }
  }, [post]);

  if (notFoundState) {
    notFound();
  }

  const headings = post ? extractHeadings(post.content) : [];
  const contentWithIds = post ? injectHeadingIds(post.content) : "";
  const postUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Navbar />

      {loading || !post ? (
        <PostSkeleton />
      ) : (
        <>
          {/* Hero */}
          <div className="pt-20">
            {post.featuredImage && (
              <div className="relative h-64 sm:h-96 lg:h-[520px] w-full overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`max-w-3xl mx-auto ${post.featuredImage ? "-mt-32 relative z-10" : "pt-16"}`}
              >
                <div className="mb-6 animate-fade-in-up">
                  <Badge
                    variant="outline"
                    className="border-primary/40 text-primary mb-4 uppercase tracking-wider text-xs"
                  >
                    {post.category}
                  </Badge>
                  <h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {post.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {post.readTime} min read
                    </span>
                  </div>

                  <ShareButtons title={post.title} url={postUrl} />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <div className="grid lg:grid-cols-[1fr_260px] gap-12 max-w-5xl mx-auto lg:max-w-none">
              {/* Article */}
              <article
                className="prose-blog min-w-0 animate-fade-in"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />

              {/* Sidebar TOC */}
              <aside className="hidden lg:block">
                <TableOfContents headings={headings} />
              </aside>
            </div>

            {/* Share at bottom */}
            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border flex items-center justify-between gap-4">
              <Badge
                variant="outline"
                className="border-primary/20 text-primary text-xs uppercase tracking-wider"
              >
                {post.category}
              </Badge>
              <ShareButtons title={post.title} url={postUrl} />
            </div>

            {/* Related posts */}
            <div className="max-w-5xl mx-auto">
              <RelatedPosts posts={related} />
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="pt-20">
      <Skeleton className="h-96 w-full rounded-none" />
      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-4">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-10 w-3/5" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="mt-8 space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i % 5 === 4 ? "w-3/4" : "w-full"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
