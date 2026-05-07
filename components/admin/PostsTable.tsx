"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Post } from "@/types/post";
import { deletePost, togglePostStatus, setFeaturedPost } from "@/lib/firestore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, Eye, EyeOff, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

interface PostsTableProps {
  posts: Post[];
  onRefresh: () => void;
}

export function PostsTable({ posts, onRefresh }: PostsTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [featuringId, setFeaturingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePost(deleteTarget.id);
      toast.success("Post deleted");
      onRefresh();
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function handleSetFeatured(post: Post) {
    if (post.featured) return; // already featured, nothing to do
    setFeaturingId(post.id);
    try {
      await setFeaturedPost(post.id);
      toast.success(`"${post.title}" is now the featured post`);
      onRefresh();
    } catch {
      toast.error("Failed to set featured post");
    } finally {
      setFeaturingId(null);
    }
  }

  async function handleToggle(post: Post) {
    setTogglingId(post.id);
    try {
      await togglePostStatus(post.id, post.status);
      toast.success(
        post.status === "published" ? "Post set to draft" : "Post published"
      );
      onRefresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>No posts yet.</p>
        <Link href="/admin/posts/new" className="text-primary text-sm hover:underline mt-2 inline-block">
          Create your first post →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-muted-foreground font-semibold">Title</TableHead>
              <TableHead className="text-muted-foreground font-semibold hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
              <TableHead className="text-muted-foreground font-semibold hidden lg:table-cell">Date</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id} className="hover:bg-muted/10">
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground line-clamp-1">{post.title}</p>
                      {post.featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary border border-primary/30 rounded px-1.5 py-0.5 shrink-0">
                          <Star className="w-2.5 h-2.5 fill-primary" />
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">/{post.slug}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className="border-primary/20 text-primary text-xs">
                    {post.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={post.status === "published" ? "default" : "secondary"}
                    className={
                      post.status === "published"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">
                  {formatDate(post.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {post.status === "published" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSetFeatured(post)}
                        disabled={featuringId === post.id || post.featured}
                        title={post.featured ? "Currently featured" : "Set as featured"}
                        className={`w-8 h-8 ${post.featured ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                      >
                        {featuringId === post.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Star className={`w-3.5 h-3.5 ${post.featured ? "fill-primary" : ""}`} />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggle(post)}
                      disabled={togglingId === post.id}
                      title={post.status === "published" ? "Set to draft" : "Publish"}
                      className="w-8 h-8 text-muted-foreground hover:text-foreground"
                    >
                      {togglingId === post.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : post.status === "published" ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </Button>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-muted-foreground hover:text-primary"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget({ id: post.id, title: post.title })}
                      className="w-8 h-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete this post?</DialogTitle>
            <DialogDescription className="pt-2">
              <span className="block text-foreground font-medium mb-1 line-clamp-2">
                &ldquo;{deleteTarget?.title}&rdquo;
              </span>
              This will permanently delete the post and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-2"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {deleting ? "Deleting…" : "Yes, delete permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
