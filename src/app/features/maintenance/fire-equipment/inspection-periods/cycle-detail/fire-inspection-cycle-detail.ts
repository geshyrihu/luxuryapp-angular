import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TagModule } from "primeng/tag";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { FireCycleInspectionExtintorForm } from "../cycle-checklist-extintor/fire-cycle-inspection-extintor-form";
import { FireCycleInspectionHidranteForm } from "../cycle-checklist-hidrante/fire-cycle-inspection-hidrante-form";
import { FireCycleInspectionEstacionForm } from "../cycle-checklist-estacion/fire-cycle-inspection-estacion-form";
import { FireCycleInspectionDetectorForm } from "../cycle-checklist-detector/fire-cycle-inspection-detector-form";

declare class BarcodeDetector {
  constructor(options: { formats: string[] });
  detect(source: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
}

@Component({
  selector: "app-fire-inspection-cycle-detail",
  templateUrl: "./fire-inspection-cycle-detail.html",
  imports: [CommonModule, WebButtonLabel, TagModule, IonItem, IonLabel],
})
export class FireInspectionCycleDetail implements OnInit, OnDestroy {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  rutaActiva = inject(ActivatedRoute);

  cycleId = "";
  cycle = signal<any>(null);
  scanning = signal(false);
  scanError = signal("");
  scanStatus = signal("");

  private stream: MediaStream | null = null;
  private animationId: number | null = null;

  ngOnInit(): void {
    this.cycleId = this.rutaActiva.snapshot.params["cycleId"];
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`FireInspectionCycle/${this.cycleId}`)
      .then((result: any) => this.cycle.set(result));
  }

  statusSeverity(status: string): "success" | "info" | "warn" | "danger" | "secondary" {
    const map: Record<string, any> = {
      Realizada: "success",
      Pendiente: "info",
      NoRealizada: "danger",
    };
    return map[status] ?? "secondary";
  }

  cycleSeverity(status: string): "success" | "info" | "warn" | "danger" | "secondary" {
    const map: Record<string, any> = {
      Completado: "success",
      EnCurso: "warn",
      Pendiente: "info",
      Vencido: "danger",
    };
    return map[status] ?? "secondary";
  }

  async openChecklist(item: any) {
    await this.openChecklistForEquipment(item.equipmentType, item.equipmentId, item.status);
  }

  private async openChecklistForEquipment(type: string, equipmentId: string, currentStatus: string) {
    if (currentStatus === "Realizada") {
      if (!window.confirm("Este equipo ya fue inspeccionado. óDeseas actualizar los datos?")) return;
    }

    const dialogs: Record<string, any> = {
      Extintor: FireCycleInspectionExtintorForm,
      Hidrante: FireCycleInspectionHidranteForm,
      EstacionManual: FireCycleInspectionEstacionForm,
      DetectorHumo: FireCycleInspectionDetectorForm,
    };

    const component = dialogs[type];
    if (!component) return;

    const titles: Record<string, string> = {
      Extintor: "Inspección de Extintor",
      Hidrante: "Inspección de Hidrante",
      EstacionManual: "Inspección de Estación Manual",
      DetectorHumo: "Inspección de Detector de Humo",
    };

    await this.dialogHandlerS.openDialog(
      component,
      { cycleId: this.cycleId, equipmentId },
      titles[type] ?? "Inspección",
      this.dialogHandlerS.sizeMd,
    );
    this.onLoadData();
  }

  async startScan(video: HTMLVideoElement) {
    this.scanError.set("");
    this.scanStatus.set("Iniciando cómara...");
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      video.srcObject = this.stream;
      await video.play();
      this.scanning.set(true);
      this.scanStatus.set("Apunta la cómara al código QR del equipo.");
      this.scanLoop(video);
    } catch {
      this.scanError.set("No se pudo acceder a la cómara. Verifica los permisos.");
      this.scanStatus.set("");
    }
  }

  private scanLoop(video: HTMLVideoElement) {
    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    const loop = () => {
      this.animationId = requestAnimationFrame(async () => {
        if (!this.scanning()) return;
        const barcodes = await detector.detect(video).catch(() => []);
        const qr = barcodes.find((b) => b.rawValue.startsWith("luxuryapp://inspect/"));
        if (qr) {
          this.stopScan();
          await this.resolveQr(qr.rawValue);
        } else {
          loop();
        }
      });
    };
    loop();
  }

  private async resolveQr(rawValue: string) {
    const path = rawValue.replace("luxuryapp://inspect/", "");
    const segments = path.split("/");

    let type = "";
    let id = "";

    if (segments.length === 2) {
      [type, id] = segments;
    } else {
      this.scanStatus.set("Identificando equipo...");
      const result: any = await this.apiResponseS
        .onGetItem(`FireEquipment/resolve/${segments[0]}`)
        .catch(() => null);
      if (!result) {
        this.scanError.set("No se encontré el equipo en el sistema.");
        return;
      }
      const typeMap: Record<string, string> = {
        Extintor: "Extintor",
        Hydrant: "Hidrante",
        ManualCallPoint: "EstacionManual",
        SmokeDetector: "DetectorHumo",
      };
      type = typeMap[result.equipmentType] ?? "";
      id = result.id;
    }

    const items: any[] = this.cycle()?.items ?? [];
    const match = items.find((i) => i.equipmentId === id);
    if (!match) {
      this.scanError.set("Este equipo no pertenece al ciclo de inspección actual.");
      return;
    }

    await this.openChecklistForEquipment(match.equipmentType, match.equipmentId, match.status);
  }

  stopScan() {
    this.scanning.set(false);
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }

  ngOnDestroy() {
    this.stopScan();
  }
}
