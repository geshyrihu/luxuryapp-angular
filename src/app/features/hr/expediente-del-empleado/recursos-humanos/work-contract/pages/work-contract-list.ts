import { DatePipe } from "@angular/common";
import { Component, inject, input, OnInit, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
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
import { IonButtonItem } from "src/app/core/components/buttons/mobile/ion-button-item";
import { WorkContractListDTO } from "../models/work-contract.dto";
import { WorkContractDetailComponent } from "./work-contract-detail";
import { WorkContractFormComponent } from "./work-contract-form";

@Component({
  selector: "app-work-contract-list",
  templateUrl: "./work-contract-list.html",
  imports: [
    DatePipe,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonItem,
    DataViewMobile,
    ActionMenu,
    IonButtonItem,
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
    const prefilledItem = this.employeeId() ? { employeeId: this.employeeId() } : null;
    this.dialogS
      .openDialog(WorkContractFormComponent, { data: { item: prefilledItem, employeeId: this.employeeId() } }, data.title, DialogSize.lg)
      .then(() => this.onLoadData());
  }

  onEdit(item: WorkContractListDTO): void {
    this.dialogS
      .openDialog(WorkContractFormComponent, { data: { item } }, "Editar Contrato", DialogSize.lg)
      .then(() => this.onLoadData());
  }

  onViewDetail(item: WorkContractListDTO): void {
    this.dialogS.openDialog(WorkContractDetailComponent, { data: { id: item.id } }, `Contrato ${item.contractNumber}`, DialogSize.lg);
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
