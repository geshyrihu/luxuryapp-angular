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
import { HidranteChecklist } from "../hydrant-checklist/hidrante-checklist";
import { HidranteBitacoraListDesktop } from "./desktop/hidrante-bitacora-list-desktop";
import { HidranteBitacoraPdfService } from "./hidrante-bitacora-pdf.service";
import { HidranteBitacoraListMobile } from "./mobile/hidrante-bitacora-list-mobile";

@Component({
  selector: "app-hidrante-bitacora-list",
  templateUrl: "./hidrante-bitacora-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [HidranteBitacoraListDesktop, HidranteBitacoraListMobile],
})
export class HidranteBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  pdfS = inject(HidranteBitacoraPdfService);
  platformS = inject(PlatformService);
  rutaActiva = inject(ActivatedRoute);

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  hydrantId = "";

  ngOnInit(): void {
    this.hydrantId = this.rutaActiva.snapshot.params["hydrantId"];
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.FireEquipmentLogs.hidrante.listByEquipment(this.hydrantId),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.FireEquipmentLogs.hidrante.getById(id))
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
      "Reporte PDF de Bitácora Hidrantes",
      this.dialogHandlerS.sizeXl,
    );
    if (result)
      await this.pdfS.downloadPdf(this.dataSignal(), result.from, result.to);
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        HidranteChecklist,
        { id: data.id, hydrantId: this.hydrantId },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
