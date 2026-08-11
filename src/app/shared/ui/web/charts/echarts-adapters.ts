import type { EChartsCoreOption } from "echarts/core";
import { effect, inject, signal } from "@angular/core";
import { ThemeService } from "../../../../core/services/theme.service";

/**
 * Adaptadores para convertir los formatos de datos existentes (Chart.js y
 * ngx-charts) a opciones de ECharts, preservando la API pública de los
 * componentes de charts. Los colores se leen de los tokens del Design System.
 */

/**
 * Contador de "versión de tema" compartido. Los motores de canvas/SVG
 * (ECharts, Chart.js, ngx-charts) resuelven `var(--ds-*)` a un color concreto
 * en el momento del pintado y PIERDEN la reactividad que `var()` da gratis en
 * CSS. Cualquier función que resuelva un token en JS lee `dsThemeTick` para
 * registrarse como dependencia; cuando el tema cambia, `trackChartTheme()`
 * incrementa el contador y los `computed`/plantillas que dependen de él se
 * reevalúan y repintan. (RN-DS-015, RN-DS-040)
 */
export const dsThemeTick = signal(0);

/**
 * Registra la dependencia de tema de un componente que pinta en canvas/SVG.
 * Llamar UNA vez desde el constructor del componente. Crea un `effect()` que
 * lee `themeMode()` (quedando registrado como dependencia) e incrementa
 * `dsThemeTick`, forzando el repintado de las opciones del chart.
 * No usar `untracked()` sobre `themeMode()`. (RN-DS-040)
 */
export function trackChartTheme(): void {
  const theme = inject(ThemeService);
  effect(() => {
    theme.themeMode();
    dsThemeTick.update((n) => n + 1);
  });
}

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

const DS_PALETTE_TOKENS = [
  "--ds-cat-1",
  "--ds-cat-2",
  "--ds-cat-3",
  "--ds-cat-4",
  "--ds-cat-5",
  "--ds-cat-6",
  "--ds-cat-7",
  "--ds-cat-8",
];

function cssVar(name: string, fallback: string): string {
  // Registra la dependencia de tema: al cambiar, los computed/plantillas que
  // llaman a esta función se reevalúan y repintan (RN-DS-040).
  dsThemeTick();
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name);
  console.log("CSSVAR", name, "=>", JSON.stringify(v), "tick", dsThemeTick());
  return v?.trim() || fallback;
}

/**
 * Resuelve un color para motores de canvas/SVG (ECharts, Chart.js, ngx-charts)
 * que NO resuelven `var()`. Si `color` es un token (`--x` o `var(--x)`) devuelve
 * su valor computado; si ya es un color concreto lo devuelve igual. (RN-DS-036)
 */
export function resolveDsColor(color: string): string {
  if (!color) return color;
  let name = color;
  if (color.startsWith("var(")) {
    const m = color.match(/var\(\s*(--[\w-]+)/);
    if (!m) return color;
    name = m[1];
  } else if (!color.startsWith("--")) {
    return color;
  }
  return cssVar(name, color);
}

/** Colores base (texto/ejes/grid) desde los tokens del DS. */
export function dsChartTheme() {
  return {
    textColor: cssVar("--ds-text-secondary", "CanvasText"),
    textMuted: cssVar("--ds-text-muted", "GrayText"),
    borderColor: cssVar("--ds-border", "ButtonBorder"),
    surface: cssVar("--ds-bg-surface", "Canvas"),
  };
}

function firstColor(bg: string | string[] | undefined, i: number): string {
  const fb = resolveDsColor(DS_PALETTE_TOKENS[i % DS_PALETTE_TOKENS.length]);
  if (Array.isArray(bg)) return resolveDsColor(bg[0]) || fb;
  return resolveDsColor(bg) || fb;
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
    itemStyle: { color: resolveDsColor(Array.isArray(bg) ? bg[i] : DS_PALETTE_TOKENS[i % DS_PALETTE_TOKENS.length]) },
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
  const domain = scheme?.domain ?? DS_PALETTE_TOKENS;
  const items = (results ?? []).map((r, i) => ({
    name: r.name,
    value: r.value,
    itemStyle: { color: resolveDsColor(domain[i % domain.length]) },
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
