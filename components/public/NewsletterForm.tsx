"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "newsletter"), {
        email: email.trim().toLowerCase(),
        subscribedAt: serverTimestamp(),
      });
      setEmail("");
      toast.success("Thank you for subscribing!", {
        description: "We'll notify you when we publish something worth reading.",
        duration: 4000,
      });
    } catch {
      toast.error("Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-xl border border-border bg-muted/20 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-primary text-background font-semibold text-sm hover:bg-primary/90 transition-all shrink-0 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Send me the checklist
        </button>
      </form>
      <p className="text-xs text-muted-foreground/60 mt-4">
        Unsubscribe any time. We hate spam as much as you do.
      </p>
    </>
  );
}
