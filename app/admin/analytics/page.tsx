"use client";

import { useEffect, useState } from "react";
import {
  getViewCount,
  getTopPosts,
  getDailyViews,
  subscribeToRecentViews,
  daysAgo,
  PageViewRecord,
} from "@/lib/analytics";
import { Timestamp } from "firebase/firestore";
import { BarChart2, Globe, TrendingUp, Eye, Clock, ExternalLink } from "lucide-react";

/* ── Types ──────────────────────────────────────────────── */

interface Stats {
  today: number;
  week: number;
  month: number;
  allTime: number;
}

interface TopPost {
  slug: string;
  path: string;
  views: number;
}

interface DayData {
  date: string;
  views: number;
}

/* ── Helpers ─────────────────────────────────────────────── */

function relativeTime(ts: Timestamp | null): string {
  if (!ts?.toDate) return "just now";
  const diff = Date.now() - ts.toDate().getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

function slugToTitle(slug: string): string {
  if (slug === "home") return "Homepage";
  const parts = slug.split("/");
  const last = parts[parts.length - 1];
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function shortDomain(referrer: string): string {
  if (!referrer) return "Direct";
  try {
    return new URL(referrer).hostname.replace("www.", "");
  } catch {
    return "Direct";
  }
}

/* ── Sub-components ──────────────────────────────────────── */

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | null;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          accent ? "bg-primary/15 text-primary" : "bg-muted/30 text-muted-foreground"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">
          {value === null ? (
            <span className="text-muted-foreground text-base animate-pulse">—</span>
          ) : (
            value.toLocaleString()
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function BarChart({ data }: { data: DayData[] }) {
  const max = Math.max(...data.map((d) => d.views), 1);
  return (
    <div className="flex items-end gap-1.5 h-36 pt-6">
      {data.map(({ date, views }) => {
        const pct = Math.max((views / max) * 100, views > 0 ? 4 : 0);
        const label = new Date(date + "T12:00:00").toLocaleDateString("en", {
          weekday: "short",
        });
        return (
          <div key={date} className="flex-1 flex flex-col items-center gap-1 min-w-0 group relative">
            {/* Tooltip */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {views} view{views !== 1 ? "s" : ""}
            </div>
            <div className="w-full flex flex-col justify-end" style={{ height: "120px" }}>
              <div
                className="w-full bg-primary/80 rounded-t transition-all duration-500"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [daily, setDaily] = useState<DayData[]>([]);
  const [live, setLive] = useState<PageViewRecord[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch all aggregated stats once
  useEffect(() => {
    async function load() {
      try {
        const [today, week, month, allTime, posts, days] = await Promise.all([
          getViewCount(daysAgo(0)),    // since midnight today
          getViewCount(daysAgo(7)),
          getViewCount(daysAgo(30)),
          getViewCount(),
          getTopPosts(daysAgo(30), 10),
          getDailyViews(7),
        ]);
        setStats({ today, week, month, allTime });
        setTopPosts(posts);
        setDaily(days);
      } catch (e) {
        console.error("Analytics load error:", e);
      } finally {
        setLoadingStats(false);
      }
    }
    load();
  }, []);

  // Real-time live feed
  useEffect(() => {
    const unsub = subscribeToRecentViews((views) => setLive(views), 25);
    return unsub;
  }, []);

  const topMax = Math.max(...topPosts.map((p) => p.views), 1);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time traffic and post performance</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Views today" value={loadingStats ? null : (stats?.today ?? 0)} icon={Eye} accent />
        <StatCard label="Last 7 days" value={loadingStats ? null : (stats?.week ?? 0)} icon={TrendingUp} />
        <StatCard label="Last 30 days" value={loadingStats ? null : (stats?.month ?? 0)} icon={BarChart2} />
        <StatCard label="All time" value={loadingStats ? null : (stats?.allTime ?? 0)} icon={Globe} />
      </div>

      {/* Chart + Live feed */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 7-day bar chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-1">Traffic — last 7 days</h2>
          <p className="text-xs text-muted-foreground mb-4">Page views per day</p>
          {daily.length > 0 ? (
            <BarChart data={daily} />
          ) : (
            <div className="h-36 flex items-center justify-center text-sm text-muted-foreground">
              {loadingStats ? "Loading…" : "No data yet — views will appear as visitors arrive"}
            </div>
          )}
        </div>

        {/* Real-time live feed */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-semibold text-foreground">Live activity</h2>
            <span className="text-xs text-muted-foreground ml-auto">{live.length} recent</span>
          </div>

          {live.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              Waiting for visitors…
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {live.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
                >
                  <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {slugToTitle(v.slug)}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {shortDomain(v.referrer)}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {relativeTime(v.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top posts */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-1">Top posts — last 30 days</h2>
        <p className="text-xs text-muted-foreground mb-5">Ranked by unique page views</p>

        {topPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {loadingStats ? "Loading…" : "No blog post views yet"}
          </p>
        ) : (
          <div className="space-y-3">
            {topPosts.map((post, i) => (
              <div key={post.slug} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4 shrink-0 text-right">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {slugToTitle(post.slug)}
                    </p>
                    <a
                      href={post.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${(post.views / topMax) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground shrink-0 w-12 text-right">
                  {post.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
