import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { LuxTableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable } from "@ui/web/table/table";
import { SanctionListDTO } from "./interfaces/sanction.dto";
import { SanctionFormComponent } from "./sanction-form";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { DialogHandlerService } from "../../../../core/services/dialog-handler.service";

@Component({
  selector: "app-sanction-list",
  templateUrl: "./sanction-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconItem,
    MobileActionMenu,
    MobileButtonLabelItem,
    TableEmptyMessage,
    CommonModule,
    ApiDatePipe,
    AppTable,
    LuxTableCaption,
    TableFooter,
    DataViewMobile,
  ],
})
export class SanctionList {
  apiS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollH = inject(TableScrollHeightService);

  items = signal<SanctionListDTO[]>([]);
  globalFilter = signal<string>("");
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = globalFilterFields([
    "employeeName",
    "sanctionTypeName",
    "sanctionStatus",
  ]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS
      .onGetList<SanctionListDTO[]>(Endpoints.HR.Sanction.getAll)
      .then((resp) => {
        if (resp) this.items.set(resp);
      });
  }

  onCreate(incidentId: string): void {
    this.dialogHandlerS
      .openDialog(
        SanctionFormComponent,
        { data: { incidentId } },
        "Nueva Sanción",
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onChangeStatus(item: SanctionListDTO): void {
    this.dialogHandlerS
      .openDialog(
        SanctionFormComponent,
        { data: { id: item.id, changeStatus: true } },
        "Cambiar Estado de Sanción",
        this.dialogHandlerS.sizeMd,
      )
      .then(() => this.onLoadData());
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      Activa: "bg-green-100 text-green-700 border-green-200",
      Apelada: "bg-amber-100 text-amber-700 border-amber-200",
      Suspendida: "bg-amber-100 text-amber-700 border-amber-200",
      Cumplida: "bg-slate-100 text-slate-700 border-slate-200",
      Revocada: "bg-red-100 text-red-700 border-red-200",
    };
    return map[status] ?? "bg-slate-100 text-slate-700 border-slate-200";
  }
}
