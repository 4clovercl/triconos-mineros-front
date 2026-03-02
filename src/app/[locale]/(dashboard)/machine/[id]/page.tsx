"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { HistoryChart } from "@/components/charts/HistoryChart";
import { useSingleMachineData } from "@/lib/hooks/useRealTimeData";
import { getMachineById } from "@/lib/mock/machines";
import { MACHINE_EVENT_LOGS, ALERTS } from "@/lib/mock/alerts";
import { getHistoricalData } from "@/lib/mock/history";
import { formatTimeAgo } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

type Period = "1h" | "24h" | "7d" | "30d";

const PERIODS: Period[] = ["1h", "24h", "7d", "30d"];

const alertLevelConfig: Record<string, { badge: string; dot: string }> = {
  critical: {
    badge: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
    dot: "bg-red-600 dark:bg-red-400",
  },
  warning: {
    badge: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    dot: "bg-yellow-600 dark:bg-yellow-400",
  },
  normal: {
    badge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
    dot: "bg-green-600 dark:bg-green-400",
  },
  system: {
    badge: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
    dot: "bg-slate-500 dark:bg-slate-400",
  },
  info: {
    badge: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  resolved: {
    badge: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
    dot: "bg-green-500",
  },
};

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "flat";
  trendPct: string;
  trendColor: "green" | "red" | "amber" | "slate";
}

function MetricCard({ label, value, unit, trend, trendPct, trendColor }: MetricCardProps) {
  const trendIcons = { up: "trending_up", down: "trending_down", flat: "remove" };
  const trendClasses = {
    green: "text-green-500 bg-green-500/10",
    red: "text-red-500 bg-red-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    slate: "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800",
  };

  return (
    <div className="group flex flex-col gap-1 rounded-xl p-4 bg-white dark:bg-[#1c222b] border border-slate-200 dark:border-[#3b4554] shadow-sm hover:border-primary/50 transition-all">
      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="text-slate-900 dark:text-white text-2xl font-bold">
        {value}
        <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
      </p>
      <div
        className={cn(
          "flex items-center text-xs font-medium px-1.5 py-0.5 rounded w-fit mt-1",
          trendClasses[trendColor]
        )}
      >
        <span className="material-symbols-outlined text-[14px] mr-0.5">
          {trendIcons[trend]}
        </span>
        {trendPct}
      </div>
    </div>
  );
}

export default function MachineDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);
  const locale = useLocale();
  const t = useTranslations("machine");
  const tAlerts = useTranslations("alerts");
  const tMetrics = useTranslations("metrics");
  const [period, setPeriod] = useState<Period>("24h");
  const [eventFilter, setEventFilter] = useState("all");

  const staticMachine = getMachineById(id);
  if (!staticMachine) notFound();

  const { machine } = useSingleMachineData(id, 3000);
  const current = machine || staticMachine;
  const m = current.telemetry;

  const histData = getHistoricalData(id, period);

  const eventLogs =
    MACHINE_EVENT_LOGS[id] ||
    ALERTS.filter((a) => a.machineId === id).map((a, i) => ({
      ...a,
      id: `ev-${i}`,
    }));

  const filteredEvents = eventLogs.filter(
    (e) => eventFilter === "all" || e.level === eventFilter
  );

  const statusColors = {
    operational: "bg-green-500/10 text-green-500 ring-green-500/20",
    warning: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
    critical: "bg-red-500/10 text-red-500 ring-red-500/20",
    offline: "bg-slate-100 dark:bg-slate-800 text-slate-500",
  };

  const metricCards: MetricCardProps[] = [
    { label: tMetrics("temperature"), value: `${Math.round(m.temperature)}`, unit: "°C", trend: "up", trendPct: "2%", trendColor: m.temperature > 100 ? "red" : "green" },
    { label: tMetrics("hydraulic"), value: `${Math.round(m.hydraulic)}`, unit: "bar", trend: "flat", trendPct: "0%", trendColor: "slate" },
    { label: tMetrics("fuel"), value: `${Math.round(m.fuel)}`, unit: "%", trend: "down", trendPct: "12%", trendColor: m.fuel < 25 ? "red" : "green" },
    { label: tMetrics("oilPressure"), value: `${Math.round(m.oilPressure)}`, unit: "PSI", trend: "down", trendPct: "1%", trendColor: m.oilPressure < 35 ? "red" : "green" },
    { label: tMetrics("voltage"), value: `${m.voltage.toFixed(1)}`, unit: "V", trend: "flat", trendPct: "0%", trendColor: "slate" },
    { label: tMetrics("rpm"), value: `${Math.round(m.rpm)}`, unit: "", trend: "up", trendPct: "5%", trendColor: "green" },
    { label: tMetrics("vibration"), value: `${m.vibration.toFixed(1)}`, unit: "mm/s", trend: "up", trendPct: m.vibration > 3 ? "High" : "OK", trendColor: m.vibration > 4 ? "red" : m.vibration > 2.5 ? "amber" : "green" },
    { label: tMetrics("payload"), value: `${m.load.toFixed(1)}`, unit: "T", trend: "up", trendPct: "OK", trendColor: "green" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title={`${current.name} · ${current.typeLabel}`} />

      <main className="flex-1 overflow-y-auto bg-[#f6f7f8] dark:bg-[#101822]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 mb-5 text-sm">
            <Link
              href={`/${locale}/realtime`}
              className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-500 dark:text-slate-400">{current.site}</span>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white font-medium">
              {current.name}
            </span>
          </div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5 mb-7"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {current.name}
                </h1>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset capitalize",
                    statusColors[current.status]
                  )}
                >
                  {current.status}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-base">
                {current.site} – {current.zone} · {current.model} ·{" "}
                {t("lastSync")}:{" "}
                {current.lastSync < 120
                  ? `${Math.floor(current.lastSync)}s ago`
                  : `${Math.floor(current.lastSync / 60)}m ago`}
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-slate-100 dark:bg-[#282f39] text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span>
                {t("generateReport")}
              </button>
              <Link
                href={`/${locale}/realtime`}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white hover:bg-blue-600 text-sm font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                {t("backToDashboard")}
              </Link>
            </div>
          </motion.div>

          {/* Telemetry Cards */}
          <section className="mb-7">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              {t("currentTelemetry")}
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3"
            >
              {metricCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <MetricCard {...card} />
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Charts + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-7">
            {/* Main Chart */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 flex flex-col rounded-xl bg-white dark:bg-[#1c222b] border border-slate-200 dark:border-[#3b4554] shadow-sm"
            >
              <div className="p-5 border-b border-slate-200 dark:border-[#3b4554] flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t("performanceHistory")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("engineLoadFuel")}
                  </p>
                </div>
                <div className="flex items-center bg-slate-100 dark:bg-[#282f39] rounded-lg p-1">
                  {PERIODS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded transition-all",
                        period === p
                          ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-5 h-[320px]">
                <HistoryChart
                  data1={histData.engineTemp}
                  data2={histData.fuel}
                  label1={`${tMetrics("temperature")} (°C)`}
                  label2={`${tMetrics("fuel")} (%)`}
                  unit1="°C"
                  unit2="%"
                  alertThreshold={110}
                />
              </div>
            </motion.div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col rounded-xl bg-white dark:bg-[#1c222b] border border-slate-200 dark:border-[#3b4554] shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-[#3b4554] flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t("currentLocation")}
                </h3>
                <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                  {t("viewFullMap")}
                </button>
              </div>
              {/* Map placeholder */}
              <div className="flex-1 relative bg-slate-800 min-h-[200px]">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=800&q=70')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c222b] to-transparent" />
                {/* Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_20px_rgba(19,109,236,0.6)] animate-pulse" />
                  <div className="mt-2 bg-white dark:bg-[#282f39] px-2 py-1 rounded text-xs font-bold text-slate-900 dark:text-white shadow-lg whitespace-nowrap">
                    {current.zone}
                  </div>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Latitude</p>
                  <p className="font-mono text-slate-900 dark:text-white text-xs">
                    {current.latitude}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Longitude</p>
                  <p className="font-mono text-slate-900 dark:text-white text-xs">
                    {current.longitude}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Event Log */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-white dark:bg-[#1c222b] border border-slate-200 dark:border-[#3b4554] shadow-sm overflow-hidden mb-8"
          >
            <div className="p-5 border-b border-slate-200 dark:border-[#3b4554] flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t("eventLog")}
                </h3>
                {filteredEvents.filter((e) => !e.acknowledged).length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {filteredEvents.filter((e) => !e.acknowledged).length}{" "}
                    {t("newAlerts")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="appearance-none bg-slate-100 dark:bg-[#282f39] border-none text-slate-700 dark:text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-primary outline-none"
                  >
                    <option value="all">{t("allEvents")}</option>
                    <option value="warning">{t("warnings")}</option>
                    <option value="critical">{t("critical")}</option>
                    <option value="normal">{t("maintenance")}</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-slate-500">
                    expand_more
                  </span>
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#282f39] text-slate-500 dark:text-slate-400 transition-colors">
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-[#282f39]/50 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Timestamp</th>
                    <th className="px-5 py-4">Event Type</th>
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4">Sensor ID</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#3b4554]">
                  {(filteredEvents.length > 0 ? filteredEvents : eventLogs).map(
                    (event) => {
                      const cfg =
                        alertLevelConfig[event.level] ||
                        alertLevelConfig.system;
                      return (
                        <tr
                          key={event.id}
                          className={cn(
                            "hover:bg-slate-50 dark:hover:bg-[#282f39] transition-colors",
                            !event.acknowledged &&
                              event.level === "critical" &&
                              "bg-red-50 dark:bg-red-500/5"
                          )}
                        >
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-bold",
                                cfg.badge
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  cfg.dot
                                )}
                              />
                              {tAlerts(event.level as keyof typeof tAlerts)}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-slate-900 dark:text-white font-medium">
                            {event.timestamp.toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            {event.title.split(" ").slice(-2).join(" ")}
                          </td>
                          <td className="px-5 py-4 text-slate-700 dark:text-slate-300 max-w-xs">
                            {event.description}
                          </td>
                          <td className="px-5 py-4 font-mono text-xs">
                            {event.sensorId || "SYS"}
                          </td>
                          <td className="px-5 py-4 text-right">
                            {!event.acknowledged ? (
                              <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                                {t("acknowledge")}
                              </button>
                            ) : (
                              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium transition-colors">
                                {t("details")}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
