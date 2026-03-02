"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { MACHINES } from "@/lib/mock/machines";
import { ALERTS } from "@/lib/mock/alerts";
import { formatTimeAgo, formatDuration } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

const stoppedMachines = MACHINES.filter(
  (m) => m.status === "critical" || m.status === "offline"
);
const maintenanceMachines = MACHINES.filter((m) => m.status === "warning");
const operationalMachines = MACHINES.filter((m) => m.status === "operational");

const statusInfo: Record<string, { label: string; color: string; borderColor: string; bgColor: string; icon: string }> = {
  critical: {
    label: "Engine Fault",
    color: "text-red-500",
    borderColor: "border-red-500/20",
    bgColor: "bg-red-500/10",
    icon: "error",
  },
  offline: {
    label: "Scheduled Maint.",
    color: "text-slate-400",
    borderColor: "border-slate-500/20",
    bgColor: "bg-slate-500/10",
    icon: "engineering",
  },
};

const alertLevelColors: Record<string, { dot: string; text: string; label: string }> = {
  critical: { dot: "bg-red-500", text: "text-red-500", label: "Critical" },
  warning: { dot: "bg-amber-500", text: "text-amber-500", label: "Warning" },
  info: { dot: "bg-blue-500", text: "text-blue-500", label: "Info" },
  resolved: { dot: "bg-green-500", text: "text-green-500", label: "Resolved" },
  normal: { dot: "bg-green-500", text: "text-green-500", label: "Resolved" },
  system: { dot: "bg-slate-400", text: "text-slate-400", label: "System" },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function SummaryPage() {
  const t = useTranslations("summary");
  const tAlerts = useTranslations("alerts");
  const tCommon = useTranslations("common");
  const [page, setPage] = useState(0);
  const perPage = 5;
  const pagedStopped = stoppedMachines.slice(page * perPage, (page + 1) * perPage);

  const kpiCards = [
    {
      label: t("stoppedAssets"),
      value: stoppedMachines.length + maintenanceMachines.length,
      delta: "+2",
      deltaDir: "up",
      color: "red",
      icon: "error",
      hover: "hover:border-red-500/30",
      bg: "bg-red-500/5 group-hover:bg-red-500/10",
      iconBg: "bg-red-500/10 text-red-500",
      deltaBg: "bg-red-500/5 text-red-400 border-red-500/10",
    },
    {
      label: t("maintenanceRequired"),
      value: 45,
      delta: "+5",
      deltaDir: "up",
      color: "amber",
      icon: "handyman",
      hover: "hover:border-amber-500/30",
      bg: "bg-amber-500/5 group-hover:bg-amber-500/10",
      iconBg: "bg-amber-500/10 text-amber-500",
      deltaBg: "bg-amber-500/5 text-amber-400 border-amber-500/10",
    },
    {
      label: t("operationalOk"),
      value: 156,
      delta: "-7",
      deltaDir: "down",
      color: "green",
      icon: "check_circle",
      hover: "hover:border-green-500/30",
      bg: "bg-green-500/5 group-hover:bg-green-500/10",
      iconBg: "bg-green-500/10 text-green-500",
      deltaBg: "bg-slate-500/5 text-slate-400 border-slate-700",
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title={t("title")}
        badge={t("systemOnline")}
        badgeVariant="success"
      />

      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 max-w-[1600px] mx-auto">
          {/* Left Column */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-5">
            {/* Header Text */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("fleetStatus")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                {t("fleetDesc")}
              </p>
            </div>

            {/* KPI Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {kpiCards.map((card) => (
                <motion.div
                  key={card.label}
                  variants={itemVariants}
                  className={cn(
                    "group flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a2430] border border-slate-200 dark:border-[#2d3b4f] transition-all relative overflow-hidden cursor-default",
                    card.hover
                  )}
                >
                  <div
                    className={cn(
                      "absolute right-0 top-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-all",
                      card.bg
                    )}
                  />
                  <div className="flex justify-between items-start z-10">
                    <div className={cn("p-2 rounded-lg", card.iconBg)}>
                      <span className="material-symbols-outlined">{card.icon}</span>
                    </div>
                    <span
                      className={cn(
                        "flex items-center text-xs font-medium px-2 py-1 rounded-full border",
                        card.deltaBg
                      )}
                    >
                      <span className="material-symbols-outlined text-[14px] mr-1">
                        {card.deltaDir === "up" ? "arrow_upward" : "arrow_downward"}
                      </span>
                      {card.delta} {t("today")}
                    </span>
                  </div>
                  <div className="mt-1 z-10">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      {card.label}
                    </p>
                    <p className="text-slate-900 dark:text-white text-3xl font-bold mt-1">
                      {card.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stopped Assets Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold">
                  {t("stoppedBreakdown")}
                </h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1a2430] border border-slate-200 dark:border-[#2d3b4f] rounded-lg hover:bg-slate-50 dark:hover:bg-[#151e29] transition-colors">
                    {tCommon("export")}
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors">
                    {tCommon("viewAll")}
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1a2430] border border-slate-200 dark:border-[#2d3b4f] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-[#151e29] text-xs uppercase font-medium text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="px-5 py-4">{t("machineId")}</th>
                        <th className="px-5 py-4">{t("siteLocation")}</th>
                        <th className="px-5 py-4">{tCommon("status")}</th>
                        <th className="px-5 py-4">{t("downtimeDuration")}</th>
                        <th className="px-5 py-4 text-right">{tCommon("actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#2d3b4f]">
                      {MACHINES.filter(
                        (m) => m.status !== "operational"
                      ).map((machine, idx) => {
                        const isCritical = machine.status === "critical";
                        const isWarning = machine.status === "warning";
                        return (
                          <motion.tr
                            key={machine.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                            className="hover:bg-slate-50 dark:hover:bg-[#151e29]/50 transition-colors"
                          >
                            <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                  <span className="material-symbols-outlined text-[18px]">
                                    {machine.icon}
                                  </span>
                                </div>
                                {machine.name}
                              </div>
                            </td>
                            <td className="px-5 py-4">{machine.site} · {machine.zone}</td>
                            <td className="px-5 py-4">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                                  isCritical && "bg-red-500/10 text-red-500 border-red-500/20",
                                  isWarning && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                                  machine.status === "offline" && "bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                                )}
                              >
                                <span
                                  className={cn(
                                    "size-1.5 rounded-full",
                                    isCritical && "bg-red-500",
                                    isWarning && "bg-amber-500",
                                    machine.status === "offline" && "bg-slate-400"
                                  )}
                                />
                                {isCritical ? "Critical Fault" : isWarning ? "Warning" : "Offline / Maint."}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {machine.status === "offline"
                                ? machine.etaCompletion
                                : formatDuration(
                                    Math.floor(machine.lastSync / 60)
                                  )}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <a
                                href={`summary/../realtime`}
                                className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                              >
                                {tCommon("viewDetail")}
                              </a>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-4 xl:col-span-3"
          >
            <div className="bg-white dark:bg-[#1a2430] border border-slate-200 dark:border-[#2d3b4f] rounded-xl p-5 flex flex-col gap-5 h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold">
                  {t("recentAlerts")}
                </h3>
                <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </button>
              </div>

              {/* Timeline */}
              <div className="relative pl-4 space-y-6 before:absolute before:left-[18px] before:top-2 before:bottom-6 before:w-px before:bg-slate-200 dark:before:bg-[#2d3b4f]">
                {ALERTS.slice(0, 6).map((alert, idx) => {
                  const colors = alertLevelColors[alert.level];
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.07 }}
                      className="relative pl-6"
                    >
                      <div
                        className={cn(
                          "absolute -left-1.5 top-1 size-3 rounded-full ring-4 ring-white dark:ring-[#1a2430]",
                          colors.dot
                        )}
                      />
                      <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-center">
                          <span
                            className={cn(
                              "text-xs font-semibold uppercase tracking-wider",
                              colors.text
                            )}
                          >
                            {tAlerts(alert.level as keyof typeof tAlerts)}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {formatTimeAgo(alert.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {alert.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {alert.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-auto pt-4">
                <button className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-[#2d3b4f] text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#151e29] hover:text-slate-900 dark:hover:text-white transition-colors">
                  {t("viewAllAlerts")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
