import { DatePipe } from "@angular/common";
import { Component, inject, input, OnInit, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web/label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web/label/button-edit";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web/label/button-item";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import { DialogSize } from "src/app/core/enums/dialog-size";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { WorkContractListDTO } from "../models/work-contract.dto";
import { WorkContractDetailComponent } from "./work-contract-detail";
import { WorkContractFormComponent } from "./work-contract-form";

@Component({
  selector: "app-work-contract-list",
  templateUrl: "./work-contract-list.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    DatePipe,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelItem,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelItem,
  ],
})
export class WorkContractList implements OnInit {
  employeeId = input<string>();

  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  tableScrollH = inject(TableScrollHeightService);

  items = signal<WorkContractListDTO[]>([]);
  globalFilter = signal<string>("");
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = globalFilterFields([
    "contractNumber",
    "employeeName",
    "contractType",
    "contractStatus",
  ]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    const endpoint = this.employeeId()
      ? Endpoints.HR.WorkContract.byEmployee(this.employeeId())
      : Endpoints.HR.WorkContract.getAll;
    this.apiS.onGetList<WorkContractListDTO[]>(endpoint).then((resp) => {
      if (resp) this.items.set(resp);
    });
  }

  onModalForm(data: { id: string; title: string }): void {
    const prefilledItem = this.employeeId()
      ? { employeeId: this.employeeId() }
      : null;
    this.dialogS
      .openDialog(
        WorkContractFormComponent,
        { data: { item: prefilledItem, employeeId: this.employeeId() } },
        data.title,
        DialogSize.lg,
      )
      .then(() => this.onLoadData());
  }

  onEdit(item: WorkContractListDTO): void {
    this.dialogS
      .openDialog(
        WorkContractFormComponent,
        { data: { item } },
        "Editar Contrato",
        DialogSize.lg,
      )
      .then(() => this.onLoadData());
  }

  onViewDetail(item: WorkContractListDTO): void {
    this.dialogS.openDialog(
      WorkContractDetailComponent,
      { data: { id: item.id } },
      `Contrato ${item.contractNumber}`,
      DialogSize.lg,
    );
  }

  onDelete(id: string): void {
    this.apiS
      .onDelete(Endpoints.HR.WorkContract.delete(id))
      .then(() => this.onLoadData());
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      Activo: "badge-success",
      Borrador: "badge-neutral",
      Expirado: "badge-warning",
      Terminado: "badge-danger",
      Cancelado: "badge-danger",
      Suspendido: "badge-warning",
    };
    return map[status] ?? "badge-neutral";
  }
}
