"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CategoryGroup } from "@/types/post";

const GROUPS: { label: string; value: string }[] = [
  { label: "All",            value: "All" },
  { label: "Reviews",        value: "Reviews" },
  { label: "Roundups",       value: "Roundups" },
  { label: "How-To",         value: "How-To" },
  { label: "Pricing & News", value: "Pricing & News" },
  { label: "Case Studies",   value: "Case Studies" },
];

export function CategoryFilter({ activeCategory = "All" }: { activeCategory?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSelect(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {GROUPS.map(({ label, value }) => {
        const isActive = value === activeCategory;
        return (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
