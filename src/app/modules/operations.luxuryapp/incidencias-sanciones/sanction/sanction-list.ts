import { CommonModule } from "@angular/common";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { DialogSize } from "@core/enums/dialog-size.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { SanctionListDTO } from "./interfaces/sanction.dto";
import { SanctionFormComponent } from "./sanction-form";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

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
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
  ],
})
export class SanctionList {
  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  tableScrollH = inject(TableScrollHeightService);

  items = signal<SanctionListDTO[]>([]);
  globalFilter = signal<string>("");
  tablePrimeNgRows: number = tablePrimeNgRows();
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
    this.dialogS
      .openDialog(
        SanctionFormComponent,
        { data: { incidentId } },
        "Nueva Sanción",
        DialogSize.lg,
      )
      .then(() => this.onLoadData());
  }

  onChangeStatus(item: SanctionListDTO): void {
    this.dialogS
      .openDialog(
        SanctionFormComponent,
        { data: { id: item.id, changeStatus: true } },
        "Cambiar Estado de Sanción",
        DialogSize.sm,
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
