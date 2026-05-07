"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip admin, icons, and anything that isn't a real page
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/icon") ||
      pathname.startsWith("/apple-icon") ||
      pathname === "/_not-found"
    ) return;

    let slug = "home";
    if (pathname.startsWith("/blog/")) {
      slug = "blog/" + pathname.slice("/blog/".length);
    } else if (pathname.startsWith("/category/")) {
      slug = "category/" + decodeURIComponent(pathname.slice("/category/".length));
    }

    trackPageView(slug, pathname);
  }, [pathname]);

  return null;
}
