import { Component, inject, OnDestroy, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ApiResponseService } from "src/app/core/services/api-response.service";

declare class BarcodeDetector {
  constructor(options: { formats: string[] });
  detect(source: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
  static getSupportedFormats(): Promise<string[]>;
}

@Component({
  selector: "app-qr-scanner",
  templateUrl: "./qr-scanner.html",
  imports: [ButtonModule],
})
export class QrScanner implements OnDestroy {
  apiResponseS = inject(ApiResponseService);
  router = inject(Router);

  scanning = signal(false);
  errorMsg = signal("");
  statusMsg = signal("");
  supported = signal(typeof (window as any).BarcodeDetector !== "undefined");
  manualId = signal("");

  private stream: MediaStream | null = null;
  private detector: BarcodeDetector | null = null;
  private animationId: number | null = null;
  private videoEl: HTMLVideoElement | null = null;

  async startScan(video: HTMLVideoElement) {
    this.errorMsg.set("");
    this.statusMsg.set("Iniciando cámara...");
    this.videoEl = video;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      video.srcObject = this.stream;
      await video.play();

      this.detector = new BarcodeDetector({ formats: ["qr_code"] });
      this.scanning.set(true);
      this.statusMsg.set("Apunta la cámara al código QR del equipo.");
      this.scanLoop(video);
    } catch {
      this.errorMsg.set("No se pudo acceder a la cámara. Verifica los permisos.");
      this.statusMsg.set("");
    }
  }

  private scanLoop(video: HTMLVideoElement) {
    this.animationId = requestAnimationFrame(async () => {
      if (!this.scanning()) return;

      const barcodes = await this.detector!.detect(video).catch(() => []);
      const qr = barcodes.find((b) => b.rawValue.startsWith("luxuryapp://inspect/"));

      if (qr) {
        const id = qr.rawValue.replace("luxuryapp://inspect/", "");
        this.stopScan();
        await this.resolveEquipment(id);
      } else {
        this.scanLoop(video);
      }
    });
  }

  async resolveManual() {
    const id = this.manualId().trim();
    if (!id) return;
    this.errorMsg.set("");
    this.statusMsg.set("Identificando equipo...");
    await this.resolveEquipment(id);
  }

  private async resolveEquipment(id: string) {
    this.statusMsg.set("Identificando equipo...");
    const result: any = await this.apiResponseS
      .onGetItem(`FireEquipment/resolve/${id}`)
      .catch(() => null);

    if (!result) {
      this.errorMsg.set("No se encontró el equipo en el sistema.");
      this.statusMsg.set("");
      return;
    }

    switch (result.equipmentType) {
      case "Extintor":
        this.router.navigate(["/logbook/fire-extinguisher-checklist", result.id]);
        break;
      case "Hydrant":
        this.router.navigate(["/logbook/hydrant-checklist", result.id]);
        break;
      case "ManualCallPoint":
        this.router.navigate(["/logbook/manual-call-point-checklist", result.id]);
        break;
      case "SmokeDetector":
        this.router.navigate(["/logbook/smoke-detector-checklist", result.id]);
        break;
      default:
        this.errorMsg.set(`Tipo de equipo no soportado: ${result.equipmentType}`);
        this.statusMsg.set("");
    }
  }

  stopScan() {
    this.scanning.set(false);
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    if (this.videoEl) {
      this.videoEl.srcObject = null;
    }
  }

  ngOnDestroy() {
    this.stopScan();
  }
}
