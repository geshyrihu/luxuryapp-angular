import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { ButtonModule } from "primeng/button";

/**
 * AppPrintView — Wrapper para contenido con vista de impresión optimizada.
 * Oculta la UI de la app al imprimir y muestra solo el contenido proyectado.
 * Uso: reportes, facturas, contratos, recibos.
 */
@Component({
  selector: "app-print-view",

  imports: [CommonModule, ButtonModule],
  template: `
    <div class="print-view-root">
      <!-- Toolbar (only shown on screen, hidden when printing) -->
      <div class="print-toolbar no-print">
        @if (title()) {
          <span class="print-toolbar-title">{{ title() }}</span>
        }
        <div class="print-toolbar-actions">
          <p-button
            [label]="'Imprimir'"
            icon="mdi:printer-outline"
            severity="secondary"
            [outlined]="true"
            size="small"
            (onClick)="print()"
          />
        </div>
      </div>

      <!-- Printable area -->
      <div class="print-area" [class.print-area-bordered]="showBorder()">
        @if (title()) {
          <div class="print-title-block print-only">
            <h1 class="print-title">{{ title() }}</h1>
            @if (subtitle()) {
              <p class="print-subtitle">{{ subtitle() }}</p>
            }
          </div>
        }
        <ng-content />
      </div>
    </div>
  `,
  styles: [
    `
      /* ── Screen styles ─────────────────────────────────── */
      .print-view-root {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .print-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
      }
      .print-toolbar-title {
        font-size: var(--ds-font-size-label, 0.875rem);
        font-weight: 600;
        color: var(--ds-text-secondary);
      }
      .print-toolbar-actions {
        display: flex;
        gap: 0.5rem;
      }
      .print-area {
        background: var(--ds-bg-surface, #fff);
        min-height: 200px;
      }
      .print-area-bordered {
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        padding: 1.5rem;
      }
      .print-only {
        display: none;
      }
      .print-title {
        font-size: var(--ds-font-size-page-title, 1.75rem);
        font-weight: 700;
        color: var(--ds-text-primary);
        margin: 0 0 0.25rem;
      }
      .print-subtitle {
        font-size: var(--ds-font-size-label, 0.875rem);
        color: var(--ds-text-secondary);
        margin: 0 0 1rem;
      }

      /* ── Print media query ─────────────────────────────── */
      @media print {
        .no-print {
          display: none !important;
        }
        .print-only {
          display: block !important;
        }

        .print-view-root {
          gap: 0;
        }
        .print-area {
          border: none;
          padding: 0;
          min-height: unset;
        }
        /* Hide everything else on the page */
        body > *:not(app-print-view) {
          display: none !important;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppPrintView {
  title = input<string>("");
  subtitle = input<string>("");
  showBorder = input<boolean>(true);

  print(): void {
    window.print();
  }
}
