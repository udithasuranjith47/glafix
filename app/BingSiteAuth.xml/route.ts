import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(
    `<?xml version="1.0"?>\n<users>\n\t<user>4E5D64C6F97F468D4C9D6328B0969EE4</user>\n</users>`,
    {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400",
      },
    }
  );
}
