"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Reviews", "Tutorials", "Case Studies", "Tools", "News"] as const;

export function CategoryFilter({ activeCategory = "All" }: { activeCategory?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSelect(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isActive = cat === activeCategory;
        return (
          <button
            key={cat}
            onClick={() => handleSelect(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
