"use client";

import { useState, useEffect, useCallback } from "react";
import { Machine, MACHINES, MachineTelemetry } from "@/lib/mock/machines";
import { clampRandom } from "@/lib/utils/formatters";

function fluctuateTelemetry(
  current: MachineTelemetry,
  status: Machine["status"]
): MachineTelemetry {
  if (status === "offline") return current;

  const v = status === "critical" ? 3 : status === "warning" ? 2 : 1;

  return {
    temperature: clampRandom(current.temperature, v * 2),
    oilPressure: clampRandom(current.oilPressure, v),
    vibration: Math.max(0, clampRandom(current.vibration, v * 0.3)),
    fuel: Math.max(0, Math.min(100, current.fuel - 0.1)),
    voltage: clampRandom(current.voltage, 0.1),
    speed: Math.max(0, clampRandom(current.speed, v * 2)),
    load: Math.max(0, clampRandom(current.load, v * 5)),
    airPressure: clampRandom(current.airPressure, 1),
    hydraulic: clampRandom(current.hydraulic, v * 3),
    rpm: Math.max(0, clampRandom(current.rpm, v * 50)),
  };
}

export function useRealTimeData(intervalMs = 5000) {
  const [machines, setMachines] = useState<Machine[]>(MACHINES);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const update = useCallback(() => {
    setMachines((prev) =>
      prev.map((m) => ({
        ...m,
        telemetry: fluctuateTelemetry(m.telemetry, m.status),
        lastSync: Math.max(0, m.lastSync + intervalMs / 1000),
      }))
    );
    setLastUpdate(new Date());
  }, [intervalMs]);

  useEffect(() => {
    const timer = setInterval(update, intervalMs);
    return () => clearInterval(timer);
  }, [update, intervalMs]);

  return { machines, lastUpdate };
}

export function useSingleMachineData(machineId: string, intervalMs = 3000) {
  const { machines, lastUpdate } = useRealTimeData(intervalMs);
  const machine = machines.find((m) => m.id === machineId);
  return { machine, lastUpdate };
}
