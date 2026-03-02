"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { MACHINES } from "@/lib/mock/machines";
import { SITES } from "@/lib/mock/sites";
import { getMachineThresholds, SensorThreshold } from "@/lib/mock/sensors";
import { cn } from "@/lib/utils/cn";

type SensorStatus = "active" | "pending" | "alert";

const STATUS_CONFIG: Record<SensorStatus, { badge: string; label: string }> = {
  active: {
    badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    label: "Active",
  },
  pending: {
    badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    label: "Pending",
  },
  alert: {
    badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    label: "Alert",
  },
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2"
      aria-label={label}
    >
      <div
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out",
          checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out m-0.5",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </div>
    </button>
  );
}

export default function ConfigurationsPage() {
  const t = useTranslations("configurations");
  const tCommon = useTranslations("common");

  const [selectedSite, setSelectedSite] = useState(SITES[0].id);
  const [selectedMachineId, setSelectedMachineId] = useState(MACHINES[0].id);
  const [thresholds, setThresholds] = useState<SensorThreshold[]>(
    getMachineThresholds(MACHINES[0].id)
  );
  const [saved, setSaved] = useState(false);

  const siteMachines = MACHINES.filter((m) => m.siteId === selectedSite);

  const handleSiteChange = (siteId: string) => {
    setSelectedSite(siteId);
    const firstMachine = MACHINES.find((m) => m.siteId === siteId);
    if (firstMachine) {
      setSelectedMachineId(firstMachine.id);
      setThresholds(getMachineThresholds(firstMachine.id));
    }
  };

  const handleMachineChange = (machineId: string) => {
    setSelectedMachineId(machineId);
    setThresholds(getMachineThresholds(machineId));
  };

  const updateThreshold = (
    id: string,
    field: keyof SensorThreshold,
    value: unknown
  ) => {
    setThresholds((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setThresholds(getMachineThresholds(selectedMachineId));
    setSaved(false);
  };

  const selectedMachine = MACHINES.find((m) => m.id === selectedMachineId);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title={t("title")} />

      <main className="flex-1 overflow-y-auto bg-[#f6f7f8] dark:bg-[#101822]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t("title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Selection Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#1c2430] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">filter_alt</span>
              {t("selectionContext")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t("selectSite")}
                </label>
                <div className="relative">
                  <select
                    value={selectedSite}
                    onChange={(e) => handleSiteChange(e.target.value)}
                    className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#111418] text-slate-900 dark:text-white px-4 focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer outline-none transition-all"
                  >
                    {SITES.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name} - {site.location}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t("selectMachine")}
                </label>
                <div className="relative">
                  <select
                    value={selectedMachineId}
                    onChange={(e) => handleMachineChange(e.target.value)}
                    className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#111418] text-slate-900 dark:text-white px-4 focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer outline-none transition-all"
                    disabled={siteMachines.length === 0}
                  >
                    {siteMachines.map((machine) => (
                      <option key={machine.id} value={machine.id}>
                        {machine.typeLabel} #{machine.name}
                      </option>
                    ))}
                    {siteMachines.length === 0 && (
                      <option>No machines in this site</option>
                    )}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {selectedMachine && (
              <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  {selectedMachine.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedMachine.name} · {selectedMachine.model}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedMachine.site} · {selectedMachine.zone} ·{" "}
                    <span
                      className={cn(
                        "capitalize font-medium",
                        selectedMachine.status === "operational" && "text-green-500",
                        selectedMachine.status === "warning" && "text-amber-500",
                        selectedMachine.status === "critical" && "text-red-500",
                        selectedMachine.status === "offline" && "text-slate-400"
                      )}
                    >
                      {selectedMachine.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sensor Parameters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-[#1c2430] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("sensorParameters")}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {t("sensorParamsDesc")}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  {tCommon("reset")}
                </button>
                <button
                  onClick={handleSave}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 shadow-sm",
                    saved
                      ? "bg-green-500 text-white"
                      : "bg-primary hover:bg-blue-600 text-white shadow-primary/20"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {saved ? "check" : "save"}
                  </span>
                  {saved ? "Saved!" : tCommon("save")}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#161b22] border-b border-slate-200 dark:border-slate-700">
                    <th className="py-4 px-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("sensorName")}
                    </th>
                    <th className="py-4 px-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-40">
                      {t("minimumAlert")}
                    </th>
                    <th className="py-4 px-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-44">
                      {t("idealRange")}
                    </th>
                    <th className="py-4 px-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-40">
                      {t("maximumAlert")}
                    </th>
                    <th className="py-4 px-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-36 text-center">
                      {t("autoTicket")}
                    </th>
                    <th className="py-4 px-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-24 text-right">
                      {tCommon("status")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {thresholds.map((sensor, idx) => {
                    const statusCfg = STATUS_CONFIG[sensor.status];
                    return (
                      <motion.tr
                        key={sensor.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 + idx * 0.04 }}
                        className="group hover:bg-slate-50 dark:hover:bg-[#161b22] transition-colors"
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "p-2 rounded-lg",
                                sensor.iconColor
                              )}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                {sensor.icon}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white text-sm">
                                {sensor.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Unit: {sensor.unit}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Min */}
                        <td className="py-4 px-5">
                          <input
                            type="number"
                            value={sensor.min}
                            onChange={(e) =>
                              updateThreshold(
                                sensor.id,
                                "min",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#111418] text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                          />
                        </td>

                        {/* Ideal Range */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={sensor.idealMin}
                              onChange={(e) =>
                                updateThreshold(
                                  sensor.id,
                                  "idealMin",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#111418] text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            />
                            <span className="text-slate-400 text-xs shrink-0">–</span>
                            <input
                              type="number"
                              value={sensor.idealMax}
                              onChange={(e) =>
                                updateThreshold(
                                  sensor.id,
                                  "idealMax",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#111418] text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            />
                          </div>
                        </td>

                        {/* Max */}
                        <td className="py-4 px-5">
                          {sensor.max !== null ? (
                            <input
                              type="number"
                              value={sensor.max}
                              onChange={(e) =>
                                updateThreshold(
                                  sensor.id,
                                  "max",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#111418] text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            />
                          ) : (
                            <input
                              type="text"
                              value="N/A"
                              disabled
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm cursor-not-allowed"
                            />
                          )}
                        </td>

                        {/* Auto Ticket Toggle */}
                        <td className="py-4 px-5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Toggle
                              checked={sensor.autoTicket}
                              onChange={(val) =>
                                updateThreshold(sensor.id, "autoTicket", val)
                              }
                              label={t("autoTicketDesc")}
                            />
                            <span
                              className={cn(
                                "text-[10px] font-medium",
                                sensor.autoTicket
                                  ? "text-primary"
                                  : "text-slate-400"
                              )}
                            >
                              {sensor.autoTicket ? "ON" : "OFF"}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5 text-right">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              statusCfg.badge
                            )}
                          >
                            {statusCfg.label}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1c2027] flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {thresholds.length} of {thresholds.length} active sensors
              </p>
              <div className="flex gap-2">
                <button className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
                  Documentation
                </button>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <button className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
                  Support
                </button>
              </div>
            </div>
          </motion.div>

          {/* Last updated */}
          <div className="flex justify-end pb-8">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t("lastUpdated")} Admin CM {t("on")}{" "}
              {new Date().toLocaleDateString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
