export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "high" | "medium" | "low";
export type TicketType = "auto" | "manual";

export interface MaintenanceTicket {
  id: string;
  machineId: string;
  machineName: string;
  site: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  title: string;
  description: string;
  triggerSensor?: string;
  triggerValue?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  notes?: string;
  resolution?: string;
}

const now = new Date();
const d = (days: number) => new Date(now.getTime() - days * 86400000);
const h = (hours: number) => new Date(now.getTime() - hours * 3600000);

export const TICKETS: MaintenanceTicket[] = [
  {
    id: "TKT-2401",
    machineId: "cat-793f",
    machineName: "CAT-793F",
    site: "Site Beta",
    type: "auto",
    priority: "high",
    status: "open",
    title: "Engine Overtemperature - Immediate Inspection Required",
    description: "Automatic ticket created: Engine temperature exceeded maximum threshold of 110°C. Current reading: 112°C. Asset has been automatically stopped.",
    triggerSensor: "Engine Temperature",
    triggerValue: "112°C (threshold: 110°C)",
    assignedTo: "Miguel Fernandez",
    createdAt: h(2),
    updatedAt: h(2),
    notes: "Engine has been isolated. Awaiting inspection team arrival.",
  },
  {
    id: "TKT-2400",
    machineId: "kom-930e",
    machineName: "KOM-930E",
    site: "Site Alpha",
    type: "auto",
    priority: "medium",
    status: "in_progress",
    title: "Hydraulic Pressure Below Optimal Range",
    description: "Automatic ticket created: Hydraulic pressure sensor reading below optimal range. Value fluctuating between 28-35 PSI, threshold minimum is 30 PSI.",
    triggerSensor: "Hydraulic Pressure",
    triggerValue: "32 PSI (threshold min: 30 PSI)",
    assignedTo: "Carlos Ruiz",
    createdAt: h(15),
    updatedAt: h(8),
    notes: "Hydraulic fluid levels checked - slight leak found in line #3. Repair in progress.",
  },
  {
    id: "TKT-2399",
    machineId: "cat-793d",
    machineName: "CAT-793D",
    site: "Site Alpha",
    type: "manual",
    priority: "medium",
    status: "in_progress",
    title: "Scheduled Preventive Maintenance - 500hr Service",
    description: "Scheduled 500-hour maintenance service. Oil change, filter replacement, brake inspection, and hydraulic system check.",
    assignedTo: "Workshop Team",
    createdAt: d(1),
    updatedAt: h(2),
  },
  {
    id: "TKT-2398",
    machineId: "drill-x20",
    machineName: "DRILL-X20",
    site: "Site Gamma",
    type: "auto",
    priority: "high",
    status: "open",
    title: "Vibration Spike - Drill Head Inspection",
    description: "Automatic ticket created: Abnormal vibration pattern detected. Value reached 6.2 mm/s exceeding maximum threshold of 5.0 mm/s.",
    triggerSensor: "Vibration Level",
    triggerValue: "6.2 mm/s (threshold max: 5.0 mm/s)",
    assignedTo: "Pedro Alonso",
    createdAt: h(3),
    updatedAt: h(3),
  },
  {
    id: "TKT-2397",
    machineId: "cat-797f",
    machineName: "CAT-797F",
    site: "Site Alpha",
    type: "manual",
    priority: "low",
    status: "resolved",
    title: "Tire Pressure Check - Left Rear",
    description: "Operator reported lower pressure sensation on left rear tires. Visual inspection and pressure adjustment completed.",
    assignedTo: "Luis Torres",
    createdAt: d(2),
    updatedAt: d(1),
    resolvedAt: d(1),
    resolution: "Tire pressure adjusted to 105 PSI (optimal range). No damage found.",
  },
  {
    id: "TKT-2396",
    machineId: "kom-pc8000",
    machineName: "KOM-PC8000",
    site: "Site Beta",
    type: "auto",
    priority: "low",
    status: "closed",
    title: "Low Fuel Level Warning",
    description: "Automatic ticket created: Fuel level dropped below 20% threshold.",
    triggerSensor: "Fuel Level",
    triggerValue: "18% (threshold min: 20%)",
    assignedTo: "Fueling Team",
    createdAt: d(3),
    updatedAt: d(3),
    resolvedAt: d(3),
    resolution: "Unit refueled to 95%. No underlying issues.",
  },
  {
    id: "TKT-2395",
    machineId: "cat-793f",
    machineName: "CAT-793F",
    site: "Site Beta",
    type: "manual",
    priority: "medium",
    status: "resolved",
    title: "Oil Pressure Fluctuation Investigation",
    description: "Investigation of intermittent oil pressure drops reported by operator during previous shift.",
    assignedTo: "Miguel Fernandez",
    createdAt: d(5),
    updatedAt: d(4),
    resolvedAt: d(4),
    resolution: "Oil filter found partially clogged. Replaced and system pressure normalized.",
  },
  {
    id: "TKT-2394",
    machineId: "kom-930e",
    machineName: "KOM-930E",
    site: "Site Alpha",
    type: "manual",
    priority: "high",
    status: "closed",
    title: "Emergency Repair - Track Chain Damage",
    description: "Track chain damage discovered during routine inspection. Immediate replacement required.",
    assignedTo: "Emergency Crew",
    createdAt: d(7),
    updatedAt: d(6),
    resolvedAt: d(6),
    resolution: "Track chain replaced. Unit back to full operational status.",
  },
];
