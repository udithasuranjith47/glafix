import type { Metadata } from "next";
import BlogPostContent from "@/components/public/BlogPostContent";

const PROJECT_ID = "glafix-32914";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

type Props = { params: Promise<{ slug: string }> };

/* Fetch just title + SEO fields from Firestore REST (no SDK needed server-side) */
async function fetchPostMeta(slug: string) {
  try {
    const res = await fetch(`${FIRESTORE_BASE}:runQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "posts" }],
          where: {
            compositeFilter: {
              op: "AND",
              filters: [
                { fieldFilter: { field: { fieldPath: "slug" }, op: "EQUAL", value: { stringValue: slug } } },
                { fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: "published" } } },
              ],
            },
          },
          limit: 1,
        },
      }),
      next: { revalidate: 60 },
    });

    const rows: Array<{ document?: { fields: Record<string, { stringValue?: string }> } }> = await res.json();
    const fields = rows[0]?.document?.fields;
    if (!fields) return null;

    const str = (key: string) => fields[key]?.stringValue ?? "";
    return {
      title: str("title"),
      seoTitle: str("seoTitle"),
      seoDescription: str("seoDescription"),
      excerpt: str("excerpt"),
      category: str("category"),
      slug: str("slug"),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostMeta(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const url = `https://glafix.com/blog/${slug}`;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "Glafix",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: url },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostContent slug={slug} />;
}
