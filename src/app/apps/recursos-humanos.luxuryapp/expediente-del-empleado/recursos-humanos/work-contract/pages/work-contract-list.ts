import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import { DialogSize } from "src/app/core/enums/dialog-size";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { WorkContractListDTO } from "../models/work-contract.dto";
import { WorkContractDetailComponent } from "./work-contract-detail";
import { WorkContractFormComponent } from "./work-contract-form";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";

@Component({
  selector: "app-work-contract-list",
  templateUrl: "./work-contract-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    DatePipe,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
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
