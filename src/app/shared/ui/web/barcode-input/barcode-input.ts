import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
/**
 * AppBarcodeInput — Input de texto con botón de escaneo de barcode/QR.
 * En mobile activa BarcodeDetector API (si disponible) o fallback a cámara.
 * Uso: búsqueda de productos por código, lookup de inventario, trazabilidad.
 */
@Component({
  selector: "app-barcode-input",

  imports: [FormsModule, ButtonModule, InputTextModule, LxTooltipDirective],
  template: `
    <div class="bi-root">
      @if (label()) {
        <label class="bi-label">{{ label() }}</label>
      }

      <div class="bi-row">
        <input
          pInputText
          [(ngModel)]="value"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          class="bi-input"
          (keydown.enter)="search()"
        />
        <p-button
          icon="mdi:barcode-scan"
          [lxTooltip]="'Escanear código'"
          tooltipPosition="top"
          severity="secondary"
          [outlined]="true"
          [loading]="scanning()"
          [disabled]="disabled()"
          (onClick)="scan()"
          styleClass="bi-scan-btn"
        />
        @if (showSearch()) {
          <p-button
            icon="mdi:magnify"
            [lxTooltip]="'Buscar'"
            tooltipPosition="top"
            [disabled]="!value() || disabled()"
            (onClick)="search()"
            styleClass="bi-search-btn"
          />
        }
      </div>

      <!-- Hidden file input for mobile camera fallback -->
      <input
        #cameraInput
        type="file"
        accept="image/*"
        capture="environment"
        class="bi-hidden"
        (change)="onCameraCapture($event)"
      />

      @if (error()) {
        <span class="bi-error">{{ error() }}</span>
      }
      @if (hint()) {
        <span class="bi-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .bi-root {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .bi-label {
        font-size: var(--ds-font-size-label, 0.875rem);
        color: var(--ds-text-secondary);
        font-weight: 500;
      }
      .bi-row {
        display: flex;
        gap: 0.375rem;
      }
      .bi-input {
        flex: 1;
        font-family: var(--ds-font-family-mono, monospace);
        letter-spacing: 0.05em;
      }
      .bi-scan-btn,
      .bi-search-btn {
        flex-shrink: 0;
      }
      .bi-hidden {
        display: none;
      }
      .bi-error {
        font-size: var(--ds-font-size-help, 0.8125rem);
        color: var(--ds-danger, #ba1a1a);
      }
      .bi-hint {
        font-size: var(--ds-font-size-help, 0.8125rem);
        color: var(--ds-text-muted);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppBarcodeInput {
  @ViewChild("cameraInput") cameraRef!: ElementRef<HTMLInputElement>;

  value = model<string>("");
  label = input<string>("");
  hint = input<string>("");
  placeholder = input<string>("Escanear o escribir código");
  disabled = input<boolean>(false);
  showSearch = input<boolean>(true);
  formats = input<string[]>([
    "qr_code",
    "ean_13",
    "ean_8",
    "code_128",
    "code_39",
  ]);

  barcodeFound = output<string>();
  searched = output<string>();

  scanning = signal(false);
  error = signal<string>("");

  async scan(): Promise<void> {
    // Try BarcodeDetector API first (Chrome Android, Edge)
    if ("BarcodeDetector" in window) {
      await this.scanWithBarcodeDetector();
    } else {
      // Fallback: open camera file input
      this.cameraRef.nativeElement.click();
    }
  }

  private async scanWithBarcodeDetector(): Promise<void> {
    this.scanning.set(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const track = stream.getVideoTracks()[0];

      // ImageCapture and BarcodeDetector are experimental — declare locally
      type ImageCaptureAPI = { grabFrame: () => Promise<ImageBitmap> };
      type BarcodeDetectorAPI = {
        detect: (src: ImageBitmap) => Promise<{ rawValue: string }[]>;
      };
      const IC = (
        window as unknown as {
          ImageCapture: new (t: MediaStreamTrack) => ImageCaptureAPI;
        }
      ).ImageCapture;
      const BD = (
        window as unknown as {
          BarcodeDetector: new (opts: {
            formats: string[];
          }) => BarcodeDetectorAPI;
        }
      ).BarcodeDetector;

      const capture = new IC(track);
      const bitmap = await capture.grabFrame();
      const detector = new BD({ formats: this.formats() });
      const results = await detector.detect(bitmap);
      track.stop();
      if (results.length > 0) {
        this.value.set(results[0].rawValue);
        this.barcodeFound.emit(results[0].rawValue);
      } else {
        this.error.set("No se detectó código. Intenta más cerca.");
      }
    } catch {
      this.error.set("Cámara no disponible. Escribe el código manualmente.");
    } finally {
      this.scanning.set(false);
    }
  }

  onCameraCapture(_event: Event): void {
    // In fallback mode, user selected image — we can't decode without BarcodeDetector
    this.error.set(
      "Detección automática no disponible en este dispositivo. Introduce el código manualmente.",
    );
  }

  search(): void {
    const v = this.value().trim();
    if (!v) return;
    this.searched.emit(v);
  }
}
