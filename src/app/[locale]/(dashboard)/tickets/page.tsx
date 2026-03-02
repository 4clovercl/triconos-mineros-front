"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { TICKETS, MaintenanceTicket, TicketStatus, TicketPriority } from "@/lib/mock/tickets";
import { formatTimeAgo } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

const STATUS_CONFIG: Record<TicketStatus, { label: string; badge: string; dot: string }> = {
  open: { label: "Open", badge: "bg-red-500/10 text-red-500 border-red-500/20", dot: "bg-red-500" },
  in_progress: { label: "In Progress", badge: "bg-blue-500/10 text-blue-500 border-blue-500/20", dot: "bg-blue-500" },
  resolved: { label: "Resolved", badge: "bg-green-500/10 text-green-500 border-green-500/20", dot: "bg-green-500" },
  closed: { label: "Closed", badge: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700", dot: "bg-slate-400" },
};

const PRIORITY_CONFIG: Record<TicketPriority, { badge: string }> = {
  high: { badge: "bg-red-500/10 text-red-600 dark:text-red-400" },
  medium: { badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  low: { badge: "bg-green-500/10 text-green-600 dark:text-green-400" },
};

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
  { key: "closed", label: "Closed" },
];

function TicketDetailPanel({
  ticket,
  onClose,
}: {
  ticket: MaintenanceTicket;
  onClose: () => void;
}) {
  const t = useTranslations("tickets");
  const statusCfg = STATUS_CONFIG[ticket.status];
  const priorityCfg = PRIORITY_CONFIG[ticket.priority];

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="w-full lg:w-[420px] shrink-0 flex flex-col h-full border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111418] overflow-hidden"
    >
      {/* Panel Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">{t("ticketDetails")}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ticket.id}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Status row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
              statusCfg.badge
            )}
          >
            <span className={cn("size-1.5 rounded-full", statusCfg.dot)} />
            {statusCfg.label}
          </span>
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize",
              priorityCfg.badge
            )}
          >
            {ticket.priority} Priority
          </span>
          {ticket.type === "auto" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              {t("auto")}
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">
            {ticket.title}
          </h4>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t("machine")}</p>
            <p className="font-medium text-slate-900 dark:text-white">{ticket.machineName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t("createdAt")}</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {formatTimeAgo(ticket.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t("assignedTo")}</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {ticket.assignedTo || "Unassigned"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{tCommonSite()}</p>
            <p className="font-medium text-slate-900 dark:text-white">{ticket.site}</p>
          </div>
        </div>

        {/* Auto-trigger info */}
        {ticket.type === "auto" && ticket.triggerSensor && (
          <div className="rounded-lg bg-purple-500/5 border border-purple-500/20 p-3">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">
              <span className="material-symbols-outlined text-[14px] mr-1 align-middle">auto_awesome</span>
              {t("autoGenerated")}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-medium">{ticket.triggerSensor}:</span>{" "}
              {ticket.triggerValue}
            </p>
          </div>
        )}

        {/* Description */}
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{t("description")}</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {ticket.description}
          </p>
        </div>

        {/* Notes */}
        {ticket.notes && (
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{t("notes")}</p>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3">
              <p className="text-sm text-slate-700 dark:text-slate-300">{ticket.notes}</p>
            </div>
          </div>
        )}

        {/* Resolution */}
        {ticket.resolution && (
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{t("resolution")}</p>
            <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-3">
              <p className="text-sm text-slate-700 dark:text-slate-300">{ticket.resolution}</p>
            </div>
          </div>
        )}
      </div>

      {/* Panel Footer */}
      {(ticket.status === "open" || ticket.status === "in_progress") && (
        <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#161a20]">
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Update Status
            </button>
            <button className="flex-1 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
              {ticket.status === "open" ? "Start Work" : "Mark Resolved"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function tCommonSite() {
  return "Site";
}

export default function TicketsPage() {
  const t = useTranslations("tickets");
  const tCommon = useTranslations("common");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);

  const filtered = TICKETS.filter((ticket) => {
    const matchStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchSearch =
      search === "" ||
      ticket.machineName.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: TICKETS.length,
    open: TICKETS.filter((t) => t.status === "open").length,
    in_progress: TICKETS.filter((t) => t.status === "in_progress").length,
    resolved: TICKETS.filter((t) => t.status === "resolved").length,
    closed: TICKETS.filter((t) => t.status === "closed").length,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title={t("title")} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111418]">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t("title")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                {t("subtitle")}
              </p>
            </div>
            <button className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all text-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              {t("addTicket")}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111418]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="w-full bg-slate-50 dark:bg-[#1c2027] border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>

            {/* Status tabs */}
            <div className="flex gap-1.5 overflow-x-auto">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={cn(
                    "whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    statusFilter === f.key
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      "ml-1.5 px-1.5 py-0.5 rounded-full text-xs",
                      statusFilter === f.key
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {counts[f.key as keyof typeof counts]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="bg-white dark:bg-[#111418] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-[#1c2027] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("ticketId")}
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("machine")}
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("type")}
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("priority")}
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {tCommon("status")}
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("createdAt")}
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("assignedTo")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((ticket, idx) => {
                    const statusCfg = STATUS_CONFIG[ticket.status];
                    const priorityCfg = PRIORITY_CONFIG[ticket.priority];
                    const isSelected = selectedTicket?.id === ticket.id;
                    return (
                      <motion.tr
                        key={ticket.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() =>
                          setSelectedTicket(isSelected ? null : ticket)
                        }
                        className={cn(
                          "cursor-pointer transition-colors group",
                          isSelected
                            ? "bg-primary/5 dark:bg-primary/10 border-l-2 border-l-primary"
                            : "hover:bg-slate-50 dark:hover:bg-[#1c2027]/50"
                        )}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-medium text-slate-900 dark:text-white">
                              {ticket.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {ticket.machineName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {ticket.site}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                              ticket.type === "auto"
                                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            )}
                          >
                            {ticket.type === "auto" && (
                              <span className="material-symbols-outlined text-[12px]">
                                auto_awesome
                              </span>
                            )}
                            {ticket.type === "auto" ? t("auto") : t("manual")}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize",
                              priorityCfg.badge
                            )}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                              statusCfg.badge
                            )}
                          >
                            <span
                              className={cn("size-1.5 rounded-full", statusCfg.dot)}
                            />
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">
                          {formatTimeAgo(ticket.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-slate-700 dark:text-slate-300 text-sm">
                          {ticket.assignedTo || (
                            <span className="text-slate-400">Unassigned</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-slate-400 dark:text-slate-500"
                      >
                        No tickets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <AnimatePresence>
          {selectedTicket && (
            <TicketDetailPanel
              ticket={selectedTicket}
              onClose={() => setSelectedTicket(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
