"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "@/components/public/HeroSection";
import { CategoryFilter } from "@/components/public/CategoryFilter";
import { PostGrid } from "@/components/public/PostGrid";
import { HeroSkeleton } from "@/components/public/LoadingSkeleton";
import { getFeaturedPost } from "@/lib/firestore";
import { Post, PostCategory } from "@/types/post";

function HomeContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    getFeaturedPost()
      .then((post) => setFeaturedPost(post))
      .catch(() => setFeaturedPost(null))
      .finally(() => setHeroLoading(false));
  }, []);

  const activeCategory = category ?? "All";
  const gridCategory =
    category && category !== "All" ? (category as PostCategory) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {heroLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <HeroSkeleton />
        </div>
      ) : (
        <HeroSection featuredPost={featuredPost} />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl sm:text-3xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {activeCategory === "All" ? "Latest Articles" : activeCategory}
            </h2>
          </div>
          <CategoryFilter activeCategory={activeCategory} />
        </div>

        <PostGrid
          category={gridCategory}
          excludeSlug={featuredPost?.slug}
          pageSize={9}
        />
      </main>

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
