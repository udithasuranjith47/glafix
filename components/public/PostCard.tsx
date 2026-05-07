import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types/post";
import { formatDate, truncateText } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  featured?: boolean;
  className?: string;
}

export function PostCard({ post, featured = false, className }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5",
        className
      )}
    >
      {post.featuredImage ? (
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            featured ? "h-56 sm:h-72" : "h-48"
          )}
        >
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
        </div>
      ) : (
        <div
          className={cn(
            "relative overflow-hidden bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center",
            featured ? "h-56 sm:h-72" : "h-48"
          )}
        >
          <span className="text-5xl font-bold text-primary/20" style={{ fontFamily: "var(--font-playfair)" }}>
            {post.title.charAt(0)}
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant="outline"
            className="border-primary/30 text-primary text-[10px] uppercase tracking-wider px-2 py-0.5"
          >
            {post.category}
          </Badge>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        <h3
          className={cn(
            "font-bold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors duration-200",
            featured ? "text-xl sm:text-2xl" : "text-lg"
          )}
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {truncateText(post.excerpt, 120)}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary/70" />
            {post.readTime} min
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-primary/70" />
            {formatDate(post.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
