export interface DataPoint {
  time: string;
  value: number;
}

export interface HistoricalData {
  engineTemp: DataPoint[];
  fuel: DataPoint[];
  oilPressure: DataPoint[];
  vibration: DataPoint[];
  rpm: DataPoint[];
}

function generateTimeSeries(
  baseValue: number,
  variance: number,
  count: number,
  period: "1h" | "24h" | "7d" | "30d"
): DataPoint[] {
  const points: DataPoint[] = [];
  const now = new Date();
  let intervalMs: number;
  let format: (d: Date) => string;

  switch (period) {
    case "1h":
      intervalMs = 60000 * 5; // 5 min intervals
      format = (d) =>
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      break;
    case "24h":
      intervalMs = 3600000; // 1 hour intervals
      format = (d) =>
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      break;
    case "7d":
      intervalMs = 86400000; // 1 day intervals
      format = (d) =>
        d.toLocaleDateString([], { month: "short", day: "numeric" });
      break;
    case "30d":
      intervalMs = 86400000 * 1; // 1 day
      format = (d) =>
        d.toLocaleDateString([], { month: "short", day: "numeric" });
      break;
  }

  let current = baseValue;
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervalMs);
    current = Math.max(
      baseValue - variance,
      Math.min(
        baseValue + variance,
        current + (Math.random() - 0.5) * variance * 0.5
      )
    );
    points.push({ time: format(time), value: Math.round(current * 10) / 10 });
  }

  return points;
}

export function getHistoricalData(
  machineId: string,
  period: "1h" | "24h" | "7d" | "30d"
): HistoricalData {
  const countMap = { "1h": 12, "24h": 24, "7d": 7, "30d": 30 };
  const count = countMap[period];

  const baseValues: Record<string, Record<string, number>> = {
    "cat-793f": { temp: 108, fuel: 28, oil: 44, vib: 4.2, rpm: 100 },
    "kom-930e": { temp: 86, fuel: 66, oil: 33, vib: 2.0, rpm: 1650 },
    "cat-797f": { temp: 91, fuel: 88, oil: 50, vib: 1.2, rpm: 1800 },
    "drill-x20": { temp: 64, fuel: 47, oil: 55, vib: 1.9, rpm: 1800 },
    "cat-793d": { temp: 0, fuel: 55, oil: 0, vib: 0, rpm: 0 },
    "kom-pc8000": { temp: 88, fuel: 36, oil: 51, vib: 1.5, rpm: 1720 },
  };

  const base = baseValues[machineId] || {
    temp: 85, fuel: 60, oil: 45, vib: 1.5, rpm: 1700,
  };

  return {
    engineTemp: generateTimeSeries(base.temp, 8, count, period),
    fuel: generateTimeSeries(base.fuel, 5, count, period),
    oilPressure: generateTimeSeries(base.oil, 6, count, period),
    vibration: generateTimeSeries(base.vib, 0.8, count, period),
    rpm: generateTimeSeries(base.rpm, 150, count, period),
  };
}
