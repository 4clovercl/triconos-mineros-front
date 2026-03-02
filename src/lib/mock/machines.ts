export type MachineStatus = "operational" | "warning" | "critical" | "offline";
export type MachineType = "haul_truck" | "excavator" | "drill" | "conveyor" | "dozer";

export interface MachineTelemetry {
  temperature: number;
  oilPressure: number;
  vibration: number;
  fuel: number;
  voltage: number;
  speed: number;
  load: number;
  airPressure: number;
  hydraulic: number;
  rpm: number;
}

export interface Machine {
  id: string;
  name: string;
  model: string;
  type: MachineType;
  typeLabel: string;
  icon: string;
  status: MachineStatus;
  site: string;
  siteId: string;
  zone: string;
  lastSync: number; // seconds ago
  telemetry: MachineTelemetry;
  latitude: string;
  longitude: string;
  etaCompletion?: string;
  operatorId?: string;
}

export const MACHINES: Machine[] = [
  {
    id: "cat-793f",
    name: "CAT-793F",
    model: "Caterpillar 793F",
    type: "haul_truck",
    typeLabel: "Haul Truck",
    icon: "local_shipping",
    status: "critical",
    site: "Site Beta",
    siteId: "site-beta",
    zone: "Zone B4",
    lastSync: 2,
    latitude: "-23.6980° S",
    longitude: "133.8807° E",
    telemetry: {
      temperature: 112,
      oilPressure: 45,
      vibration: 4.8,
      fuel: 24,
      voltage: 24.1,
      speed: 0,
      load: 0,
      airPressure: 120,
      hydraulic: 180,
      rpm: 0,
    },
  },
  {
    id: "kom-930e",
    name: "KOM-930E",
    model: "Komatsu 930E",
    type: "excavator",
    typeLabel: "Excavator",
    icon: "precision_manufacturing",
    status: "warning",
    site: "Site Alpha",
    siteId: "site-alpha",
    zone: "Pit 3",
    lastSync: 15,
    latitude: "-23.7120° S",
    longitude: "133.9012° E",
    telemetry: {
      temperature: 88,
      oilPressure: 32,
      vibration: 2.1,
      fuel: 68,
      voltage: 23.8,
      speed: 5,
      load: 12,
      airPressure: 118,
      hydraulic: 240,
      rpm: 1650,
    },
  },
  {
    id: "cat-797f",
    name: "CAT-797F",
    model: "Caterpillar 797F",
    type: "haul_truck",
    typeLabel: "Haul Truck",
    icon: "local_shipping",
    status: "operational",
    site: "Site Alpha",
    siteId: "site-alpha",
    zone: "Zone A1",
    lastSync: 60,
    latitude: "-23.6850° S",
    longitude: "133.8650° E",
    telemetry: {
      temperature: 92,
      oilPressure: 50,
      vibration: 1.2,
      fuel: 91,
      voltage: 24.2,
      speed: 42,
      load: 210,
      airPressure: 120,
      hydraulic: 235,
      rpm: 1800,
    },
  },
  {
    id: "drill-x20",
    name: "DRILL-X20",
    model: "Atlas Copco PV351",
    type: "drill",
    typeLabel: "Rotary Drill",
    icon: "hardware",
    status: "operational",
    site: "Site Gamma",
    siteId: "site-gamma",
    zone: "Pit 2",
    lastSync: 30,
    latitude: "-23.7200° S",
    longitude: "133.9200° E",
    telemetry: {
      temperature: 65,
      oilPressure: 55,
      vibration: 1.8,
      fuel: 45,
      voltage: 24.0,
      speed: 0,
      load: 85,
      airPressure: 110,
      hydraulic: 200,
      rpm: 1800,
    },
  },
  {
    id: "cat-793d",
    name: "CAT-793D",
    model: "Caterpillar 793D",
    type: "haul_truck",
    typeLabel: "Haul Truck",
    icon: "local_shipping",
    status: "offline",
    site: "Site Alpha",
    siteId: "site-alpha",
    zone: "Workshop",
    lastSync: 7200,
    etaCompletion: "4h 30m",
    latitude: "-23.6900° S",
    longitude: "133.8700° E",
    telemetry: {
      temperature: 0,
      oilPressure: 0,
      vibration: 0,
      fuel: 55,
      voltage: 0,
      speed: 0,
      load: 0,
      airPressure: 0,
      hydraulic: 0,
      rpm: 0,
    },
  },
  {
    id: "kom-pc8000",
    name: "KOM-PC8000",
    model: "Komatsu PC8000",
    type: "excavator",
    typeLabel: "Excavator",
    icon: "precision_manufacturing",
    status: "operational",
    site: "Site Beta",
    siteId: "site-beta",
    zone: "Pit 1",
    lastSync: 42,
    latitude: "-23.7050° S",
    longitude: "133.8900° E",
    telemetry: {
      temperature: 89,
      oilPressure: 52,
      vibration: 1.5,
      fuel: 34,
      voltage: 24.1,
      speed: 2,
      load: 10,
      airPressure: 118,
      hydraulic: 245,
      rpm: 1720,
    },
  },
];

export function getMachineById(id: string): Machine | undefined {
  return MACHINES.find((m) => m.id === id);
}

export function getMachinesByStatus(status: MachineStatus): Machine[] {
  return MACHINES.filter((m) => m.status === status);
}
