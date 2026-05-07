"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Save, Send, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "./ImageUploader";
import { Post, PostCategory } from "@/types/post";
import { createPost, updatePost } from "@/lib/firestore";
import { slugify } from "@/lib/utils";
import { useAutoSave } from "@/hooks/useAutoSave";

const RichTextEditor = dynamic(
  () => import("./RichTextEditor").then((m) => m.RichTextEditor),
  { ssr: false, loading: () => <div className="border border-border rounded-xl h-96 bg-muted/10 animate-pulse" /> }
);

const CATEGORIES: PostCategory[] = ["Reviews", "Tutorials", "Case Studies", "Tools", "News"];

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  category: z.enum(["Reviews", "Tutorials", "Case Studies", "Tools", "News"]),
  status: z.enum(["draft", "published"]),
  excerpt: z.string().max(160, "Max 160 characters"),
  featuredImage: z.string(),
  content: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string().max(160, "Max 160 characters"),
});

type FormValues = z.infer<typeof schema>;

interface PostFormProps {
  post?: Post;
}

const autoSaveStatusLabel: Record<string, string> = {
  idle: "",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
};

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [postId, setPostId] = useState<string | null>(post?.id ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      category: post?.category ?? "Reviews",
      status: post?.status ?? "draft",
      excerpt: post?.excerpt ?? "",
      featuredImage: post?.featuredImage ?? "",
      content: post?.content ?? "",
      seoTitle: post?.seoTitle ?? "",
      seoDescription: post?.seoDescription ?? "",
    },
  });

  const titleValue = watch("title");
  const excerptValue = watch("excerpt");
  const seoDescValue = watch("seoDescription");
  const statusValue = watch("status");

  // Auto-generate slug from title (only when creating)
  useEffect(() => {
    if (!post) {
      setValue("slug", slugify(titleValue));
    }
  }, [titleValue, post, setValue]);

  const getData = useCallback((): Partial<FormValues> => getValues(), [getValues]);
  const { status: saveStatus } = useAutoSave(postId, getData);

  async function onSubmit(data: FormValues, publish?: boolean) {
    setSubmitting(true);
    const finalData = { ...data, status: publish ? "published" : data.status } as FormValues;
    try {
      if (postId) {
        await updatePost(postId, finalData);
        toast.success(publish ? "Post published!" : "Post saved");
      } else {
        const id = await createPost(finalData);
        setPostId(id);
        toast.success(publish ? "Post published!" : "Post created as draft");
        router.replace(`/admin/posts/${id}/edit`);
      }
    } catch {
      toast.error("Failed to save post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d))} className="space-y-8">
      {/* Auto-save indicator */}
      {postId && saveStatus !== "idle" && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {autoSaveStatusLabel[saveStatus]}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-semibold">
          Title
        </Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Your compelling post title…"
          className="text-xl font-medium bg-muted/20 border-border h-12 focus:border-primary/50"
          style={{ fontFamily: "var(--font-playfair)" }}
        />
        {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug" className="text-sm font-medium text-muted-foreground">
          URL Slug
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground shrink-0">/blog/</span>
          <Input
            id="slug"
            {...register("slug")}
            placeholder="auto-generated-from-title"
            className="font-mono text-sm bg-muted/20 border-border focus:border-primary/50"
          />
        </div>
        {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="bg-muted/20 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Status toggle */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3 h-10 px-3 bg-muted/20 border border-border rounded-lg">
                <Switch
                  checked={field.value === "published"}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? "published" : "draft")
                  }
                  className="data-[state=checked]:bg-emerald-500"
                />
                <span
                  className={
                    field.value === "published"
                      ? "text-emerald-400 text-sm font-medium"
                      : "text-muted-foreground text-sm"
                  }
                >
                  {field.value === "published" ? "Published" : "Draft"}
                </span>
              </div>
            )}
          />
        </div>
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="excerpt" className="text-sm font-medium">
            Excerpt
          </Label>
          <span
            className={`text-xs ${excerptValue.length > 160 ? "text-destructive" : "text-muted-foreground"}`}
          >
            {excerptValue.length}/160
          </span>
        </div>
        <Textarea
          id="excerpt"
          {...register("excerpt")}
          placeholder="A compelling summary shown in post cards and search results…"
          className="bg-muted/20 border-border resize-none focus:border-primary/50"
          rows={3}
        />
        {errors.excerpt && <p className="text-destructive text-xs">{errors.excerpt.message}</p>}
      </div>

      {/* Featured Image */}
      <Controller
        name="featuredImage"
        control={control}
        render={({ field }) => (
          <ImageUploader value={field.value} onChange={field.onChange} />
        )}
      />

      {/* Rich Text Editor */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Content</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor content={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <Separator className="bg-border" />

      {/* SEO Section (collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setSeoOpen(!seoOpen)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          {seoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          SEO Settings
        </button>

        {seoOpen && (
          <div className="mt-4 space-y-4 p-4 bg-muted/10 rounded-xl border border-border">
            <div className="space-y-2">
              <Label htmlFor="seoTitle" className="text-sm font-medium">
                SEO Title Override
              </Label>
              <Input
                id="seoTitle"
                {...register("seoTitle")}
                placeholder={titleValue || "Defaults to post title"}
                className="bg-muted/20 border-border"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="seoDescription" className="text-sm font-medium">
                  Meta Description Override
                </Label>
                <span
                  className={`text-xs ${seoDescValue.length > 160 ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {seoDescValue.length}/160
                </span>
              </div>
              <Textarea
                id="seoDescription"
                {...register("seoDescription")}
                placeholder="Defaults to excerpt if empty"
                className="bg-muted/20 border-border resize-none"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border">
        <Button
          type="submit"
          variant="outline"
          disabled={submitting}
          className="w-full sm:w-auto border-border hover:border-primary/50 gap-2"
        >
          <Save className="w-4 h-4" />
          {statusValue === "published" ? "Update" : "Save as Draft"}
        </Button>

        {statusValue !== "published" && (
          <Button
            type="button"
            onClick={handleSubmit((d) => onSubmit(d, true))}
            disabled={submitting}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Send className="w-4 h-4" />
            Publish
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/dashboard")}
          className="w-full sm:w-auto text-muted-foreground"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
