import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  getCountFromServer,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface PageViewRecord {
  id: string;
  slug: string;
  path: string;
  referrer: string;
  timestamp: Timestamp | null;
}

// ── Helpers ──────────────────────────────────────────────

function sessionId(): string {
  if (typeof sessionStorage === "undefined") return "";
  let id = sessionStorage.getItem("_gf_sid");
  if (!id) {
    id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36));
    sessionStorage.setItem("_gf_sid", id);
  }
  return id;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ── Write ─────────────────────────────────────────────────

export async function trackPageView(slug: string, path: string): Promise<void> {
  if (typeof window === "undefined") return;
  // Per-session per-page dedup — never double-count a tab refresh
  const key = `_gf_v_${slug}`;
  if (sessionStorage.getItem(key)) return;
  try {
    await addDoc(collection(db, "analytics"), {
      slug,
      path,
      referrer: document.referrer ?? "",
      sessionId: sessionId(),
      timestamp: serverTimestamp(),
    });
    sessionStorage.setItem(key, "1");
  } catch {
    // Analytics should never break the site
  }
}

// ── Read ──────────────────────────────────────────────────

export async function getViewCount(since?: Date): Promise<number> {
  const base = collection(db, "analytics");
  const q = since
    ? query(base, where("timestamp", ">=", Timestamp.fromDate(since)))
    : query(base);
  const snap = await getCountFromServer(q);
  return snap.data().count;
}

export async function getTopPosts(
  since: Date,
  maxResults = 10
): Promise<{ slug: string; path: string; views: number }[]> {
  const q = query(
    collection(db, "analytics"),
    where("timestamp", ">=", Timestamp.fromDate(since))
  );
  const snap = await getDocs(q);

  const counts: Record<string, { path: string; views: number }> = {};
  snap.docs.forEach((d) => {
    const slug = d.data().slug as string;
    if (!slug?.startsWith("blog/")) return;
    if (!counts[slug]) counts[slug] = { path: d.data().path ?? "", views: 0 };
    counts[slug].views++;
  });

  return Object.entries(counts)
    .map(([slug, { path, views }]) => ({ slug, path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, maxResults);
}

export async function getDailyViews(days: number): Promise<{ date: string; views: number }[]> {
  const since = daysAgo(days);
  const q = query(
    collection(db, "analytics"),
    where("timestamp", ">=", Timestamp.fromDate(since)),
    orderBy("timestamp", "asc")
  );
  const snap = await getDocs(q);

  // Pre-fill every day with 0
  const map: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    map[d.toISOString().slice(0, 10)] = 0;
  }

  snap.docs.forEach((d) => {
    const ts = d.data().timestamp as Timestamp | null;
    if (!ts?.toDate) return;
    const key = ts.toDate().toISOString().slice(0, 10);
    if (key in map) map[key]++;
  });

  return Object.entries(map).map(([date, views]) => ({ date, views }));
}

export function subscribeToRecentViews(
  callback: (views: PageViewRecord[]) => void,
  count = 25
): () => void {
  const q = query(
    collection(db, "analytics"),
    orderBy("timestamp", "desc"),
    limit(count)
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        slug: d.data().slug ?? "",
        path: d.data().path ?? "",
        referrer: d.data().referrer ?? "",
        timestamp: d.data().timestamp ?? null,
      }))
    );
  });
}

export { daysAgo };
