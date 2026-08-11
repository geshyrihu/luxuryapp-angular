import { Component, computed, inject, input } from "@angular/core";
import { provideEchartsCore } from "ngx-echarts";
import type { EChartsCoreOption } from "echarts/core";
import type { Meta, StoryObj } from "@storybook/angular-vite";
import { applicationConfig } from "@storybook/angular-vite";
import { ChartWrapper, ChartType } from "./chart-wrapper";
import {
  ChartJsData,
  chartJsToCartesianOption,
  dsThemeTick,
  resolveDsColor,
  trackChartTheme,
} from "./echarts-adapters";
import { ThemeService } from "../../../../core/services/theme.service";

/**
 * Host mínimo para verificar el repintado por tema (RN-DS-015 / RN-DS-040).
 * Inyecta ThemeService y expone un botón que alterna `themeMode()`; el
 * `effect()` de `trackChartTheme()` dispara el repintado del chart en TRES
 * rutas: `data` (chart-wrapper resuelve tokens vía adapters), `options`
 * (consumidor reconstruye las options al cambiar el tema) y `static`
 * (consumidor pasa options congeladas, construidas una sola vez con
 * `resolveDsColor()`). La ruta `static` es la que ejercita el caso congelado
 * de la ruta alterna del computed de chart-wrapper (T3.14).
 */
@Component({
  selector: "sb-chart-host",
  standalone: true,
  imports: [ChartWrapper],
  template: `
    <div style="display:flex;flex-direction:column;gap:1rem">
      <button type="button" (click)="theme.toggleTheme()">
        Alternar tema (actual: {{ theme.themeMode() }})
      </button>
      @if (mode() === "data") {
        <app-chart-wrapper
          [type]="type()"
          [data]="data()"
          [title]="title()"
        ></app-chart-wrapper>
      } @else if (mode() === "static") {
        <app-chart-wrapper
          [options]="staticOptions"
          [title]="title()"
        ></app-chart-wrapper>
      } @else if (mode() === "factory") {
        <app-chart-wrapper
          [optionsFactory]="optionsFactory"
          [title]="title()"
        ></app-chart-wrapper>
      } @else {
        <app-chart-wrapper
          [options]="themedOptions()"
          [title]="title()"
        ></app-chart-wrapper>
      }
    </div>
  `,
})
export class ChartHost {
  theme = inject(ThemeService);
  mode = input<"data" | "options" | "static" | "factory">("data");
  type = input<ChartType>("bar");
  data = input<ChartJsData>({ labels: [], datasets: [] });
  title = input<string>("");

  // Ruta estática: el consumidor arma options UNA sola vez, fuera de todo
  // computed, con colores resueltos vía resolveDsColor() en el momento de la
  // creación. Es el caso realista de pasar [options] ya construidas y
  // "congeladas": pinta en el tema activo al crearse y no reacciona por sí
  // misma. Ejercita la ruta alterna del computed de chart-wrapper (T3.14).
  staticOptions: EChartsCoreOption = this.buildStaticOptions();

  // Ruta factory: el consumidor pasa UNA FUNCIÓN que produce las options en el
  // momento del repintado. ChartWrapper la re-invoca en cada cambio de tema
  // (RN-DS-040), así que resuelve los tokens frescos y el chart SÍ repinta. Es
  // la vía reactiva frente al escape hatch congelado de `options`.
  optionsFactory: (() => EChartsCoreOption) | null = () => this.buildStaticOptions();

  constructor() {
    trackChartTheme();
  }

  private buildStaticOptions(): EChartsCoreOption {
    const c1 = resolveDsColor("--ds-cat-1");
    const c4 = resolveDsColor("--ds-cat-4");
    const textColor = resolveDsColor("--ds-text-secondary");
    const borderColor = resolveDsColor("--ds-border");
    return {
      grid: { left: 8, right: 12, top: 32, bottom: 8, containLabel: true },
      tooltip: { trigger: "axis" },
      legend: { show: true, textStyle: { color: textColor }, top: 0 },
      xAxis: {
        type: "category",
        data: sampleData.labels,
        axisLabel: { color: textColor, fontSize: 11 },
        axisLine: { lineStyle: { color: borderColor } },
        splitLine: { show: false },
      },
      yAxis: [
        {
          type: "value",
          axisLabel: { color: textColor, fontSize: 11 },
          splitLine: { show: true, lineStyle: { color: borderColor } },
        },
      ],
      series: [
        {
          name: "Serie A",
          type: "bar",
          data: sampleData.datasets?.[0]?.data ?? [],
          itemStyle: { color: c1 },
        },
        {
          name: "Serie B",
          type: "bar",
          data: sampleData.datasets?.[1]?.data ?? [],
          itemStyle: { color: c4 },
        },
      ],
    };
  }

  // Ruta alterna: el consumidor construye options y LAS reconstruye al cambiar
  // el tema (dependencia de dsThemeTick). Es el uso correcto cuando se pasa
  // [options] ya construidas a chart-wrapper.
  themedOptions = computed<EChartsCoreOption | null>(() => {
    dsThemeTick();
    if (this.mode() !== "options") return null;
    const o = chartJsToCartesianOption(this.data(), "bar");
    console.log("THEMEDOPTIONS recompute, tick=", dsThemeTick(), "series0=", (o as any).series?.[0]?.itemStyle?.color);
    return o;
  });
}

const sampleData: ChartJsData = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May"],
  datasets: [
    {
      label: "Serie A",
      data: [120, 200, 150, 80, 170],
      backgroundColor: "--ds-cat-1",
      borderColor: "--ds-cat-1",
    },
    {
      label: "Serie B",
      data: [90, 140, 110, 60, 130],
      backgroundColor: "--ds-cat-4",
      borderColor: "--ds-cat-4",
    },
  ],
};

const meta: Meta<ChartWrapper> = {
  title: "Design System/Charts/ChartWrapper",
  component: ChartWrapper,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideEchartsCore({ echarts: () => import("echarts") })],
    }),
  ],
};
export default meta;
type Story = StoryObj<ChartWrapper>;

/** Ruta por defecto: chart-wrapper resuelve los tokens vía adapters. */
export const ConDatos: Story = {
  render: () => ({
    template: `<sb-chart-host [mode]="mode" [type]="type" [data]="data" [title]="title"></sb-chart-host>`,
    moduleMetadata: { imports: [ChartHost] },
    props: {
      mode: "data",
      type: "bar",
      data: sampleData,
      title: "Ventas por mes (ruta data)",
    },
  }),
};

/** Ruta alterna: consumidor pasa options construidas (debe repintar igual). */
export const ConOptions: Story = {
  render: () => ({
    template: `<sb-chart-host [mode]="mode" [data]="data" [title]="title"></sb-chart-host>`,
    moduleMetadata: { imports: [ChartHost] },
    props: {
      mode: "options",
      data: sampleData,
      title: "Ventas por mes (ruta options)",
    },
  }),
};

/**
 * Ruta alterna estática: el consumidor arma options UNA sola vez, con colores
 * resueltos vía resolveDsColor() en el momento de la creación. No reconstruye
 * al cambiar el tema; depende de que chart-wrapper (T3.14) repintado por la
 * dependencia de tema en su computed. Es la variante que ejercita el caso
 * congelado: si el chart NO repinta al alternar el tema, T3.14 no basta.
 */
export const ConOptionsEstaticas: Story = {
  render: () => ({
    template: `<sb-chart-host [mode]="mode" [data]="data" [title]="title"></sb-chart-host>`,
    moduleMetadata: { imports: [ChartHost] },
    props: {
      mode: "static",
      data: sampleData,
      title: "Ventas por mes (ruta options estáticas)",
    },
  }),
};

/**
 * Ruta factory (reactiva): el consumidor pasa `optionsFactory`, una función que
 * ChartWrapper re-invoca en cada cambio de tema. Como la fábrica resuelve los
 * tokens vía resolveDsColor() en el momento de la invocación, el chart SÍ
 * repinta al alternar el tema. Es la vía correcta para opciones construidas por
 * el consumidor cuando dependen de tokens (RN-DS-040).
 */
export const ConOptionsFactory: Story = {
  render: () => ({
    template: `<sb-chart-host [mode]="mode" [data]="data" [title]="title"></sb-chart-host>`,
    moduleMetadata: { imports: [ChartHost] },
    props: {
      mode: "factory",
      data: sampleData,
      title: "Ventas por mes (optionsFactory reactivo)",
    },
  }),
};
