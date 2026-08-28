import { Location } from "@angular/common";
import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { FireCycleInspectionExtintorForm } from "../cycle-checklist-extintor/fire-cycle-inspection-extintor-form";

declare class BarcodeDetector {
  constructor(options: { formats: string[] });
  detect(source: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
}

@Component({
  selector: "app-fire-inspection-period-extintor-detail",
  templateUrl: "./fire-inspection-period-extintor-detail.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ApiDatePipe, FormsModule, WebButtonLabel, WebButtonIcon, LxTag],
})
export class FireInspectionPeriodExtintorDetail implements OnInit, OnDestroy {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  location = inject(Location);

  @ViewChild("videoEl") videoEl!: ElementRef<HTMLVideoElement>;

  periodId = "";
  period = signal<any>(null);
  periodItems = signal<any[]>([]);
  activeCycle = signal<any>(null);
  inventoryItems = signal<any[]>([]);
  selectedEquipmentId = "";
  showAddForm = signal(false);
  scanning = signal(false);
  scanError = signal("");
  scanStatus = signal("");

  private stream: MediaStream | null = null;
  private animationId: number | null = null;

  mergedItems = computed(() => {
    const cycleItems: any[] = this.activeCycle()?.items ?? [];
    return this.periodItems().map((p) => {
      const cycleItem = cycleItems.find(
        (c) => c.equipmentId === p.extinguisherId,
      );
      return {
        ...p,
        cycleStatus: cycleItem?.status ?? null,
        inspectedAt: cycleItem?.inspectedAt ?? null,
      };
    });
  });

  availableEquipment = computed(() => {
    const assigned = new Set(this.periodItems().map((p) => p.extinguisherId));
    return this.inventoryItems().filter((e) => !assigned.has(e.id));
  });

  ngOnInit(): void {
    this.periodId = this.route.snapshot.params["periodId"];
    this.onLoadData();
  }

  onLoadData() {
    Promise.all([
      this.apiResponseS.onGetItem(
        Endpoints.FireInspectionPeriod.getById(this.periodId),
      ),
      this.apiResponseS.onGetList(
        Endpoints.FireInspectionPeriodItems.extintorList(this.periodId),
      ),
      this.apiResponseS.onGetItem(
        Endpoints.FireInspectionCycle.active(this.periodId),
      ),
      this.apiResponseS.onGetList(
        Endpoints.InventarioExtintor.list(this.customerIdS.customerId()),
      ),
    ]).then(([period, items, cycle, inventory]: any) => {
      this.period.set(period);
      this.periodItems.set(items ?? []);
      this.activeCycle.set(cycle);
      this.inventoryItems.set(inventory ?? []);
    });
  }

  async onAddItem() {
    if (!this.selectedEquipmentId) return;
    const result = await this.apiResponseS.onPost(
      Endpoints.FireInspectionPeriodItems.extintorDetail(
        this.periodId,
        this.selectedEquipmentId,
      ),
      {},
    );
    if (result !== false) {
      this.selectedEquipmentId = "";
      this.showAddForm.set(false);
      this.onLoadData();
    }
  }

  async onGenerateCycle() {
    await this.apiResponseS.onPost(
      Endpoints.FireInspectionCycle.generate(this.periodId),
      {},
    );
    this.onLoadData();
  }

  async onRemoveItem(id: string) {
    const ok = await this.apiResponseS.onDelete(
      Endpoints.FireInspectionPeriodItems.extintorDelete(id),
    );
    if (ok) this.onLoadData();
  }

  async openChecklist(item: any) {
    if (!this.activeCycle()) {
      window.alert("No hay un ciclo de inspección activo para este periodo.");
      return;
    }
    if (item.cycleStatus === "Realizada") {
      if (
        !window.confirm(
          "Este equipo ya fue inspeccionado. óDeseas actualizar los datos?",
        )
      )
        return;
    }
    await this.dialogHandlerS.openDialog(
      FireCycleInspectionExtintorForm,
      { cycleId: this.activeCycle().id, equipmentId: item.extinguisherId },
      "Inspección de Extintor",
      this.dialogHandlerS.sizeMd,
    );
    this.onLoadData();
  }

  statusSeverity(
    status: string | null,
  ): "success" | "info" | "warn" | "danger" | "secondary" {
    if (!status) return "secondary";
    const map: Record<string, any> = {
      Realizada: "success",
      Pendiente: "info",
      NoRealizada: "danger",
    };
    return map[status] ?? "secondary";
  }

  statusLabel(status: string | null): string {
    if (!status) return "Sin ciclo";
    const map: Record<string, string> = {
      Realizada: "Realizada",
      Pendiente: "Pendiente",
      NoRealizada: "No Realizada",
    };
    return map[status] ?? status;
  }

  async startScan() {
    this.scanError.set("");
    this.scanStatus.set("Iniciando cómara...");
    this.scanning.set(true);
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const video = this.videoEl.nativeElement;
      video.srcObject = this.stream;
      await video.play();
      this.scanStatus.set("Apunta la cómara al código QR del equipo.");
      this.scanLoop(video);
    } catch {
      this.scanning.set(false);
      this.scanError.set(
        "No se pudo acceder a la cómara. Verifica los permisos.",
      );
      this.scanStatus.set("");
    }
  }

  private scanLoop(video: HTMLVideoElement) {
    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    const loop = () => {
      this.animationId = requestAnimationFrame(async () => {
        if (!this.scanning()) return;
        const barcodes = await detector.detect(video).catch(() => []);
        const qr = barcodes.find((b) =>
          b.rawValue.startsWith("luxuryapp://inspect/"),
        );
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
    let equipmentId = segments.length >= 2 ? segments[1] : segments[0];

    const match = this.periodItems().find(
      (p) => p.extinguisherId === equipmentId,
    );
    if (!match) {
      this.scanError.set(
        "Este equipo no pertenece al periodo de inspección actual.",
      );
      return;
    }

    const cycleItems: any[] = this.activeCycle()?.items ?? [];
    const cycleItem = cycleItems.find(
      (c) => c.equipmentId === match.extinguisherId,
    );
    await this.openChecklist({
      ...match,
      cycleStatus: cycleItem?.status ?? null,
    });
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
