import { NextRequest, NextResponse } from "next/server";

interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

function keywordFallback(query: string, posts: PostMeta[]): string[] {
  const q = query.toLowerCase();
  return posts
    .filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((p) => p.slug);
}

export async function POST(req: NextRequest) {
  const { query, posts } = (await req.json()) as { query: string; posts: PostMeta[] };

  if (!query?.trim() || !posts?.length) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ results: keywordFallback(query, posts) });
  }

  // Send compact post data to keep token cost minimal
  const compact = posts.map((p) => ({
    s: p.slug,
    t: p.title,
    e: p.excerpt?.slice(0, 120) ?? "",
    c: p.category,
  }));

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 80,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'You are a search assistant for an AI tools review blog. Given a query and blog post metadata, return the slugs of the most relevant posts (max 5) as {"results":["slug1","slug2",...]}. Return only JSON.',
          },
          {
            role: "user",
            content: `Query: "${query}"\n\nPosts: ${JSON.stringify(compact)}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ results: keywordFallback(query, posts) });
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    const slugs: string[] = parsed.results ?? [];
    return NextResponse.json({ results: slugs });
  } catch {
    return NextResponse.json({ results: keywordFallback(query, posts) });
  }
}
