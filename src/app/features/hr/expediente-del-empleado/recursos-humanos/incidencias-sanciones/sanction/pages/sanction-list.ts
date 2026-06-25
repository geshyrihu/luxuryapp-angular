import { EmptyState } from "src/app/core/components/empty-state/empty-state";
import { Component, inject, signal } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { TableModule } from "primeng/table";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { DialogSize } from "src/app/core/enums/dialog-size";
import { Endpoints } from "src/app/core/constants/endpoints";
import { tablePrimeNgRows, rowsPerPageOptions, globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { SanctionListDTO } from "../models/sanction.dto";
import { SanctionFormComponent } from "./sanction-form";

@Component({
  selector: "app-sanction-list",
  templateUrl: "./sanction-list.html",
  imports: [
    EmptyState,
    CommonModule,
    DatePipe,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonItem,
    DataViewMobile,
    ActionMenu,
    CustomButtonItem,
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
  globalFilterFields = globalFilterFields(["employeeName", "sanctionTypeName", "sanctionStatus"]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS.onGetList<SanctionListDTO[]>(Endpoints.HR.Sanction.getAll).then((resp) => {
      if (resp) this.items.set(resp);
    });
  }

  onCreate(incidentId: string): void {
    this.dialogS.openDialog(SanctionFormComponent, { data: { incidentId } }, "Aplicar Sanción", DialogSize.lg).then(() => this.onLoadData());
  }

  onChangeStatus(item: SanctionListDTO): void {
    this.dialogS.openDialog(SanctionFormComponent, { data: { id: item.id, changeStatus: true } }, "Cambiar Estatus de Sanción", DialogSize.sm).then(() => this.onLoadData());
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
