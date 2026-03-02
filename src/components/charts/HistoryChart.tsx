"use client";

import { useRef, useEffect } from "react";
import * as echarts from "echarts/core";
import {
  LineChart,
  BarChart,
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsCoreOption } from "echarts/core";
import type { DataPoint } from "@/lib/mock/history";
import { useThemeStore } from "@/lib/stores/themeStore";

echarts.use([
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

interface HistoryChartProps {
  data1: DataPoint[];
  data2: DataPoint[];
  label1: string;
  label2: string;
  color1?: string;
  color2?: string;
  unit1?: string;
  unit2?: string;
  alertThreshold?: number;
}

export function HistoryChart({
  data1,
  data2,
  label1,
  label2,
  color1 = "#136dec",
  color2 = "#10b981",
  unit1 = "",
  unit2 = "",
  alertThreshold,
}: HistoryChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { theme } = useThemeStore();

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current, theme === "dark" ? "dark" : undefined);

    const times = data1.map((d) => d.time);

    const option: EChartsCoreOption = {
      backgroundColor: "transparent",
      textStyle: {
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "10%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: theme === "dark" ? "#1a2430" : "#ffffff",
        borderColor: theme === "dark" ? "#2d3b4f" : "#e5e7eb",
        textStyle: {
          color: theme === "dark" ? "#f1f5f9" : "#1e293b",
        },
        formatter: (params: unknown) => {
          const p = params as { axisValue: string; seriesName: string; value: number; color: string }[];
          let html = `<div style="font-size:12px;font-weight:600;margin-bottom:4px">${p[0].axisValue}</div>`;
          p.forEach((item) => {
            const unit = item.seriesName === label1 ? unit1 : unit2;
            html += `<div style="display:flex;align-items:center;gap:8px;margin-top:2px">
              <span style="width:10px;height:10px;border-radius:50%;background:${item.color};display:inline-block"></span>
              <span style="color:${theme === "dark" ? "#94a3b8" : "#64748b"}">${item.seriesName}:</span>
              <span style="font-weight:600">${item.value}${unit}</span>
            </div>`;
          });
          return html;
        },
      },
      legend: {
        data: [label1, label2],
        bottom: 0,
        textStyle: {
          color: theme === "dark" ? "#94a3b8" : "#64748b",
          fontSize: 12,
        },
        icon: "roundRect",
        itemHeight: 4,
        itemWidth: 16,
      },
      xAxis: {
        type: "category",
        data: times,
        axisLine: { lineStyle: { color: theme === "dark" ? "#2d3b4f" : "#e2e8f0" } },
        axisTick: { show: false },
        axisLabel: {
          color: theme === "dark" ? "#64748b" : "#94a3b8",
          fontSize: 11,
          interval: Math.floor(times.length / 6),
        },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: theme === "dark" ? "#64748b" : "#94a3b8",
          fontSize: 11,
        },
        splitLine: {
          lineStyle: {
            color: theme === "dark" ? "#1e2d3d" : "#f1f5f9",
            type: "dashed",
          },
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          name: label1,
          type: "line",
          data: data1.map((d) => d.value),
          smooth: true,
          symbol: "none",
          lineStyle: { color: color1, width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${color1}33` },
              { offset: 1, color: `${color1}00` },
            ]),
          },
          markLine: alertThreshold
            ? {
                silent: true,
                symbol: "none",
                data: [{ yAxis: alertThreshold }],
                lineStyle: { color: "#ef4444", type: "dashed", width: 1.5 },
                label: {
                  formatter: `Threshold: ${alertThreshold}${unit1}`,
                  color: "#ef4444",
                  fontSize: 11,
                },
              }
            : undefined,
        },
        {
          name: label2,
          type: "line",
          data: data2.map((d) => d.value),
          smooth: true,
          symbol: "none",
          lineStyle: { color: color2, width: 2, type: "dashed" },
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [data1, data2, label1, label2, color1, color2, unit1, unit2, alertThreshold, theme]);

  return <div ref={chartRef} className="w-full h-full" />;
}
