"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PenSquare, BarChart2, Home, Award, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { label: "Homepage", href: "/admin/homepage", icon: Home },
  { label: "AI Stack 2026", href: "/admin/aistack", icon: Award },
  { label: "New Post", href: "/admin/posts/new", icon: PenSquare },
];

export function AdminNav() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <aside className="w-60 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2 group">
          <Logo size={22} />
          <span className="text-sm font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            Glafix
          </span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href))
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        {user && (
          <p className="text-xs text-muted-foreground mb-3 truncate">{user.email}</p>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
