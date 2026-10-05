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
import { ExtintorChecklist } from "../extinguisher-checklist/extintor-checklist";
import { ExtintorBitacoraListDesktop } from "./desktop/extintor-bitacora-list-desktop";
import { ExtintorBitacoraPdfService } from "./extintor-bitacora-pdf.service";
import { ExtintorBitacoraListMobile } from "./mobile/extintor-bitacora-list-mobile";

@Component({
  selector: "app-extintor-bitacora-list",
  templateUrl: "./extintor-bitacora-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ExtintorBitacoraListDesktop, ExtintorBitacoraListMobile],
})
export class ExtintorBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  pdfS = inject(ExtintorBitacoraPdfService);
  platformS = inject(PlatformService);
  rutaActiva = inject(ActivatedRoute);

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  extinguisherId = "";

  ngOnInit(): void {
    this.extinguisherId = this.rutaActiva.snapshot.params["extinguisherId"];
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.FireEquipmentLogs.extintor.listByEquipment(
          this.extinguisherId,
        ),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.FireEquipmentLogs.extintor.getById(id))
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
      "Reporte PDF de Bitácora Extintores",
      this.dialogHandlerS.sizeXl,
    );
    if (result)
      await this.pdfS.downloadPdf(this.dataSignal(), result.from, result.to);
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        ExtintorChecklist,
        { id: data.id, extinguisherId: this.extinguisherId },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
