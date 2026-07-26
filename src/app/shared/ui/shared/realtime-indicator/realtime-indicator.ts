import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from "@angular/core";

export type RealtimeStatus = "live" | "paused" | "error" | "connecting";

/**
 * AppRealtimeIndicator — Badge de estado de conexión en tiempo real.
 * Muestra un punto pulsante cuando está "en vivo", con timestamp de última actualización.
 * Uso: dashboards con SSE/WebSocket, métricas en tiempo real.
 */
@Component({
  selector: "app-realtime-indicator",

  imports: [],
  template: `
    <div class="rt-root" [attr.aria-label]="statusLabel()">
      <!-- Pulsing dot -->
      <span class="rt-dot" [class]="dotClass()">
        @if (status() === "live") {
          <span class="rt-pulse"></span>
        }
      </span>

      <!-- Label -->
      <span class="rt-label">{{ statusLabel() }}</span>

      <!-- Last update -->
      @if (lastUpdate()) {
        <span class="rt-time">{{ lastUpdate() }}</span>
      }

      <!-- Latency -->
      @if (latencyMs() !== undefined && status() === "live") {
        <span class="rt-latency">{{ latencyMs() }}ms</span>
      }
    </div>
  `,
  styles: [
    `
      .rt-root {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.2rem 0.625rem;
        border-radius: var(--ds-radius-full, 9999px);
        background: var(--ds-bg-elevated, #f1f3ff);
        border: 1px solid var(--ds-border, #e2e8f0);
        font-size: var(--ds-font-size-micro, 0.75rem);
      }
      /* Dot */
      .rt-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex-shrink: 0;
      }
      .rt-dot-live {
        background: var(--ds-success, #006837);
      }
      .rt-dot-paused {
        background: var(--ds-warning, #b45309);
      }
      .rt-dot-error {
        background: var(--ds-danger, #ba1a1a);
      }
      .rt-dot-connecting {
        background: var(--ds-info, #006477);
        animation: rt-blink 1s ease infinite;
      }
      /* Pulse ring */
      .rt-pulse {
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--ds-success, #006837);
        opacity: 0.4;
        animation: rt-pulse 1.5s ease-out infinite;
      }
      @keyframes rt-pulse {
        0% {
          transform: scale(0.8);
          opacity: 0.6;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
      @keyframes rt-blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.3;
        }
      }
      .rt-label {
        font-weight: 600;
        color: var(--ds-text-primary);
      }
      .rt-time {
        color: var(--ds-text-muted);
      }
      .rt-latency {
        color: var(--ds-text-muted);
        padding-left: 0.25rem;
        border-left: 1px solid var(--ds-border, #e2e8f0);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppRealtimeIndicator {
  status = input<RealtimeStatus>("live");
  lastUpdate = input<string>("");
  latencyMs = input<number | undefined>(undefined);
  /** Etiqueta personalizada; si está vacía usa la etiqueta por defecto del status. */
  label = input<string>("");

  dotClass(): string {
    return `rt-dot rt-dot-${this.status()}`;
  }

  statusLabel(): string {
    if (this.label()) return this.label();
    const map: Record<RealtimeStatus, string> = {
      live: "En vivo",
      paused: "Pausado",
      error: "Error de conexión",
      connecting: "Conectando...",
    };
    return map[this.status()];
  }
}
