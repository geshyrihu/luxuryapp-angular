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
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { BitacoraFiltroFechaForm } from "@ui/web/bitacora-filtro-fecha/bitacora-filtro-fecha-form";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
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
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    DataViewMobile,
    TableCaption,
    TableFooter,

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
  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();
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
      this.dialogHandlerS.sizeLg,
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
