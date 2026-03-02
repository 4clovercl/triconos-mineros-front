"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { USERS, AppUser, UserPermissions } from "@/lib/mock/users";
import { SITES } from "@/lib/mock/sites";
import { formatTimeAgo } from "@/lib/utils/formatters";
import { UserRole } from "@/lib/stores/authStore";
import { cn } from "@/lib/utils/cn";

const ROLE_CONFIG: Record<UserRole, { badge: string; icon: string; label: string }> = {
  admin: {
    badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    icon: "admin_panel_settings",
    label: "Admin",
  },
  operator: {
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: "engineering",
    label: "Operator",
  },
  viewer: {
    badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    icon: "visibility",
    label: "Viewer",
  },
};

interface UserEditPanelProps {
  user: AppUser | null;
  isNew: boolean;
  onClose: () => void;
}

const PERMISSIONS_LIST: {
  key: keyof UserPermissions;
  nameKey: string;
  descKey: string;
}[] = [
  { key: "viewSensor", nameKey: "perms.viewSensor", descKey: "perms.viewSensorDesc" },
  { key: "acknowledgeAlerts", nameKey: "perms.acknowledgeAlerts", descKey: "perms.acknowledgeAlertsDesc" },
  { key: "calibrateSensors", nameKey: "perms.calibrateSensors", descKey: "perms.calibrateSensorsDesc" },
  { key: "manageTickets", nameKey: "perms.manageTickets", descKey: "perms.manageTicketsDesc" },
  { key: "manageUsers", nameKey: "perms.manageUsers", descKey: "perms.manageUsersDesc" },
  { key: "manageConfigs", nameKey: "perms.manageConfigs", descKey: "perms.manageConfigsDesc" },
];

function UserEditPanel({ user, isNew, onClose }: UserEditPanelProps) {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");

  const [formName, setFormName] = useState(user?.name || "");
  const [formEmail, setFormEmail] = useState(user?.email || "");
  const [formRole, setFormRole] = useState<UserRole>(user?.role || "operator");
  const [formSites, setFormSites] = useState<string[]>(user?.assignedSites || []);
  const [formPerms, setFormPerms] = useState<UserPermissions>(
    user?.permissions || {
      viewSensor: true,
      acknowledgeAlerts: false,
      calibrateSensors: false,
      manageTickets: false,
      manageUsers: false,
      manageConfigs: false,
    }
  );

  const toggleSite = (siteId: string) => {
    setFormSites((prev) =>
      prev.includes(siteId) ? prev.filter((s) => s !== siteId) : [...prev, siteId]
    );
  };

  const togglePerm = (key: keyof UserPermissions) => {
    setFormPerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const initials = formName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="w-full lg:w-[400px] shrink-0 flex flex-col h-full border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111418]"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {isNew ? t("createUser") : t("editUser")}
        </h3>
        <div className="flex gap-1">
          {!isNew && (
            <button className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Avatar */}
        <div className="flex justify-center mb-2">
          <div className="relative group cursor-pointer">
            <div
              className={cn(
                "size-24 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white dark:ring-[#1c2027] bg-gradient-to-br",
                user?.avatarColor || "from-primary to-blue-600"
              )}
            >
              {initials || "??"}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white">edit</span>
            </div>
          </div>
        </div>

        {/* Name & Email */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {t("fullName")}
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#1c2027] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {t("email")}
            </label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#1c2027] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Role & Sites */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {t("roleAccess")}
          </h4>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {tCommon("role")}
            </label>
            <select
              value={formRole}
              onChange={(e) => setFormRole(e.target.value as UserRole)}
              className="w-full bg-slate-50 dark:bg-[#1c2027] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            >
              <option value="admin">{t("admin")}</option>
              <option value="operator">{t("operator")}</option>
              <option value="viewer">{t("viewer")}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {t("assignedSites")}
            </label>
            <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-[#1c2027] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              {SITES.map((site) => (
                <label
                  key={site.id}
                  className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formSites.includes(site.id)}
                    onChange={() => toggleSite(site.id)}
                    className="rounded border-slate-300 text-primary focus:ring-primary/50 bg-transparent"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    {site.name} ({site.type})
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Granular Permissions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {t("granularPerms")}
            </h4>
            <button
              onClick={() =>
                setFormPerms({
                  viewSensor: true,
                  acknowledgeAlerts: true,
                  calibrateSensors: true,
                  manageTickets: true,
                  manageUsers: true,
                  manageConfigs: true,
                })
              }
              className="text-xs text-primary hover:underline"
            >
              {tCommon("selectAll")}
            </button>
          </div>
          <div className="space-y-3">
            {PERMISSIONS_LIST.map((perm) => (
              <div key={perm.key} className="flex items-start gap-3">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={formPerms[perm.key]}
                    onChange={() => togglePerm(perm.key)}
                    className="rounded border-slate-300 text-primary focus:ring-primary/50 bg-transparent"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                    {t(perm.nameKey as keyof typeof t)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {t(perm.descKey as keyof typeof t)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161a20]">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {tCommon("cancel")}
          </button>
          <button className="flex-1 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium text-sm shadow-sm shadow-primary/25 transition-colors">
            {tCommon("save")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function UsersPage() {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [page, setPage] = useState(0);
  const perPage = 8;

  const filtered = USERS.filter((u) => {
    const matchSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleSelectUser = (u: AppUser) => {
    setIsCreating(false);
    setSelectedUser(selectedUser?.id === u.id ? null : u);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsCreating(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title={t("title")} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111418]">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("title")}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                {t("subtitle")}
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm shadow-primary/25 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              {t("addUser")}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111418]">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email..."
                className="w-full bg-slate-50 dark:bg-[#1c2027] border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white dark:bg-[#1c2027] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="viewer">Viewer</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white dark:bg-[#1c2027] border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white dark:bg-[#111418] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#1c2027] border-b border-slate-200 dark:border-slate-800">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("userDetails")}
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {tCommon("role")}
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden md:table-cell">
                      {t("assignedSites")}
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {tCommon("status")}
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                      {t("lastActive")}
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                      {tCommon("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paged.map((user, idx) => {
                    const roleCfg = ROLE_CONFIG[user.role];
                    const isSelected = selectedUser?.id === user.id;
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => handleSelectUser(user)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected
                            ? "bg-primary/5 dark:bg-primary/10 border-l-2 border-l-primary"
                            : "hover:bg-slate-50 dark:hover:bg-[#1c2027]/50"
                        )}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "size-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm bg-gradient-to-br",
                                user.avatarColor
                              )}
                            >
                              {user.initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {user.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
                              roleCfg.badge
                            )}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {roleCfg.icon}
                            </span>
                            {roleCfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          {user.assignedSites.length === SITES.length ? (
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {t("globalAccess")}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {user.assignedSites
                                .map((sid) => {
                                  const site = SITES.find((s) => s.id === sid);
                                  return site?.name || sid;
                                })
                                .join(", ")}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                              user.status === "active"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                            )}
                          >
                            <span className="size-1.5 rounded-full bg-current" />
                            {user.status === "active"
                              ? tCommon("active")
                              : tCommon("inactive")}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                          {formatTimeAgo(user.lastActive)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-5 py-4 bg-slate-50 dark:bg-[#1c2027] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} of{" "}
                  {filtered.length} users
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#111418] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#111418] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Side Panel */}
        <AnimatePresence>
          {(selectedUser || isCreating) && (
            <UserEditPanel
              user={selectedUser}
              isNew={isCreating}
              onClose={() => {
                setSelectedUser(null);
                setIsCreating(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
