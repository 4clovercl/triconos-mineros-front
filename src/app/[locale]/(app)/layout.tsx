"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { useAuthStore } from "@/lib/stores/authStore";
import { canAccess } from "@/lib/utils/permissions";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
      return;
    }
    const segments = pathname.split("/");
    const page = "/" + (segments[2] || "summary");
    if (user && !canAccess(user.role, page)) {
      router.replace(`/${locale}/summary`);
    }
  }, [isAuthenticated, user, pathname, router, locale]);

  if (!isAuthenticated || !user) {
    return (
      <ThemeProvider>
        <div className="flex h-screen items-center justify-center bg-[#f6f7f8] dark:bg-[#101822]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen w-full bg-[#f6f7f8] dark:bg-[#101822] overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col h-full overflow-hidden min-w-0">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
