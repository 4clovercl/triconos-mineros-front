"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { useAuthStore } from "@/lib/stores/authStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
      return;
    }
    if (user && user.role !== "admin") {
      router.replace(`/${locale}/summary`);
    }
  }, [isAuthenticated, user, router, locale]);

  if (!isAuthenticated || !user || user.role !== "admin") {
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
