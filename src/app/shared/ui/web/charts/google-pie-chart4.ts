import { DecimalPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  signal,
  viewChild,
} from "@angular/core";
import {
  GoogleChartType,
  Ng2GoogleChartsModule,
  type GoogleChartInterface,
} from "ng2-google-charts";
import type { ChartJsData } from "./chart-adapters";

interface PieLegendItem {
  label: string;
  percentage: number;
  color: string;
}

interface SliceCallout {
  label: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  textX: number;
  textY: number;
  textAnchor: "start" | "middle" | "end";
}

interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const CALLOUT_GAP = 22;

/** Google Charts PieChart 3D, estilo pie-chart4 de plantilla Lagos. */
@Component({
  selector: "app-google-pie-chart4",
  imports: [Ng2GoogleChartsModule, DecimalPipe],
  template: `
    <section
      class="google-pie-chart4"
      [class.google-pie-chart4--embedded]="embedded()"
      [attr.aria-label]="title()"
    >
      @if (!embedded()) {
        <header class="google-pie-chart4__header">
          <div class="google-pie-chart4__heading">
            <h3>{{ title() }}</h3>
            @if (subtitle()) {
              <p class="google-pie-chart4__subtitle">{{ subtitle() }}</p>
            }
          </div>
          <span class="google-pie-chart4__rule" aria-hidden="true"></span>
        </header>
      }

      <div class="google-pie-chart4__body">
        <div class="google-pie-chart4__plot" #plot>
          <google-chart
            [data]="chart()"
            (chartReady)="onChartReady()"
            (chartError)="onChartError($event)"
          />
          @if (callouts().length) {
            <svg class="google-pie-chart4__callouts" aria-hidden="true">
              @for (callout of callouts(); track callout.label) {
                <line
                  [attr.x1]="callout.x1"
                  [attr.y1]="callout.y1"
                  [attr.x2]="callout.x2"
                  [attr.y2]="callout.y2"
                />
                <circle [attr.cx]="callout.x1" [attr.cy]="callout.y1" r="2.5" />
                <text
                  [attr.x]="callout.textX"
                  [attr.y]="callout.textY"
                  [attr.text-anchor]="callout.textAnchor"
                >
                  {{ callout.label }}
                </text>
              }
            </svg>
          }
        </div>

        <ul class="google-pie-chart4__legend" aria-label="Leyenda del gráfico">
          @for (item of legendItems(); track item.label) {
            <li>
              <span class="google-pie-chart4__swatch" [style.background-color]="item.color"></span>
              <span class="google-pie-chart4__label">{{ item.label }}</span>
              <span class="google-pie-chart4__value">{{ item.percentage | number: "1.0-1" }}%</span>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; width: 100%; height: 100%; }
      .google-pie-chart4 {
        display: flex;
        flex-direction: column;
        height: 100%;
        color: var(--ds-text-primary);
        background: var(--surface-card);
        border: 1px solid var(--ds-border-default);
        border-radius: var(--ds-radius-lg);
        box-shadow: var(--ds-shadow-1);
        overflow: hidden;
      }
      .google-pie-chart4__header {
        display: flex;
        align-items: center;
        gap: var(--ds-space-md);
        padding: var(--ds-space-lg) var(--ds-space-xl);
      }
      .google-pie-chart4__heading {
        display: grid;
        gap: var(--ds-space-xs);
      }
      .google-pie-chart4__header h3 {
        margin: 0;
        font-size: var(--ds-type-title-lg);
        font-weight: 700;
      }
      .google-pie-chart4__subtitle {
        margin: 0;
        color: var(--ds-text-secondary);
        font-size: var(--ds-type-body-sm);
      }
      .google-pie-chart4__rule {
        flex: 1;
        border-top: 1px dashed var(--ds-border-default);
      }
      .google-pie-chart4__body {
        display: grid;
        flex: 1;
        grid-template-columns: minmax(0, 1fr) minmax(10rem, 0.7fr);
        align-items: center;
        gap: var(--ds-space-lg);
        padding: 0 var(--ds-space-xl) var(--ds-space-xl);
      }
      .google-pie-chart4--embedded {
        background: transparent;
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }
      .google-pie-chart4--embedded .google-pie-chart4__body {
        padding: 0;
      }
      .google-pie-chart4__plot {
        position: relative;
        min-height: 21rem;
      }
      .google-pie-chart4__plot google-chart {
        display: block;
        width: 100%;
        min-height: 21rem;
      }
      .google-pie-chart4__callouts {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        pointer-events: none;
      }
      .google-pie-chart4__callouts line {
        stroke: var(--ds-border-strong);
        stroke-width: 1;
      }
      .google-pie-chart4__callouts circle {
        fill: var(--ds-border-strong);
      }
      .google-pie-chart4__callouts text {
        fill: var(--ds-text-primary);
        font-size: var(--ds-type-body-sm);
        font-weight: 600;
      }
      .google-pie-chart4__legend {
        display: grid;
        gap: var(--ds-space-md);
        padding: 0;
        margin: 0;
        list-style: none;
      }
      .google-pie-chart4__legend li {
        display: grid;
        grid-template-columns: var(--ds-space-lg) 1fr auto;
        align-items: center;
        gap: var(--ds-space-sm);
        font-size: var(--ds-type-body-md);
      }
      .google-pie-chart4__swatch {
        width: var(--ds-space-lg);
        height: var(--ds-space-lg);
        border-radius: 50%;
      }
      .google-pie-chart4__label {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .google-pie-chart4__value {
        color: var(--ds-text-secondary);
        font-variant-numeric: tabular-nums;
      }
      @media (max-width: 40rem) {
        .google-pie-chart4__body { grid-template-columns: 1fr; }
        .google-pie-chart4__legend { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
    `,
  ],
  providers: [
    {
      provide: "googleChartsSettings",
      useValue: { packages: ["corechart"], googleChartsVersion: "50" },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GooglePieChart4 {
  readonly data = input.required<ChartJsData>();
  readonly title = input("My Daily Activities");
  readonly subtitle = input("");
  /** Sin marco ni encabezado propios: para vivir dentro de una tarjeta anfitriona. */
  readonly embedded = input(false);

  readonly callouts = signal<SliceCallout[]>([]);

  private readonly plotRef = viewChild<ElementRef<HTMLElement>>("plot");
  private readonly drawTick = signal(0);
  private observer?: ResizeObserver;

  constructor() {
    effect(() => {
      this.drawTick();
      this.data();
      this.scheduleCallouts();
    });

    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => this.scheduleCallouts());
    }
  }

  onChartReady(): void {
    this.drawTick.update((n) => n + 1);
  }

  onChartError(error: unknown): void {
    console.error("[GooglePieChart4] chart error", error);
  }

  readonly chart = computed<GoogleChartInterface>(() => {
    const data = this.data();
    const labels = data.labels ?? [];
    const values = data.datasets?.[0]?.data ?? [];
    const colors = data.datasets?.[0]?.backgroundColor;

    return {
      chartType: GoogleChartType.PieChart,
      dataTable: [
        ["Estado", "Monto"],
        ...labels.map((label, index) => [String(label), Number(values[index] ?? 0)]),
      ],
      options: {
        is3D: true,
        width: "100%",
        height: 336,
        backgroundColor: "transparent",
        colors: Array.isArray(colors) ? colors : [],
        pieSliceText: "percentage",
        pieSliceTextStyle: { color: "#ffffff", fontSize: 13, bold: true },
        legend: { position: "none" },
        chartArea: { left: "14%", top: 18, width: "72%", height: "82%" },
        tooltip: { text: "percentage" },
      },
    };
  });

  readonly legendItems = computed<PieLegendItem[]>(() => {
    const data = this.data();
    const values = data.datasets?.[0]?.data ?? [];
    const labels = data.labels ?? [];
    const colors = data.datasets?.[0]?.backgroundColor;
    const total = values.reduce((sum, value) => sum + Number(value), 0);

    return values.map((value, index) => ({
      label: String(labels[index] ?? ""),
      percentage: total ? (Number(value) / total) * 100 : 0,
      color: Array.isArray(colors) ? String(colors[index] ?? "") : String(colors ?? ""),
    }));
  });

  private scheduleCallouts(): void {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => this.buildCallouts());
    window.setTimeout(() => this.buildCallouts(), 120);
  }

  private buildCallouts(): void {
    const plot = this.plotRef()?.nativeElement;
    if (!plot) return;

    this.observeResize(plot);

    const svg = plot.querySelector("svg");
    const items = this.legendItems();
    const paths = svg ? this.slicePaths(svg) : [];

    if (!svg || paths.length !== items.length) {
      if (svg) {
        console.warn(
          "[GooglePieChart4] no se pudieron mapear las rebanadas para callouts",
          paths.length,
          items.length,
        );
      }
      this.callouts.set([]);
      return;
    }

    const plotRect = plot.getBoundingClientRect();
    const boxes = paths.map((path) =>
      this.toLocal(path.getBoundingClientRect(), plotRect),
    );
    const labels = Array.from(svg.querySelectorAll("text")).map((node) =>
      this.toLocal(node.getBoundingClientRect(), plotRect),
    );

    const pie = boxes.reduce<Box>(
      (acc, box) => ({
        left: Math.min(acc.left, box.left),
        top: Math.min(acc.top, box.top),
        right: Math.max(acc.right, box.right),
        bottom: Math.max(acc.bottom, box.bottom),
      }),
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity },
    );

    const centerX = (pie.left + pie.right) / 2;
    const centerY = (pie.top + pie.bottom) / 2;
    const maxX = plotRect.width;
    const maxY = plotRect.height;
    const callouts: SliceCallout[] = [];

    boxes.forEach((box, index) => {
      const item = items[index];
      if (!item || item.percentage <= 0) return;
      if (this.hasSliceLabel(box, labels)) return;

      const boxCenterX = (box.left + box.right) / 2;
      const boxCenterY = (box.top + box.bottom) / 2;
      const dx = boxCenterX - centerX;
      const dy = boxCenterY - centerY;
      const label = `${item.percentage.toFixed(1)}%`;

      if (Math.abs(dx) >= Math.abs(dy)) {
        const toRight = dx >= 0;
        const rawX = toRight ? pie.right + CALLOUT_GAP : pie.left - CALLOUT_GAP;
        const textX = Math.min(Math.max(rawX, 8), maxX - 8);
        callouts.push({
          label,
          x1: toRight ? box.right : box.left,
          y1: boxCenterY,
          x2: rawX,
          y2: boxCenterY,
          textX: toRight ? textX + 4 : textX - 4,
          textY: boxCenterY,
          textAnchor: toRight ? "start" : "end",
        });
        return;
      }

      const below = dy >= 0;
      const rawY = below ? pie.bottom + CALLOUT_GAP : pie.top - CALLOUT_GAP;
      const textY = Math.min(Math.max(rawY, 12), maxY - 6);
      callouts.push({
        label,
        x1: boxCenterX,
        y1: below ? box.bottom : box.top,
        x2: boxCenterX,
        y2: rawY,
        textX: boxCenterX,
        textY: below ? textY + 12 : textY - 4,
        textAnchor: "middle",
      });
    });

    this.callouts.set(callouts);
  }

  private observeResize(plot: HTMLElement): void {
    if (this.observer || typeof ResizeObserver === "undefined") return;
    this.observer = new ResizeObserver(() => this.scheduleCallouts());
    this.observer.observe(plot);
  }

  private hasSliceLabel(box: Box, labels: Box[]): boolean {
    return labels.some(
      (label) =>
        label.right > box.left &&
        label.left < box.right &&
        label.bottom > box.top &&
        label.top < box.bottom,
    );
  }

  private slicePaths(svg: SVGSVGElement): SVGPathElement[] {
    return Array.from(svg.querySelectorAll("path")).filter((path) => {
      const fill = path.getAttribute("fill");
      return !!fill && fill !== "none" && !path.closest("defs");
    });
  }

  private toLocal(rect: DOMRect, container: DOMRect): Box {
    return {
      left: rect.left - container.left,
      top: rect.top - container.top,
      right: rect.right - container.left,
      bottom: rect.bottom - container.top,
    };
  }
}
