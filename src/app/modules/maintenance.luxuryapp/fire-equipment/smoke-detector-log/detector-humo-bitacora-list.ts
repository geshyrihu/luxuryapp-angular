import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { BitacoraFiltroFechaForm } from "@ui/web/bitacora-filtro-fecha/bitacora-filtro-fecha-form";
import { DetectorHumoChecklist } from "../smoke-detector-checklist/detector-humo-checklist";
import { DetectorHumoBitacoraListDesktop } from "./desktop/detector-humo-bitacora-list-desktop";
import { DetectorHumoBitacoraPdfService } from "./detector-humo-bitacora-pdf.service";
import { DetectorHumoBitacoraListMobile } from "./mobile/detector-humo-bitacora-list-mobile";

@Component({
  selector: "app-detector-humo-bitacora-list",
  templateUrl: "./detector-humo-bitacora-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DetectorHumoBitacoraListDesktop, DetectorHumoBitacoraListMobile],
})
export class DetectorHumoBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  pdfS = inject(DetectorHumoBitacoraPdfService);
  platformS = inject(PlatformService);
  rutaActiva = inject(ActivatedRoute);

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  detectorId = "";

  ngOnInit(): void {
    this.detectorId = this.rutaActiva.snapshot.params["detectorId"];
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.FireEquipmentLogs.detectorHumo.listByEquipment(
          this.detectorId,
        ),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.FireEquipmentLogs.detectorHumo.getById(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  async onPdfReport() {
    const result = await this.dialogHandlerS.openDialog<{
      from: Date;
      to: Date;
    }>(
      BitacoraFiltroFechaForm,
      {},
      "Reporte PDF de Bitácora Detectores de Humo",
      this.dialogHandlerS.sizeXl,
    );
    if (result)
      await this.pdfS.downloadPdf(this.dataSignal(), result.from, result.to);
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        DetectorHumoChecklist,
        { id: data.id, detectorId: this.detectorId },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
