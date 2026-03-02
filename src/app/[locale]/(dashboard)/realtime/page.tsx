"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { useRealTimeData } from "@/lib/hooks/useRealTimeData";
import { Machine, MachineType } from "@/lib/mock/machines";
import { cn } from "@/lib/utils/cn";

const FILTERS: { key: string; label: string; type?: MachineType }[] = [
  { key: "all", label: "allUnits" },
  { key: "excavator", label: "excavators", type: "excavator" },
  { key: "haul_truck", label: "haulTrucks", type: "haul_truck" },
  { key: "drill", label: "drills", type: "drill" },
  { key: "conveyor", label: "conveyors", type: "conveyor" },
];

const STATUS_CONFIG = {
  critical: {
    bar: "bg-red-500",
    border: "border-red-500/50",
    badge: "bg-red-500/10 text-red-500 ring-red-500/20",
    label: "Critical",
  },
  warning: {
    bar: "bg-amber-500",
    border: "border-amber-500/30",
    badge: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
    label: "Warning",
  },
  operational: {
    bar: "bg-green-500",
    border: "border-slate-200 dark:border-slate-700",
    badge: "bg-green-500/10 text-green-500 ring-green-500/20",
    label: "Operational",
  },
  offline: {
    bar: "bg-slate-400",
    border: "border-dashed border-slate-300 dark:border-slate-700",
    badge: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
    label: "Offline",
  },
};

function MetricBar({
  value,
  max,
  status,
}: {
  value: number;
  max: number;
  status: "ok" | "warn" | "crit";
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          status === "crit" && "bg-red-500",
          status === "warn" && "bg-amber-500",
          status === "ok" && "bg-green-500"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function MachineCard({ machine, locale }: { machine: Machine; locale: string }) {
  const t = useTranslations("metrics");
  const tRt = useTranslations("realtime");
  const statusCfg = STATUS_CONFIG[machine.status];
  const isOffline = machine.status === "offline";
  const m = machine.telemetry;

  const tempStatus =
    m.temperature > 105 ? "crit" : m.temperature > 95 ? "warn" : "ok";
  const oilStatus =
    m.oilPressure < 30 ? "crit" : m.oilPressure < 40 ? "warn" : "ok";
  const fuelStatus =
    m.fuel < 15 ? "crit" : m.fuel < 30 ? "warn" : "ok";
  const vibStatus =
    m.vibration > 5 ? "crit" : m.vibration > 3 ? "warn" : "ok";

  const tempColor =
    tempStatus === "crit"
      ? "text-red-500"
      : tempStatus === "warn"
      ? "text-amber-500"
      : "text-slate-900 dark:text-white";
  const oilColor =
    oilStatus === "crit"
      ? "text-red-500"
      : oilStatus === "warn"
      ? "text-amber-500"
      : "text-slate-900 dark:text-white";

  const lastSyncLabel =
    machine.lastSync < 120
      ? `${Math.floor(machine.lastSync)}s ago`
      : `${Math.floor(machine.lastSync / 60)}m ago`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-white dark:bg-[#1a222c] shadow-sm transition-all hover:shadow-md dark:shadow-none",
        statusCfg.border,
        isOffline && "opacity-70"
      )}
    >
      {/* Status bar top */}
      <div className={cn("absolute top-0 left-0 h-1 w-full", statusCfg.bar)} />

      <div className="p-5 pt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700/60">
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-3xl">
                {machine.icon}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {machine.name}
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {machine.typeLabel} · {machine.zone}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
              statusCfg.badge
            )}
          >
            {statusCfg.label}
          </span>
        </div>

        {/* Metrics */}
        {isOffline ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl mb-2">
              engineering
            </span>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {tRt("scheduledMaint")}
            </p>
            {machine.etaCompletion && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {tRt("etaCompletion")}: {machine.etaCompletion}
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* Temperature */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("temperature")}
              </span>
              <div className="flex items-end gap-1">
                <span className={cn("text-lg font-bold", tempColor)}>
                  {Math.round(m.temperature)}°C
                </span>
                {tempStatus !== "ok" && (
                  <span
                    className={cn(
                      "material-symbols-outlined text-sm mb-1",
                      tempColor
                    )}
                  >
                    {tempStatus === "crit" ? "arrow_upward" : "warning"}
                  </span>
                )}
              </div>
              <MetricBar value={m.temperature} max={130} status={tempStatus} />
            </div>

            {/* Oil Pressure */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("oilPressure")}
              </span>
              <div className="flex items-end gap-1">
                <span className={cn("text-lg font-bold", oilColor)}>
                  {Math.round(m.oilPressure)} PSI
                </span>
                {oilStatus !== "ok" && (
                  <span
                    className={cn(
                      "material-symbols-outlined text-sm mb-1",
                      oilColor
                    )}
                  >
                    arrow_downward
                  </span>
                )}
              </div>
              <MetricBar value={m.oilPressure} max={80} status={oilStatus} />
            </div>

            {/* Vibration */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("vibration")}
              </span>
              <div className="flex items-end gap-1">
                <span
                  className={cn(
                    "text-lg font-bold",
                    vibStatus !== "ok"
                      ? vibStatus === "crit"
                        ? "text-red-500"
                        : "text-amber-500"
                      : "text-slate-900 dark:text-white"
                  )}
                >
                  {m.vibration.toFixed(1)} mm/s
                </span>
                {vibStatus !== "ok" && (
                  <span
                    className={cn(
                      "material-symbols-outlined text-sm mb-1",
                      vibStatus === "crit" ? "text-red-500" : "text-amber-500"
                    )}
                  >
                    warning
                  </span>
                )}
              </div>
            </div>

            {/* Fuel */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("fuel")}
              </span>
              <div className="flex items-end gap-1">
                <span
                  className={cn(
                    "text-lg font-bold",
                    fuelStatus !== "ok"
                      ? fuelStatus === "crit"
                        ? "text-red-500"
                        : "text-amber-500"
                      : "text-slate-900 dark:text-white"
                  )}
                >
                  {Math.round(m.fuel)}%
                </span>
              </div>
              <MetricBar value={m.fuel} max={100} status={fuelStatus} />
            </div>

            {/* Small metrics row */}
            <div className="col-span-2 grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 uppercase">
                  {t("voltage")}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-white">
                  {m.voltage.toFixed(1)}V
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 uppercase">
                  {t("speed")}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-white">
                  {Math.round(m.speed)} km/h
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 uppercase">
                  {t("load")}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-white">
                  {Math.round(m.load)}T
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 uppercase">Air</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-white">
                  {Math.round(m.airPressure)}psi
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-3">
          <span className="text-xs text-slate-400">
            {isOffline
              ? `${tRt("lastSeen")}: ${Math.floor(machine.lastSync / 3600)}h ago`
              : `${tRt("updatedAgo")}: ${lastSyncLabel}`}
          </span>
          {!isOffline && (
            <Link
              href={`/${locale}/machine/${machine.id}`}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View Detail →
            </Link>
          )}
          {isOffline && (
            <button className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Maintenance Log →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function RealtimePage() {
  const t = useTranslations("realtime");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { machines, lastUpdate } = useRealTimeData(5000);

  const filtered = useMemo(() => {
    return machines.filter((m) => {
      const matchSearch =
        search === "" ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        activeFilter === "all" ||
        m.type === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [machines, search, activeFilter]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title={t("globalOps")}
        badge={t("systemOp")}
        badgeVariant="success"
      />

      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        {/* Search & Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("title")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a222c] py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    activeFilter === filter.key
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white dark:bg-[#1a222c] text-slate-700 dark:text-slate-400 ring-1 ring-inset ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  )}
                >
                  {t(filter.label as keyof typeof t)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Machine Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((machine) => (
              <MachineCard key={machine.id} machine={machine} locale={locale} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-16 text-center"
            >
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3">
                search_off
              </span>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No machines found
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Last Update */}
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Last updated:{" "}
          {lastUpdate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
          {" · "}Auto-refreshes every 5s
        </p>
      </main>
    </div>
  );
}
