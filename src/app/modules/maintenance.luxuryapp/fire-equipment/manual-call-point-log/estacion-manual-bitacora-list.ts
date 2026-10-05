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
import { EstacionManualChecklist } from "../manual-call-point-checklist/estacion-manual-checklist";
import { EstacionManualBitacoraListDesktop } from "./desktop/estacion-manual-bitacora-list-desktop";
import { EstacionManualBitacoraPdfService } from "./estacion-manual-bitacora-pdf.service";
import { EstacionManualBitacoraListMobile } from "./mobile/estacion-manual-bitacora-list-mobile";

@Component({
  selector: "app-estacion-manual-bitacora-list",
  templateUrl: "./estacion-manual-bitacora-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EstacionManualBitacoraListDesktop, EstacionManualBitacoraListMobile],
})
export class EstacionManualBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  pdfS = inject(EstacionManualBitacoraPdfService);
  platformS = inject(PlatformService);
  rutaActiva = inject(ActivatedRoute);

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  stationId = "";

  ngOnInit(): void {
    this.stationId = this.rutaActiva.snapshot.params["stationId"];
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.FireEquipmentLogs.estacionManual.listByEquipment(
          this.stationId,
        ),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.FireEquipmentLogs.estacionManual.getById(id))
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
      "Reporte PDF de Bitácora Estaciones Manuales",
      this.dialogHandlerS.sizeXl,
    );
    if (result)
      await this.pdfS.downloadPdf(this.dataSignal(), result.from, result.to);
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        EstacionManualChecklist,
        { id: data.id, stationId: this.stationId },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
