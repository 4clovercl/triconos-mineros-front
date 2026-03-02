export type AlertLevel = "critical" | "warning" | "info" | "resolved" | "normal" | "system";

export interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  description: string;
  machineId: string;
  machineName: string;
  sensorId?: string;
  timestamp: Date;
  acknowledged: boolean;
}

const now = new Date();
const m = (mins: number) => new Date(now.getTime() - mins * 60000);

export const ALERTS: Alert[] = [
  {
    id: "a-001",
    level: "critical",
    title: "CAT-793F Engine Overheat",
    description: "Temperature exceeded 115°C threshold. Asset automatically stopped.",
    machineId: "cat-793f",
    machineName: "CAT-793F",
    sensorId: "SENS-TMP-01",
    timestamp: m(2),
    acknowledged: false,
  },
  {
    id: "a-002",
    level: "warning",
    title: "KOM-930E Hydraulic Pressure",
    description: "Pressure fluctuating below optimal range. Maintenance ticket created.",
    machineId: "kom-930e",
    machineName: "KOM-930E",
    sensorId: "SENS-HYD-02",
    timestamp: m(15),
    acknowledged: false,
  },
  {
    id: "a-003",
    level: "info",
    title: "Shift Change Initiated",
    description: "Zone B operators login activity detected.",
    machineId: "",
    machineName: "System",
    timestamp: m(42),
    acknowledged: true,
  },
  {
    id: "a-004",
    level: "warning",
    title: "Connectivity Loss",
    description: "Intermittent signal from North Pit sensors.",
    machineId: "cat-793d",
    machineName: "CAT-793D",
    timestamp: m(60),
    acknowledged: false,
  },
  {
    id: "a-005",
    level: "resolved",
    title: "CAT-793D Jam Cleared",
    description: "Manual intervention completed. Asset back online.",
    machineId: "cat-793d",
    machineName: "CAT-793D",
    timestamp: m(120),
    acknowledged: true,
  },
  {
    id: "a-006",
    level: "critical",
    title: "DRILL-X20 Vibration Spike",
    description: "Abnormal vibration pattern detected in drill head. Value: 6.2 mm/s",
    machineId: "drill-x20",
    machineName: "DRILL-X20",
    sensorId: "SENS-VIB-04",
    timestamp: m(180),
    acknowledged: false,
  },
  {
    id: "a-007",
    level: "warning",
    title: "KOM-PC8000 Low Fuel",
    description: "Fuel level at 34% - approaching minimum threshold of 15%.",
    machineId: "kom-pc8000",
    machineName: "KOM-PC8000",
    sensorId: "SENS-FUEL-01",
    timestamp: m(240),
    acknowledged: true,
  },
  {
    id: "a-008",
    level: "normal",
    title: "CAT-797F Shift Start",
    description: "Operator login: A. Rodriguez (ID: 2201). Unit ready for operation.",
    machineId: "cat-797f",
    machineName: "CAT-797F",
    timestamp: m(480),
    acknowledged: true,
  },
];

export const MACHINE_EVENT_LOGS: Record<string, Alert[]> = {
  "cat-793f": [
    {
      id: "e-001",
      level: "critical",
      title: "Temperature Spike",
      description: "Engine temp exceeded 105°C limit (reached 112°C)",
      machineId: "cat-793f",
      machineName: "CAT-793F",
      sensorId: "SENS-TMP-01",
      timestamp: new Date(now.getTime() - 2 * 60000),
      acknowledged: false,
    },
    {
      id: "e-002",
      level: "warning",
      title: "Vibration Alert",
      description: "Abnormal vibration pattern detected in rear axle",
      machineId: "cat-793f",
      machineName: "CAT-793F",
      sensorId: "SENS-VIB-04",
      timestamp: new Date(now.getTime() - 55 * 60000),
      acknowledged: false,
    },
    {
      id: "e-003",
      level: "system",
      title: "Sensor Disconnect",
      description: "GPS Module intermittent signal loss",
      machineId: "cat-793f",
      machineName: "CAT-793F",
      sensorId: "SYS-GPS-MAIN",
      timestamp: new Date(now.getTime() - 26 * 3600000),
      acknowledged: true,
    },
    {
      id: "e-004",
      level: "normal",
      title: "Shift Start",
      description: "Operator login: J. Perez (ID: 4421)",
      machineId: "cat-793f",
      machineName: "CAT-793F",
      sensorId: "AUTH-SYS",
      timestamp: new Date(now.getTime() - 32 * 3600000),
      acknowledged: true,
    },
  ],
};
