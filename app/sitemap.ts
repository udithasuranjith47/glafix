import { MetadataRoute } from "next";

const BASE_URL = "https://glafix.com";
const PROJECT_ID = "glafix-32914";

/* ─── Firestore REST API types ─────────────────────────────────── */

interface FirestoreStringValue { stringValue: string }
interface FirestoreTimestampValue { timestampValue: string }
interface FirestoreDocument {
  fields?: {
    slug?: FirestoreStringValue;
    updatedAt?: FirestoreTimestampValue;
    publishedAt?: FirestoreTimestampValue;
  };
}
interface FirestoreQueryResult { document?: FirestoreDocument }

/* ─── Fetch all published post slugs from Firestore ─────────────── */

async function getPublishedPostsForSitemap(): Promise<
  { slug: string; lastModified: Date }[]
> {
  try {
    const endpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "posts" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "status" },
              op: "EQUAL",
              value: { stringValue: "published" },
            },
          },
          select: {
            fields: [
              { fieldPath: "slug" },
              { fieldPath: "updatedAt" },
              { fieldPath: "publishedAt" },
            ],
          },
        },
      }),
      next: { revalidate: 3600 }, // re-fetch at most once per hour
    });

    if (!res.ok) return [];

    const results: FirestoreQueryResult[] = await res.json();

    return results
      .filter((r) => r.document?.fields?.slug?.stringValue)
      .map((r) => {
        const fields = r.document!.fields!;
        const ts =
          fields.updatedAt?.timestampValue ??
          fields.publishedAt?.timestampValue;
        return {
          slug: fields.slug!.stringValue,
          lastModified: ts ? new Date(ts) : new Date(),
        };
      });
  } catch {
    return []; // sitemap still works without dynamic posts
  }
}

/* ─── Sitemap export ─────────────────────────────────────────────── */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/best-ai-tools-2026`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/category/Reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/category/Roundups`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/category/How-To`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/category/Pricing%20%26%20News`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/category/Case%20Studies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/methodology`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/disclosure`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const posts = await getPublishedPostsForSitemap();

  const now = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

  const postPages: MetadataRoute.Sitemap = posts.map(({ slug, lastModified }) => {
    const isRecent = now - lastModified.getTime() < ninetyDaysMs;
    return {
      url: `${BASE_URL}/blog/${slug}`,
      lastModified,
      changeFrequency: isRecent ? "weekly" : "monthly",
      priority: isRecent ? 0.8 : 0.7,
    };
  });

  return [...staticPages, ...postPages];
}
