import { NextResponse } from "next/server";

const PROJECT_ID = "glafix-32914";
const BASE_URL = "https://glafix.com";

interface FirestoreDoc {
  document?: {
    fields: Record<string, { stringValue?: string; timestampValue?: string }>;
  };
}

async function getRecentPosts() {
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "posts" }],
            where: {
              compositeFilter: {
                op: "AND",
                filters: [
                  {
                    fieldFilter: {
                      field: { fieldPath: "status" },
                      op: "EQUAL",
                      value: { stringValue: "published" },
                    },
                  },
                  {
                    fieldFilter: {
                      field: { fieldPath: "publishedAt" },
                      op: "GREATER_THAN_OR_EQUAL",
                      value: { timestampValue: twoDaysAgo },
                    },
                  },
                ],
              },
            },
            select: {
              fields: [
                { fieldPath: "slug" },
                { fieldPath: "title" },
                { fieldPath: "publishedAt" },
              ],
            },
            orderBy: [{ field: { fieldPath: "publishedAt" }, direction: "DESCENDING" }],
            limit: 1000,
          },
        }),
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];
    const rows: FirestoreDoc[] = await res.json();
    return rows
      .filter((r) => r.document?.fields?.slug?.stringValue)
      .map((r) => ({
        slug: r.document!.fields.slug!.stringValue!,
        title: r.document!.fields.title?.stringValue ?? "",
        publishedAt:
          r.document!.fields.publishedAt?.timestampValue ??
          new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

export async function GET() {
  const posts = await getRecentPosts();

  const urlEntries = posts
    .map(
      (p) => `
  <url>
    <loc>${BASE_URL}/blog/${p.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Glafix</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${p.publishedAt}</news:publication_date>
      <news:title>${p.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</news:title>
    </news:news>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
