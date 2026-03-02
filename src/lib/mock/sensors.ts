export interface SensorThreshold {
  id: string;
  name: string;
  nameKey: string;
  unit: string;
  icon: string;
  iconColor: string;
  min: number;
  idealMin: number;
  idealMax: number;
  max: number | null;
  status: "active" | "pending" | "alert";
  autoTicket: boolean;
}

export type MachineThresholds = Record<string, SensorThreshold[]>;

const DEFAULT_THRESHOLDS: SensorThreshold[] = [
  {
    id: "engine_temp",
    name: "Engine Temperature",
    nameKey: "sensors.engineTemp",
    unit: "°C",
    icon: "thermometer",
    iconColor: "text-red-500 bg-red-100 dark:bg-red-900/20",
    min: 60,
    idealMin: 85,
    idealMax: 95,
    max: 110,
    status: "active",
    autoTicket: true,
  },
  {
    id: "oil_pressure",
    name: "Oil Pressure",
    nameKey: "sensors.oilPressure",
    unit: "PSI",
    icon: "oil_barrel",
    iconColor: "text-amber-500 bg-amber-100 dark:bg-amber-900/20",
    min: 25,
    idealMin: 40,
    idealMax: 60,
    max: 80,
    status: "active",
    autoTicket: true,
  },
  {
    id: "hydraulic",
    name: "Hydraulic Pressure",
    nameKey: "sensors.hydraulic",
    unit: "bar",
    icon: "water_drop",
    iconColor: "text-blue-500 bg-blue-100 dark:bg-blue-900/20",
    min: 150,
    idealMin: 200,
    idealMax: 250,
    max: 300,
    status: "pending",
    autoTicket: false,
  },
  {
    id: "vibration",
    name: "Vibration Level",
    nameKey: "sensors.vibration",
    unit: "mm/s",
    icon: "vibration",
    iconColor: "text-purple-500 bg-purple-100 dark:bg-purple-900/20",
    min: 0,
    idealMin: 0,
    idealMax: 2.5,
    max: 5.0,
    status: "active",
    autoTicket: true,
  },
  {
    id: "fuel",
    name: "Fuel Level",
    nameKey: "sensors.fuel",
    unit: "%",
    icon: "local_gas_station",
    iconColor: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20",
    min: 10,
    idealMin: 30,
    idealMax: 100,
    max: null,
    status: "active",
    autoTicket: false,
  },
  {
    id: "tire_pressure",
    name: "Tire Pressure (Avg)",
    nameKey: "sensors.tirePressure",
    unit: "PSI",
    icon: "radio_button_unchecked",
    iconColor: "text-slate-500 bg-slate-100 dark:bg-slate-800",
    min: 90,
    idealMin: 100,
    idealMax: 110,
    max: 125,
    status: "active",
    autoTicket: false,
  },
  {
    id: "voltage",
    name: "Battery Voltage",
    nameKey: "sensors.voltage",
    unit: "V",
    icon: "bolt",
    iconColor: "text-teal-500 bg-teal-100 dark:bg-teal-900/20",
    min: 22,
    idealMin: 24,
    idealMax: 28,
    max: 30,
    status: "active",
    autoTicket: false,
  },
  {
    id: "load",
    name: "Load Capacity",
    nameKey: "sensors.load",
    unit: "T",
    icon: "weight",
    iconColor: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/20",
    min: 0,
    idealMin: 0,
    idealMax: 35,
    max: 42,
    status: "alert",
    autoTicket: true,
  },
];

export function getMachineThresholds(machineId: string): SensorThreshold[] {
  return DEFAULT_THRESHOLDS.map((t) => ({ ...t }));
}
