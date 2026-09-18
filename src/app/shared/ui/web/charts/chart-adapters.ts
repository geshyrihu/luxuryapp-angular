import { effect, inject, signal } from "@angular/core";
import type { ChartConfiguration, ChartData, ChartOptions } from "chart.js";
import { ThemeService } from "../../../../core/services/theme.service";

/**
 * Adaptadores para convertir los formatos de datos existentes a configuraciones
 * de Chart.js, preservando la API pública de los componentes de charts.
 */

/**
 * Contador de "versión de tema" compartido. Los motores de canvas/SVG
 * (Chart.js y otros motores de canvas) resuelven `var(--ds-*)` a un color concreto
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
 * Resuelve un color para motores de canvas (Chart.js y ngx-charts)
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

export type ChartConfig = ChartConfiguration<"bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea">;

/** bar / line / area -> configuración cartesiana (soporta doble eje Y). */
export function chartJsToCartesianOption(
  data: ChartJsData | null,
  chartType: "bar" | "line" | "area",
  opts?: { showLegend?: boolean; showGrid?: boolean; dualAxis?: boolean },
): ChartOptions<"bar" | "line"> {
  const t = dsChartTheme();
  const labels = data?.labels ?? [];
  const datasets = data?.datasets ?? [];
  const showLegend = opts?.showLegend ?? true;
  const showGrid = opts?.showGrid ?? true;

  const yAxis: Record<string, unknown> = {
    beginAtZero: true,
    ticks: { color: t.textMuted },
    grid: { display: showGrid, color: t.borderColor },
  };
  if (opts?.dualAxis) {
    (yAxis as Record<string, unknown>).position = "left";
  }
  const scales: Record<string, unknown> = {
    x: { ticks: { color: t.textMuted }, grid: { display: false } },
    y: yAxis,
  };
  if (opts?.dualAxis) {
    scales["y1"] = {
      beginAtZero: true,
      position: "right",
      ticks: { color: t.textMuted },
      grid: { drawOnChartArea: false },
    };
  }
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: showLegend, labels: { color: t.textColor } } },
    scales,
  } as ChartOptions<"bar" | "line">;
}

export function chartJsToCartesianData(
  data: ChartJsData | null,
  chartType: "bar" | "line" | "area",
  opts?: { dualAxis?: boolean },
): ChartData<"bar" | "line"> {
  return {
    labels: data?.labels ?? [],
    datasets: (data?.datasets ?? []).map((ds, i) => {
      const color = firstColor(ds.backgroundColor ?? ds.borderColor, i);
      return {
        label: ds.label ?? `Serie ${i + 1}`,
        data: ds.data,
        type: chartType === "bar" ? "bar" : "line",
        backgroundColor: color,
        borderColor: resolveDsColor(ds.borderColor ?? color),
        borderWidth: ds.borderWidth ?? 1,
        yAxisID: opts?.dualAxis && (ds.yAxisID === "y1" || i === 1) ? "y1" : "y",
        fill: chartType === "area" || ds.fill === true,
        tension: ds.tension ?? (chartType === "line" || chartType === "area" ? 0.2 : 0),
        barPercentage: ds.barPercentage,
      };
    }),
  } as ChartData<"bar" | "line">;
}

/** pie / doughnut a partir de Chart.js {labels, datasets[0].data}. */
export function chartJsToPieOption(
  data: ChartJsData | null,
  opts?: { doughnut?: boolean; showLegend?: boolean },
): ChartOptions<"pie" | "doughnut"> {
  const t = dsChartTheme();
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: opts?.showLegend ?? true, labels: { color: t.textColor } } },
  } as ChartOptions<"pie" | "doughnut">;
}

export function chartJsToPieData(
  data: ChartJsData | null,
): ChartData<"pie" | "doughnut"> {
  const values = data?.datasets?.[0]?.data ?? [];
  const bg = data?.datasets?.[0]?.backgroundColor;
  return {
    labels: data?.labels ?? [],
    datasets: [{
      data: values,
      backgroundColor: values.map((_, i) =>
        resolveDsColor(Array.isArray(bg) ? bg[i] : DS_PALETTE_TOKENS[i % DS_PALETTE_TOKENS.length]),
      ),
      borderWidth: 1,
    }],
  } as ChartData<"pie" | "doughnut">;
}

/** pie / doughnut a partir de ngx-charts [{name, value}]. */
export function ngxToPieOption(
  results: NgxChartsDatum[],
  scheme?: { domain?: string[] },
  opts?: { doughnut?: boolean; showLegend?: boolean },
): ChartOptions<"pie" | "doughnut"> {
  const t = dsChartTheme();
  const domain = scheme?.domain ?? DS_PALETTE_TOKENS;
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: opts?.showLegend ?? true, labels: { color: t.textColor } } },
  } as ChartOptions<"pie" | "doughnut">;
}

export function ngxToPieData(results: NgxChartsDatum[], scheme?: { domain?: string[] }): ChartData<"pie" | "doughnut"> {
  const domain = scheme?.domain ?? DS_PALETTE_TOKENS;
  return {
    labels: (results ?? []).map((r) => r.name),
    datasets: [{
      data: (results ?? []).map((r) => r.value),
      backgroundColor: (results ?? []).map((_, i) => resolveDsColor(domain[i % domain.length])),
    }],
  } as ChartData<"pie" | "doughnut">;
}

/** radar a partir de Chart.js {labels, datasets}. */
export function chartJsToRadarOption(
  data: ChartJsData | null,
  opts?: { showLegend?: boolean; max?: number },
): ChartOptions<"radar"> {
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
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: opts?.showLegend ?? true, labels: { color: t.textColor } } },
    scales: {
      r: {
        suggestedMax: max,
        angleLines: { color: t.borderColor },
        grid: { color: t.borderColor },
        pointLabels: { color: t.textColor },
        ticks: { color: t.textMuted, backdropColor: "transparent" },
      },
    },
  } as ChartOptions<"radar">;
}

export function chartJsToRadarData(data: ChartJsData | null): ChartData<"radar"> {
  return {
    labels: data?.labels ?? [],
    datasets: (data?.datasets ?? []).map((ds, i) => ({
      label: ds.label ?? `Serie ${i + 1}`,
      data: ds.data,
      borderColor: firstColor(ds.borderColor ?? ds.backgroundColor, i),
      backgroundColor: `${firstColor(ds.borderColor ?? ds.backgroundColor, i)}33`,
      pointBackgroundColor: firstColor(ds.pointBackgroundColor ?? ds.borderColor ?? ds.backgroundColor, i),
      borderWidth: ds.borderWidth ?? 2,
    })),
  } as ChartData<"radar">;
}
