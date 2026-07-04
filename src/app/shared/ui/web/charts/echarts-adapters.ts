import type { EChartsCoreOption } from "echarts/core";

/**
 * Adaptadores para convertir los formatos de datos existentes (Chart.js y
 * ngx-charts) a opciones de ECharts, preservando la API pública de los
 * componentes de charts. Los colores se leen de los tokens del Design System.
 */

export interface ChartJsDataset {
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  pointBackgroundColor?: string;
  hoverBackgroundColor?: string;
  hoverBorderColor?: string;
  borderWidth?: number;
  barPercentage?: number;
  fill?: boolean;
  tension?: number;
  yAxisID?: string;
  type?: string;
}

export interface ChartJsData {
  labels?: (string | number)[];
  datasets?: ChartJsDataset[];
}

export interface NgxChartsDatum {
  name: string;
  value: number;
}

const DS_PALETTE = [
  "#003d9b",
  "#006477",
  "#006837",
  "#b45309",
  "#7c3aed",
  "#ba1a1a",
  "#0891b2",
  "#c2410c",
];

function cssVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name);
  return v?.trim() || fallback;
}

/** Colores base (texto/ejes/grid) desde los tokens del DS. */
export function dsChartTheme() {
  return {
    textColor: cssVar("--ds-text-secondary", "#434654"),
    textMuted: cssVar("--ds-text-muted", "#737685"),
    borderColor: cssVar("--ds-border", "#e2e8f0"),
    surface: cssVar("--ds-bg-surface", "#ffffff"),
  };
}

function firstColor(bg: string | string[] | undefined, i: number): string {
  if (Array.isArray(bg)) return bg[0] || DS_PALETTE[i % DS_PALETTE.length];
  return bg || DS_PALETTE[i % DS_PALETTE.length];
}

/** bar / line / area → opción ECharts cartesiana (soporta doble eje Y). */
export function chartJsToCartesianOption(
  data: ChartJsData | null,
  chartType: "bar" | "line" | "area",
  opts?: { showLegend?: boolean; showGrid?: boolean; dualAxis?: boolean },
): EChartsCoreOption {
  const t = dsChartTheme();
  const labels = data?.labels ?? [];
  const datasets = data?.datasets ?? [];
  const showLegend = opts?.showLegend ?? true;
  const showGrid = opts?.showGrid ?? true;

  const yAxis: any[] = [
    {
      type: "value",
      axisLabel: { color: t.textMuted, fontSize: 11 },
      splitLine: { show: showGrid, lineStyle: { color: t.borderColor } },
    },
  ];
  if (opts?.dualAxis) {
    yAxis.push({
      type: "value",
      position: "right",
      axisLabel: { color: t.textMuted, fontSize: 11 },
      splitLine: { show: false },
    });
  }

  const series = datasets.map((ds, i) => {
    const color = firstColor(ds.backgroundColor ?? ds.borderColor, i);
    const isArea = chartType === "area" || ds.fill;
    return {
      name: ds.label ?? `Serie ${i + 1}`,
      type: chartType === "bar" ? "bar" : "line",
      data: ds.data,
      yAxisIndex: opts?.dualAxis && ds.yAxisID === "y1" ? 1 : i === 1 && opts?.dualAxis ? 1 : 0,
      smooth: chartType === "line" || chartType === "area" ? true : (ds.tension ?? 0) > 0,
      itemStyle: { color },
      ...(chartType !== "bar" && isArea
        ? { areaStyle: { opacity: 0.15 } }
        : {}),
    };
  });

  return {
    grid: { left: 8, right: opts?.dualAxis ? 40 : 12, top: 32, bottom: 8, containLabel: true },
    tooltip: { trigger: "axis" },
    legend: { show: showLegend, textStyle: { color: t.textColor }, top: 0 },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: { color: t.textMuted, fontSize: 11 },
      axisLine: { lineStyle: { color: t.borderColor } },
      splitLine: { show: false },
    },
    yAxis,
    series,
  };
}

/** pie / doughnut a partir de Chart.js {labels, datasets[0].data}. */
export function chartJsToPieOption(
  data: ChartJsData | null,
  opts?: { doughnut?: boolean; showLegend?: boolean },
): EChartsCoreOption {
  const t = dsChartTheme();
  const labels = data?.labels ?? [];
  const values = data?.datasets?.[0]?.data ?? [];
  const bg = data?.datasets?.[0]?.backgroundColor;
  const items = labels.map((name, i) => ({
    name: String(name),
    value: values[i],
    itemStyle: { color: Array.isArray(bg) ? bg[i] : DS_PALETTE[i % DS_PALETTE.length] },
  }));
  return pieOptionFromItems(items, t, opts?.doughnut, opts?.showLegend);
}

/** pie / doughnut a partir de ngx-charts [{name, value}]. */
export function ngxToPieOption(
  results: NgxChartsDatum[],
  scheme?: { domain?: string[] },
  opts?: { doughnut?: boolean; showLegend?: boolean },
): EChartsCoreOption {
  const t = dsChartTheme();
  const domain = scheme?.domain ?? DS_PALETTE;
  const items = (results ?? []).map((r, i) => ({
    name: r.name,
    value: r.value,
    itemStyle: { color: domain[i % domain.length] },
  }));
  return pieOptionFromItems(items, t, opts?.doughnut, opts?.showLegend);
}

function pieOptionFromItems(
  items: any[],
  t: ReturnType<typeof dsChartTheme>,
  doughnut = false,
  showLegend = true,
): EChartsCoreOption {
  return {
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: {
      show: showLegend,
      bottom: 0,
      textStyle: { color: t.textColor },
    },
    series: [
      {
        type: "pie",
        radius: doughnut ? ["45%", "70%"] : "70%",
        center: ["50%", "45%"],
        data: items,
        label: { color: t.textColor },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.2)" },
        },
      },
    ],
  };
}

/** radar a partir de Chart.js {labels, datasets}. */
export function chartJsToRadarOption(
  data: ChartJsData | null,
  opts?: { showLegend?: boolean; max?: number },
): EChartsCoreOption {
  const t = dsChartTheme();
  const labels = data?.labels ?? [];
  const datasets = data?.datasets ?? [];
  const max =
    opts?.max ??
    Math.max(
      1,
      ...datasets.flatMap((d) => d.data.filter((n) => typeof n === "number")),
    ) * 1.1;

  return {
    tooltip: { trigger: "item" },
    legend: {
      show: opts?.showLegend ?? true,
      bottom: 0,
      textStyle: { color: t.textColor },
    },
    radar: {
      indicator: labels.map((name) => ({ name: String(name), max })),
      axisName: { color: t.textColor, fontSize: 11 },
      splitLine: { lineStyle: { color: t.borderColor } },
      axisLine: { lineStyle: { color: t.borderColor } },
      splitArea: { show: false },
    },
    series: [
      {
        type: "radar",
        data: datasets.map((ds, i) => ({
          name: ds.label ?? `Serie ${i + 1}`,
          value: ds.data,
          areaStyle: { opacity: 0.1 },
          lineStyle: { color: firstColor(ds.borderColor ?? ds.backgroundColor, i) },
          itemStyle: { color: firstColor(ds.borderColor ?? ds.backgroundColor, i) },
        })),
      },
    ],
  };
}
