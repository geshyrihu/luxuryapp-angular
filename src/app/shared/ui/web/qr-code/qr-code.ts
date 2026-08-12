import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnChanges,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { ButtonModule } from "primeng/button";
import QRCode from "qrcode";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

/**
 * AppQrCode — Genera y muestra un código QR desde cualquier string.
 * Usa la librería `qrcode` (ya disponible en node_modules).
 * Uso: tickets, órdenes, URLs de trazabilidad, pagos.
 */
@Component({
  selector: "app-qr-code",

  imports: [ButtonModule, AppIcon],
  template: `
    <div class="qr-root">
      @if (label()) {
        <h4 class="qr-label">{{ label() }}</h4>
      }

      <div
        class="qr-container"
        [style.width.px]="size()"
        [style.height.px]="size()"
      >
        @if (qrUrl()) {
          <img [src]="qrUrl()" [alt]="'QR: ' + data()" class="qr-img" />
        } @else if (loading()) {
          <div class="qr-loading">
            <app-icon icon="material-symbols-light:progress-activity" class="text-2xl qr-spin" />
          </div>
        } @else {
          <div class="qr-empty">
            <app-icon icon="material-symbols-light:qr-code" class="text-4xl" />
          </div>
        }
      </div>

      @if (showData() && data()) {
        <code class="qr-data">{{ data() }}</code>
      }

      @if (qrUrl() && allowDownload()) {
        <p-button
          label="Descargar QR"
          severity="secondary"
          [outlined]="true"
          size="small"
          (onClick)="download()"
        >
          <ng-template #icon>
            <app-icon icon="material-symbols-light:download" />
          </ng-template>
        </p-button>
      }
    </div>
  `,
  styles: [
    `
      .qr-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.625rem;
      }
      .qr-label {
        font-size: var(--ds-font-size-label);
        font-weight: 600;
        color: var(--ds-text-primary);
        margin: 0;
      }
      .qr-container {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 8px;
      }
      .qr-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .qr-loading,
      .qr-empty {
        color: var(--ds-text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      .qr-spin {
        animation: qr-spin 1s linear infinite;
      }
      @keyframes qr-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .qr-data {
        font-family: var(--ds-font-family-mono);
        font-size: var(--ds-font-size-micro);
        color: var(--ds-text-muted);
        background: var(--ds-bg-elevated);
        padding: 0.2rem 0.5rem;
        border-radius: var(--ds-radius-sm);
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppQrCode implements OnChanges {
  data = input<string>("");
  label = input<string>("");
  size = input<number>(160);
  showData = input<boolean>(false);
  allowDownload = input<boolean>(true);
  errorLevel = input<"L" | "M" | "Q" | "H">("M");

  qrUrl = signal<string>("");
  loading = signal(false);

  ngOnChanges(): void {
    this.generate();
  }

  private generate(): void {
    const d = this.data();
    if (!d) {
      this.qrUrl.set("");
      return;
    }
    this.loading.set(true);
    QRCode.toDataURL(d, {
      width: this.size() * 2,
      margin: 1,
      errorCorrectionLevel: this.errorLevel(),
      color: { dark: "black", light: "white" },
    })
      .then((url: string) => {
        this.qrUrl.set(url);
        this.loading.set(false);
      })
      .catch(() => {
        this.loading.set(false);
      });
  }

  download(): void {
    const a = document.createElement("a");
    a.href = this.qrUrl();
    a.download = `qr-${Date.now()}.png`;
    a.click();
  }
}
