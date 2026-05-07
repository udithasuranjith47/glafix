"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  if (!ADMIN_EMAIL) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

function Spinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading || isLoginPage) return;
    if (!user) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isAdmin(user.email)) {
      // Wrong account — sign out silently and redirect
      signOut();
    }
  }, [user, loading, pathname, isLoginPage, router, signOut]);

  // Login page: always render (no auth needed)
  if (isLoginPage) return <>{children}</>;

  // Still resolving auth state → show spinner, never render protected content
  if (loading) return <Spinner />;

  // No user or wrong email → show spinner while redirect is in-flight
  // Children are NEVER rendered for non-admin accounts
  if (!user || !isAdmin(user.email)) return <Spinner />;

  return (
    <div className="min-h-screen bg-background flex">
      <AdminNav />
      <div className="flex-1 overflow-auto">
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
