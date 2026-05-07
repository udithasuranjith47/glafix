"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Save, Send, Clock, Sparkles, Loader2 } from "lucide-react";

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

type AiLoadingKey = "seo-title" | "meta-description" | "excerpt" | "title-variants" | null;

async function fetchSuggestion(type: string, title: string, excerpt: string): Promise<string> {
  const res = await fetch("/api/suggest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, title, excerpt }),
  });
  if (!res.ok) throw new Error("AI request failed");
  const data = await res.json();
  return data.suggestion as string;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [postId, setPostId] = useState<string | null>(post?.id ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState<AiLoadingKey>(null);
  const [titleVariants, setTitleVariants] = useState<string>("");

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

  async function runAi(type: AiLoadingKey) {
    if (!type) return;
    setAiLoading(type);
    setTitleVariants("");
    try {
      const suggestion = await fetchSuggestion(type, titleValue, excerptValue);
      if (type === "seo-title") {
        setValue("seoTitle", suggestion);
        setSeoOpen(true);
        toast.success("SEO title applied");
      } else if (type === "meta-description") {
        setValue("seoDescription", suggestion.slice(0, 160));
        setSeoOpen(true);
        toast.success("Meta description applied");
      } else if (type === "excerpt") {
        setValue("excerpt", suggestion.slice(0, 160));
        toast.success("Excerpt applied");
      } else if (type === "title-variants") {
        setTitleVariants(suggestion);
      }
    } catch {
      toast.error("AI suggestion failed — check your API key");
    } finally {
      setAiLoading(null);
    }
  }

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

      {/* AI Assist (collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setAiOpen(!aiOpen)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          {aiOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <Sparkles className="w-4 h-4 text-primary" />
          AI Assist
        </button>

        {aiOpen && (
          <div className="mt-4 p-4 bg-muted/10 rounded-xl border border-border space-y-4">
            <p className="text-xs text-muted-foreground">
              Generate suggestions based on your title and excerpt. Results are applied directly to the relevant fields.
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: "excerpt", label: "Suggest Excerpt" },
                  { key: "seo-title", label: "Suggest SEO Title" },
                  { key: "meta-description", label: "Suggest Meta Description" },
                  { key: "title-variants", label: "Title Variants" },
                ] as { key: AiLoadingKey; label: string }[]
              ).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  disabled={aiLoading !== null || !titleValue}
                  onClick={() => runAi(key)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-xs text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {aiLoading === key ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  {label}
                </button>
              ))}
            </div>
            {!titleValue && (
              <p className="text-xs text-muted-foreground/60">Add a title first to enable suggestions.</p>
            )}
            {titleVariants && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">Title variants — click to apply:</p>
                {titleVariants.split("\n").filter(Boolean).map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setValue("title", v.replace(/^["']|["']$/g, "").trim()); setTitleVariants(""); }}
                    className="block w-full text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted/20 px-3 py-2 rounded-lg transition-colors"
                  >
                    {v.replace(/^["']|["']$/g, "").trim()}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
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
