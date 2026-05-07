import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

const PROMPTS: Record<string, (title: string, excerpt: string) => string> = {
  "seo-title": (title) =>
    `Write one SEO-optimised title tag (max 60 characters) for a blog post titled: "${title}". Return only the title, no quotes, no explanation.`,
  "meta-description": (title, excerpt) =>
    `Write one compelling meta description (max 155 characters) for a blog post titled: "${title}". Context: ${excerpt || "AI tools review blog"}. Return only the description, no quotes.`,
  excerpt: (title) =>
    `Write one engaging excerpt (max 155 characters) for a blog post titled: "${title}". The blog covers AI tools, automation, and no-code for solo operators. Return only the excerpt, no quotes.`,
  "title-variants": (title) =>
    `Give me 3 alternative headline variants for a blog post currently titled: "${title}". The blog targets solo operators interested in AI tools. Return only the 3 headlines, one per line, no numbers or bullets.`,
};

export async function POST(req: NextRequest) {
  // Auth check: only the admin session can call this
  const sessionCookie = req.cookies.get("__session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = sessionCookie.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (decoded.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI not configured" }, { status: 503 });
  }

  const { type, title, excerpt = "" } = await req.json();
  const promptFn = PROMPTS[type];
  if (!promptFn) {
    return NextResponse.json({ error: "Unknown suggestion type" }, { status: 400 });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content:
            "You are a specialist SEO and content copywriter for an affiliate review blog about AI tools, automation, and no-code for solo operators. Be concise, persuasive, and specific.",
        },
        { role: "user", content: promptFn(title, excerpt) },
      ],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "OpenAI request failed" }, { status: 502 });
  }

  const data = await res.json();
  const suggestion = data.choices?.[0]?.message?.content?.trim() ?? "";
  return NextResponse.json({ suggestion });
}
