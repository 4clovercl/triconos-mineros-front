"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { ALERTS } from "@/lib/mock/alerts";
import { formatTimeAgo } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

const SITES = [
  "Site Alpha - Northern Territory",
  "Site Beta - Western Ridge",
  "Site Gamma - Deep Valley",
];

interface HeaderProps {
  title: string;
  badge?: string;
  badgeVariant?: "success" | "warning" | "danger";
}

export function Header({ title, badge, badgeVariant = "success" }: HeaderProps) {
  const t = useTranslations("realtime");
  const { toggleMobile } = useSidebarStore();
  const [selectedSite, setSelectedSite] = useState(SITES[0]);
  const [showAlerts, setShowAlerts] = useState(false);

  const unreadAlerts = ALERTS.filter((a) => !a.acknowledged);

  const alertLevelColors: Record<string, string> = {
    critical: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
    resolved: "bg-green-500",
    normal: "bg-green-500",
    system: "bg-slate-500",
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-700/60 bg-white/80 dark:bg-[#111418]/95 backdrop-blur-sm px-4 lg:px-6 z-30">
      {/* Left: Mobile menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h2>
          {badge && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  badgeVariant === "success" && "bg-green-500 animate-pulse",
                  badgeVariant === "warning" && "bg-amber-500",
                  badgeVariant === "danger" && "bg-red-500"
                )}
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {badge}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Site selector + Shift + Alerts */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Site Selector */}
        <div className="hidden md:flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 border border-slate-200 dark:border-slate-700">
          <span className="material-symbols-outlined text-[18px] text-primary">
            location_on
          </span>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="bg-transparent border-none p-0 text-sm font-medium text-slate-900 dark:text-white focus:ring-0 cursor-pointer outline-none"
          >
            {SITES.map((site) => (
              <option key={site} value={site} className="dark:bg-slate-800">
                {site}
              </option>
            ))}
          </select>
        </div>

        {/* Shift Info */}
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t("currentShift")}
          </span>
          <span className="text-xs font-medium text-slate-900 dark:text-white">
            {t("dayShift")}
          </span>
        </div>

        <div className="hidden lg:block h-6 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#111418]" />
            )}
          </button>

          <AnimatePresence>
            {showAlerts && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowAlerts(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1a2430] rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Recent Alerts
                    </h3>
                    {unreadAlerts.length > 0 && (
                      <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-medium">
                        {unreadAlerts.length} new
                      </span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                    {ALERTS.slice(0, 6).map((alert) => (
                      <div
                        key={alert.id}
                        className={cn(
                          "px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                          !alert.acknowledged && "bg-primary/5 dark:bg-primary/5"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-1 h-2 w-2 rounded-full shrink-0",
                              alertLevelColors[alert.level]
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                              {alert.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              {alert.description}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                              {formatTimeAgo(alert.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setShowAlerts(false)}
                      className="w-full text-center text-xs font-medium text-primary hover:text-primary/80 py-1"
                    >
                      View All Alerts
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
