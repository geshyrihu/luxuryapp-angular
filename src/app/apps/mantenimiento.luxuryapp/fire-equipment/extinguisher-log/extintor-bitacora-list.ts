import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { BitacoraFiltroFechaForm } from "@ui/web/bitacora-filtro-fecha/bitacora-filtro-fecha-form";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ExtintorChecklist } from "../extinguisher-checklist/extintor-checklist";
import { ExtintorBitacoraPdfService } from "./extintor-bitacora-pdf.service";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconDownload } from "@ui/buttons/web-icon/button-download";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

@Component({
  selector: "app-extintor-bitacora-list",
  templateUrl: "./extintor-bitacora-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconDownload,
    WebButtonIconEdit,
    WebButtonIconDelete,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DatePipe,
    MobileListItem,
    AppIcon,
  ],
})
export class ExtintorBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  pdfS = inject(ExtintorBitacoraPdfService);
  rutaActiva = inject(ActivatedRoute);

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  extinguisherId = "";

  ngOnInit(): void {
    this.extinguisherId = this.rutaActiva.snapshot.params["extinguisherId"];
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.RefactorMantenimiento.bitacoraExtintorListById(
          this.extinguisherId,
        ),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.RefactorMantenimiento.bitacoraExtintorById(id))
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
      "Reporte PDF é€” Bitúcora Extintores",
      this.dialogHandlerS.sizeSm,
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
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
