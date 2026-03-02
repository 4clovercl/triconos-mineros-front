import { UserRole } from "@/lib/stores/authStore";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  avatarColor: string;
  assignedSites: string[];
  status: "active" | "inactive";
  lastActive: Date;
  permissions: UserPermissions;
}

export interface UserPermissions {
  viewSensor: boolean;
  acknowledgeAlerts: boolean;
  calibrateSensors: boolean;
  manageTickets: boolean;
  manageUsers: boolean;
  manageConfigs: boolean;
}

const adminPerms: UserPermissions = {
  viewSensor: true,
  acknowledgeAlerts: true,
  calibrateSensors: true,
  manageTickets: true,
  manageUsers: true,
  manageConfigs: true,
};

const operatorPerms: UserPermissions = {
  viewSensor: true,
  acknowledgeAlerts: true,
  calibrateSensors: false,
  manageTickets: true,
  manageUsers: false,
  manageConfigs: false,
};

const viewerPerms: UserPermissions = {
  viewSensor: true,
  acknowledgeAlerts: false,
  calibrateSensors: false,
  manageTickets: false,
  manageUsers: false,
  manageConfigs: false,
};

const now = new Date();
const d = (days: number) => new Date(now.getTime() - days * 86400000);
const h = (hours: number) => new Date(now.getTime() - hours * 3600000);

export const USERS: AppUser[] = [
  {
    id: "u-001",
    name: "Carlos Mendoza",
    email: "admin@triconos.com",
    role: "admin",
    initials: "CM",
    avatarColor: "from-purple-500 to-indigo-600",
    assignedSites: ["site-alpha", "site-beta", "site-gamma"],
    status: "active",
    lastActive: h(1),
    permissions: adminPerms,
  },
  {
    id: "u-002",
    name: "Ana Rodriguez",
    email: "operator@triconos.com",
    role: "operator",
    initials: "AR",
    avatarColor: "from-emerald-500 to-teal-600",
    assignedSites: ["site-alpha"],
    status: "active",
    lastActive: h(0.5),
    permissions: operatorPerms,
  },
  {
    id: "u-003",
    name: "Roberto Silva",
    email: "viewer@triconos.com",
    role: "viewer",
    initials: "RS",
    avatarColor: "from-orange-400 to-red-500",
    assignedSites: ["site-alpha", "site-gamma"],
    status: "active",
    lastActive: h(3),
    permissions: viewerPerms,
  },
  {
    id: "u-004",
    name: "Maria Gonzalez",
    email: "maria.g@triconos.com",
    role: "operator",
    initials: "MG",
    avatarColor: "from-pink-500 to-rose-500",
    assignedSites: ["site-beta"],
    status: "inactive",
    lastActive: d(2),
    permissions: operatorPerms,
  },
  {
    id: "u-005",
    name: "Diego Herrera",
    email: "diego.h@triconos.com",
    role: "operator",
    initials: "DH",
    avatarColor: "from-blue-500 to-cyan-600",
    assignedSites: ["site-gamma"],
    status: "active",
    lastActive: h(6),
    permissions: {
      ...operatorPerms,
      calibrateSensors: true,
    },
  },
  {
    id: "u-006",
    name: "Isabel Torres",
    email: "isabel.t@triconos.com",
    role: "viewer",
    initials: "IT",
    avatarColor: "from-amber-500 to-orange-600",
    assignedSites: ["site-alpha", "site-beta"],
    status: "active",
    lastActive: d(1),
    permissions: viewerPerms,
  },
];
