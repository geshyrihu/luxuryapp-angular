import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "app-gauge",

  imports: [],
  template: `
    <div class="gauge-root">
      <svg
        class="gauge-svg"
        [attr.viewBox]="'0 0 ' + size() + ' ' + size()"
        [style.width.px]="size()"
        [style.height.px]="size()"
      >
        <circle
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="radius"
          fill="none"
          [attr.stroke]="trackColor()"
          [attr.stroke-width]="thickness()"
        />
        <circle
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="radius"
          fill="none"
          [attr.stroke]="indicatorColor()"
          [attr.stroke-width]="thickness()"
          [attr.stroke-dasharray]="circumference + ' ' + circumference"
          [attr.stroke-dashoffset]="dashOffset()"
          stroke-linecap="round"
          [style.transform]="'rotate(-90deg)'"
          [style.transform-origin]="center + 'px ' + center + 'px'"
        />
      </svg>
      <div class="gauge-overlay">
        <strong class="gauge-value"
          >{{ prefix() }}{{ displayValue() }}{{ suffix() }}</strong
        >
        @if (label()) {
          <span class="gauge-label">{{ label() }}</span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .gauge-root {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .gauge-overlay {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.125rem;
      }
      .gauge-value {
        font-size: var(--ds-font-size-metric, 1.5rem);
        color: var(--ds-text-primary);
        line-height: 1;
      }
      .gauge-label {
        font-size: var(--ds-font-size-help, 0.8125rem);
        color: var(--ds-text-muted);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Gauge {
  value = input.required<number>();
  min = input<number>(0);
  max = input<number>(100);
  size = input<number>(140);
  thickness = input<number>(10);
  prefix = input<string>("");
  suffix = input<string>("");
  label = input<string>("");
  format = input<"number" | "percent">("number");
  colorLow = input<string>("var(--ds-danger, #ba1a1a)");
  colorMid = input<string>("var(--ds-warning, #f5a623)");
  colorHigh = input<string>("var(--ds-success, #006837)");
  trackColor = input<string>("var(--ds-border, #e2e8f0)");

  center = computed(() => this.size() / 2);
  radius = computed(() => this.center() - this.thickness() / 2 - 2);
  circumference = computed(() => 2 * Math.PI * this.radius());

  normalized = computed(() => {
    const v = (this.value() - this.min()) / (this.max() - this.min());
    return Math.min(1, Math.max(0, v));
  });

  dashOffset = computed(() => {
    return this.circumference() * (1 - this.normalized());
  });

  displayValue = computed(() => {
    const v = this.value();
    if (this.format() === "percent") return Math.round(v);
    return new Intl.NumberFormat("es-MX").format(v);
  });

  indicatorColor = computed(() => {
    const n = this.normalized();
    if (n < 0.33) return this.colorLow();
    if (n < 0.66) return this.colorMid();
    return this.colorHigh();
  });
}
