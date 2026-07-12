import { Endpoints } from "src/app/core/constants/endpoints";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ROUTES } from "src/app/routing/route-paths";

declare class BarcodeDetector {
  constructor(options: { formats: string[] });
  detect(source: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
  static getSupportedFormats(): Promise<string[]>;
}

@Component({
  selector: "app-qr-scanner",
  templateUrl: "./qr-scanner.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [WebButtonLabel],
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
    this.statusMsg.set("Iniciando cómara...");
    this.videoEl = video;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      video.srcObject = this.stream;
      await video.play();

      this.detector = new BarcodeDetector({ formats: ["qr_code"] });
      this.scanning.set(true);
      this.statusMsg.set("Apunta la cómara al código QR del equipo.");
      this.scanLoop(video);
    } catch {
      this.errorMsg.set(
        "No se pudo acceder a la cómara. Verifica los permisos.",
      );
      this.statusMsg.set("");
    }
  }

  private scanLoop(video: HTMLVideoElement) {
    this.animationId = requestAnimationFrame(async () => {
      if (!this.scanning()) return;

      const barcodes = await this.detector!.detect(video).catch(() => []);
      const qr = barcodes.find(
        (b) =>
          b.rawValue.startsWith("luxuryapp://inspect/") ||
          b.rawValue.startsWith("luxuryapp://equipment-inspection/"),
      );

      if (qr) {
        this.stopScan();
        await this.resolveQr(qr.rawValue);
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
    await this.resolveQr(id);
  }

  private readonly checklistRoutes: Record<string, (id: string) => string[]> = {
    Extintor: (id: string) => ROUTES.BITACORAS.EXTINTOR_CHECKLIST(id),
    Hydrant: (id: string) => ROUTES.BITACORAS.HIDRANTE_CHECKLIST(id),
    ManualCallPoint: (id: string) =>
      ROUTES.BITACORAS.ESTACION_MANUAL_CHECKLIST(id),
    SmokeDetector: (id: string) => ROUTES.BITACORAS.DETECTOR_HUMO_CHECKLIST(id),
  };

  private async resolveQr(rawValue: string) {
    if (rawValue.startsWith("luxuryapp://equipment-inspection/")) {
      const code = rawValue.replace("luxuryapp://equipment-inspection/", "");
      this.router.navigate(ROUTES.BITACORAS.INSPECCION_EQUIPO(code));
      return;
    }

    const path = rawValue.replace("luxuryapp://inspect/", "");
    const segments = path.split("/");

    // Formato nuevo: luxuryapp://inspect/{type}/{id}
    if (segments.length === 2) {
      const [type, id] = segments;
      const routeFn = this.checklistRoutes[type];
      if (routeFn) {
        this.router.navigate(routeFn(id));
        return;
      }
    }

    // Formato legacy / entrada manual: solo el ID ? resolver API
    const id = segments[0];
    this.statusMsg.set("Identificando equipo...");
    const result: any = await this.apiResponseS
      .onGetItem(Endpoints.RefactorMantenimiento.fireEquipmentResolveById(id))
      .catch(() => null);

    if (!result) {
      this.errorMsg.set("No se encontré el equipo en el sistema.");
      this.statusMsg.set("");
      return;
    }

    const routeFn = this.checklistRoutes[result.equipmentType];
    if (routeFn) {
      this.router.navigate(routeFn(result.id));
    } else {
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
