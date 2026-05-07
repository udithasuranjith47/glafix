import Link from "next/link";
import { PostForm } from "@/components/admin/PostForm";
import { ArrowLeft } from "lucide-react";

export default function NewPostPage() {
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
          New Post
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create a new Glafix article
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <PostForm />
      </div>
    </div>
  );
}
