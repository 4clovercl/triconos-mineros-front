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
    description: "La temperatura superó el umbral de 115°C. El activo se detuvo automáticamente.",
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
    description: "La presión fluctúa por debajo del rango óptimo. Se creó un ticket de mantenimiento.",
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
    description: "Se detectó actividad de inicio de sesión de operadores en la Zona B.",
    machineId: "",
    machineName: "System",
    timestamp: m(42),
    acknowledged: true,
  },
  {
    id: "a-004",
    level: "warning",
    title: "Connectivity Loss",
    description: "Señal intermitente de los sensores del North Pit.",
    machineId: "cat-793d",
    machineName: "CAT-793D",
    timestamp: m(60),
    acknowledged: false,
  },
  {
    id: "a-005",
    level: "resolved",
    title: "CAT-793D Jam Cleared",
    description: "Intervención manual completada. El activo volvió a estar en línea.",
    machineId: "cat-793d",
    machineName: "CAT-793D",
    timestamp: m(120),
    acknowledged: true,
  },
  {
    id: "a-006",
    level: "critical",
    title: "DRILL-X20 Vibration Spike",
    description: "Se detectó un patrón de vibración anormal en la cabeza del taladro. Valor: 6.2 mm/s",
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
    description: "Nivel de combustible al 34% - acercándose al umbral mínimo del 15%.",
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
    description: "Inicio de sesión del operador: A. Rodriguez (ID: 2201). Unidad lista para operar.",
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
      description: "La temperatura del motor superó el límite de 105°C (alcanzó 112°C)",
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
      description: "Se detectó un patrón de vibración anormal en el eje trasero",
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
      description: "Pérdida intermitente de señal del módulo GPS",
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
      description: "Inicio de sesión del operador: J. Perez (ID: 4421)",
      machineId: "cat-793f",
      machineName: "CAT-793F",
      sensorId: "AUTH-SYS",
      timestamp: new Date(now.getTime() - 32 * 3600000),
      acknowledged: true,
    },
  ],
};