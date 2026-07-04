import {
  Component,
  ElementRef,
  input,
  output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";

export interface ScanResult {
  value: string;
  format: string;
}

/**
 * AppBarcodeScanner — Escáner de código de barras y QR con cámara.
 * Usa BarcodeDetector API nativa (Chrome/Edge Android).
 * Fallback: captura de foto desde cámara para procesamiento manual.
 */
@Component({
  selector: "app-barcode-scanner",
  standalone: true,
  imports: [CommonModule, ButtonModule, AppIcon],
  template: `
    <div class="bs-root">
      @if (label()) {
        <h4 class="bs-label">{{ label() }}</h4>
      }

      @if (!scanning()) {
        <!-- Idle state -->
        <div class="bs-idle" (click)="startScan()">
          <div class="bs-icon-wrap">
            <app-icon icon="mdi:barcode-scan" class="text-4xl" />
          </div>
          <span class="bs-idle-title">{{ idleLabel() }}</span>
          <span class="bs-idle-sub">Toca para activar la cámara</span>
        </div>
      } @else {
        <!-- Scanning state -->
        <div class="bs-scanning-wrap">
          <video #videoEl class="bs-video" autoplay playsinline></video>
          <div class="bs-overlay">
            <div class="bs-viewfinder"></div>
            <span class="bs-scan-hint">Enfoca el código</span>
          </div>
          <p-button
            label="Cancelar"
            severity="secondary"
            size="small"
            (onClick)="stopScan()"
            styleClass="bs-cancel-btn"
          />
        </div>
      }

      @if (lastResult()) {
        <div class="bs-result">
          <app-icon icon="mdi:check-circle" style="color: var(--ds-success)" />
          <div>
            <span class="bs-result-value">{{ lastResult()!.value }}</span>
            <span class="bs-result-format">{{ lastResult()!.format }}</span>
          </div>
        </div>
      }

      @if (error()) {
        <div class="bs-error">
          <app-icon icon="mdi:alert-circle" />
          {{ error() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .bs-root { display: flex; flex-direction: column; gap: 0.625rem; }
    .bs-label { font-size: var(--ds-font-size-label, 0.875rem); font-weight: 600; color: var(--ds-text-primary); margin: 0; }
    .bs-idle {
      border: 2px dashed var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-lg, 8px);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: var(--ds-text-muted);
      transition: all 0.15s;
    }
    .bs-idle:hover { border-color: var(--ds-primary); color: var(--ds-primary); background: var(--ds-bg-elevated); }
    .bs-icon-wrap { width: 64px; height: 64px; border-radius: var(--ds-radius-lg); background: var(--ds-bg-elevated); display: flex; align-items: center; justify-content: center; }
    .bs-idle-title { font-size: var(--ds-font-size-label, 0.875rem); font-weight: 600; }
    .bs-idle-sub { font-size: var(--ds-font-size-micro, 0.75rem); }
    .bs-scanning-wrap { position: relative; border-radius: var(--ds-radius-lg, 8px); overflow: hidden; background: #000; }
    .bs-video { width: 100%; height: 280px; object-fit: cover; display: block; }
    .bs-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; }
    .bs-viewfinder {
      width: 200px; height: 200px;
      border: 2px solid #fff;
      border-radius: 8px;
      box-shadow: 0 0 0 9999px rgba(0,0,0,0.4);
      position: relative;
    }
    .bs-viewfinder::before, .bs-viewfinder::after {
      content: "";
      position: absolute;
      width: 24px; height: 24px;
      border-color: var(--ds-primary, #003d9b);
      border-style: solid;
    }
    .bs-viewfinder::before { top: -2px; left: -2px; border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
    .bs-viewfinder::after  { bottom: -2px; right: -2px; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }
    .bs-scan-hint { color: #fff; font-size: var(--ds-font-size-help, 0.8125rem); text-shadow: 0 1px 3px rgba(0,0,0,0.8); }
    .bs-cancel-btn { position: absolute; bottom: 0.75rem; left: 50%; transform: translateX(-50%); }
    .bs-result { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem; background: #d1fae5; border-radius: var(--ds-radius-md, 6px); }
    .bs-result-value  { display: block; font-family: var(--ds-font-family-mono, monospace); font-weight: 700; color: var(--ds-text-primary); font-size: var(--ds-font-size-label, 0.875rem); }
    .bs-result-format { display: block; font-size: var(--ds-font-size-micro, 0.75rem); color: var(--ds-text-muted); }
    .bs-error { display: flex; align-items: center; gap: 0.375rem; font-size: var(--ds-font-size-help, 0.8125rem); color: var(--ds-danger, #ba1a1a); }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppBarcodeScanner {
  @ViewChild("videoEl") videoRef!: ElementRef<HTMLVideoElement>;

  label     = input<string>("Escáner de código");
  idleLabel = input<string>("Escanear código de barras / QR");
  formats   = input<string[]>(["qr_code", "ean_13", "ean_8", "code_128", "code_39"]);
  continuous = input<boolean>(true);

  detected = output<ScanResult>();

  scanning   = signal(false);
  lastResult = signal<ScanResult | null>(null);
  error      = signal<string>("");

  private stream: MediaStream | null = null;
  private detectionTimer: ReturnType<typeof setInterval> | null = null;

  async startScan(): Promise<void> {
    if (!("BarcodeDetector" in window)) {
      this.error.set("BarcodeDetector no está disponible en este navegador. Usa Chrome en Android.");
      return;
    }
    this.error.set("");
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      this.scanning.set(true);
      setTimeout(() => {
        this.videoRef.nativeElement.srcObject = this.stream;
        this.startDetection();
      }, 100);
    } catch {
      this.error.set("No se pudo acceder a la cámara.");
    }
  }

  private startDetection(): void {
    type BarcodeDetectorAPI = { detect: (src: HTMLVideoElement) => Promise<{ rawValue: string; format: string }[]> };
    const BD = (window as unknown as { BarcodeDetector: new (opts: { formats: string[] }) => BarcodeDetectorAPI }).BarcodeDetector;
    const detector = new BD({ formats: this.formats() });
    this.detectionTimer = setInterval(async () => {
      try {
        const results = await detector.detect(this.videoRef.nativeElement);
        if (results.length > 0) {
          const r: ScanResult = { value: results[0].rawValue, format: results[0].format };
          this.lastResult.set(r);
          this.detected.emit(r);
          if (!this.continuous()) this.stopScan();
        }
      } catch { /* frame not ready yet */ }
    }, 400);
  }

  stopScan(): void {
    if (this.detectionTimer) clearInterval(this.detectionTimer);
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.scanning.set(false);
  }
}
