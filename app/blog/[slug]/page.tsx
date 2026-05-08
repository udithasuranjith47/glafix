import type { Metadata } from "next";
import BlogPostContent from "@/components/public/BlogPostContent";

const PROJECT_ID = "glafix-32914";
const BASE_URL = "https://glafix.com";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

type Props = { params: Promise<{ slug: string }> };

interface PostMeta {
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  category: string;
  slug: string;
  featuredImage: string;
  publishedAt: string;
  updatedAt: string;
}

async function fetchPostMeta(slug: string): Promise<PostMeta | null> {
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
          select: {
            fields: [
              { fieldPath: "title" },
              { fieldPath: "seoTitle" },
              { fieldPath: "seoDescription" },
              { fieldPath: "excerpt" },
              { fieldPath: "category" },
              { fieldPath: "slug" },
              { fieldPath: "featuredImage" },
              { fieldPath: "publishedAt" },
              { fieldPath: "updatedAt" },
            ],
          },
          limit: 1,
        },
      }),
      next: { revalidate: 60 },
    });

    const rows: Array<{ document?: { fields: Record<string, { stringValue?: string; timestampValue?: string }> } }> =
      await res.json();
    const fields = rows[0]?.document?.fields;
    if (!fields) return null;

    const str = (key: string) => fields[key]?.stringValue ?? "";
    const ts = (key: string) => fields[key]?.timestampValue ?? fields[key]?.stringValue ?? "";

    return {
      title: str("title"),
      seoTitle: str("seoTitle"),
      seoDescription: str("seoDescription"),
      excerpt: str("excerpt"),
      category: str("category"),
      slug: str("slug"),
      featuredImage: str("featuredImage"),
      publishedAt: ts("publishedAt"),
      updatedAt: ts("updatedAt"),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostMeta(slug);

  if (!post) return { title: "Post Not Found" };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const url = `${BASE_URL}/blog/${slug}`;
  const images = post.featuredImage ? [{ url: post.featuredImage, width: 1200, height: 630 }] : [];

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "Glafix",
      images,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [`${BASE_URL}/about`],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    alternates: { canonical: url },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostMeta(slug);

  const url = `${BASE_URL}/blog/${slug}`;
  const title = post ? (post.seoTitle || post.title) : "";
  const description = post ? (post.seoDescription || post.excerpt) : "";

  const articleSchema = post
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "@id": `${url}#article`,
        headline: title,
        description,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: post.featuredImage
          ? [{ "@type": "ImageObject", url: post.featuredImage, width: 1200, height: 630 }]
          : [`${BASE_URL}/icon.png`],
        datePublished: post.publishedAt || new Date().toISOString(),
        dateModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
        author: {
          "@type": "Organization",
          name: "Glafix",
          url: BASE_URL,
          logo: { "@type": "ImageObject", url: `${BASE_URL}/icon.png` },
        },
        publisher: {
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "Glafix",
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/icon.png`,
            width: 200,
            height: 200,
          },
        },
        articleSection: post.category,
        inLanguage: "en-US",
        isAccessibleForFree: true,
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      ...(post
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: post.category,
              item: `${BASE_URL}/category/${encodeURIComponent(post.category)}`,
            },
          ]
        : []),
      { "@type": "ListItem", position: post ? 3 : 2, name: title, item: url },
    ],
  };

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostContent slug={slug} />
    </>
  );
}
