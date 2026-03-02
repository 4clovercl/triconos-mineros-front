import { UserRole } from "@/lib/stores/authStore";

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/summary": ["admin", "operator", "viewer"],
  "/realtime": ["admin", "operator", "viewer"],
  "/machine": ["admin", "operator", "viewer"],
  "/tickets": ["admin", "operator", "viewer"],
  "/users": ["admin"],
  "/configurations": ["admin"],
};

export function canAccess(role: UserRole, path: string): boolean {
  const allowed = ROUTE_PERMISSIONS[path];
  if (!allowed) return false;
  return allowed.includes(role);
}

export function getDefaultRoute(role: UserRole): string {
  return "/summary";
}

export function getSidebarItems(role: UserRole) {
  const items = [
    {
      key: "summary",
      icon: "analytics",
      path: "/summary",
      roles: ["admin", "operator", "viewer"] as UserRole[],
    },
    {
      key: "realtime",
      icon: "speed",
      path: "/realtime",
      roles: ["admin", "operator", "viewer"] as UserRole[],
    },
    {
      key: "tickets",
      icon: "build",
      path: "/tickets",
      roles: ["admin", "operator", "viewer"] as UserRole[],
    },
    {
      key: "users",
      icon: "group",
      path: "/users",
      roles: ["admin"] as UserRole[],
      dividerBefore: true,
    },
    {
      key: "configurations",
      icon: "settings",
      path: "/configurations",
      roles: ["admin"] as UserRole[],
    },
  ];

  return items.filter((item) => item.roles.includes(role));
}
