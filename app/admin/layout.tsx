"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (pathname === "/admin/login") return;
    if (!user) {
      router.replace("/admin/login");
      return;
    }
    // Boot any account that isn't the authorised admin email
    if (ADMIN_EMAIL && user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      signOut();
    }
  }, [user, loading, router, pathname, signOut]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if ((!user || (ADMIN_EMAIL && user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase())) && pathname !== "/admin/login") return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminNav />
      <div className="flex-1 overflow-auto">
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
