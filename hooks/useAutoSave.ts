"use client";

import { useEffect, useRef, useState } from "react";
import { updatePost } from "@/lib/firestore";
import { PostFormData } from "@/types/post";

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutoSave(
  postId: string | null,
  getData: () => Partial<PostFormData>,
  intervalMs = 30000
) {
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSavingRef = useRef(false);

  async function save() {
    if (!postId || isSavingRef.current) return;
    isSavingRef.current = true;
    setStatus("saving");
    try {
      await updatePost(postId, getData());
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      isSavingRef.current = false;
    }
  }

  useEffect(() => {
    if (!postId) return;
    timerRef.current = setInterval(save, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [postId, intervalMs]);

  return { status, saveNow: save };
}
