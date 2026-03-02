"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { useThemeStore } from "@/lib/stores/themeStore";
import { getSidebarItems } from "@/lib/utils/permissions";
import { cn } from "@/lib/utils/cn";

export function Sidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");

  const { isCollapsed, toggleCollapsed, isMobileOpen, closeMobile } =
    useSidebarStore();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const navItems = getSidebarItems(user?.role || "viewer");

  const handleLogout = () => {
    logout();
    closeMobile();
    router.push(`/${locale}/login`);
  };

  const isActive = (path: string) => pathname.includes(path);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="flex flex-col gap-4">
        {/* Logo */}
        <div
          className={cn(
            "flex items-center gap-3 px-2 py-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-[20px]">diamond</span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <h1 className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap leading-tight">
                  TriconosMineros
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {tCommon("tagline")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item, idx) => (
            <div key={item.key}>
              {item.dividerBefore && !isCollapsed && (
                <div className="my-2 px-2">
                  <div className="h-px bg-slate-200 dark:bg-slate-700/60" />
                </div>
              )}
              {item.dividerBefore && isCollapsed && (
                <div className="my-2 px-1">
                  <div className="h-px bg-slate-200 dark:bg-slate-700/60" />
                </div>
              )}
              <Link
                href={`/${locale}${item.path}`}
                onClick={closeMobile}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isCollapsed && "justify-center px-2",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary dark:text-primary border border-primary/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                )}
                title={isCollapsed ? t(item.key as keyof typeof t) : undefined}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[22px] shrink-0 transition-colors",
                    isActive(item.path)
                      ? "text-primary"
                      : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )}
                >
                  {item.icon}
                </span>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {t(item.key as keyof typeof t)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            isCollapsed && "justify-center px-2",
            "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
          )}
          title={theme === "dark" ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        >
          <span className="material-symbols-outlined text-[22px] shrink-0">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse Toggle (desktop only) */}
        <button
          onClick={toggleCollapsed}
          className={cn(
            "hidden lg:flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            isCollapsed && "justify-center px-2",
            "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
          )}
        >
          <span className="material-symbols-outlined text-[22px] shrink-0">
            {isCollapsed ? "chevron_right" : "chevron_left"}
          </span>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Minimizar
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Divider */}
        <div className="h-px bg-slate-200 dark:bg-slate-700/60 mx-1" />

        {/* User Profile */}
        <div
          className={cn(
            "flex items-center gap-3 px-2 py-2",
            isCollapsed && "justify-center"
          )}
        >
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold bg-gradient-to-br shadow-sm",
              user?.avatarColor || "from-primary to-blue-600"
            )}
          >
            {user?.initials || "??"}
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate whitespace-nowrap">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize whitespace-nowrap">
                  {user?.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleLogout}
                className="ml-auto p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded"
                title={tAuth("logout")}
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 64 : 280 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col h-full border-r border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#111418] shrink-0 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[280px] flex flex-col border-r border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#111418]"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
