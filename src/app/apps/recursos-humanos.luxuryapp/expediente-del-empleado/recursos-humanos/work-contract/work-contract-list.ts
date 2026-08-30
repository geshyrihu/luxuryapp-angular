import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import {
  EmployeeWorkContractListDTO,
  EmployeeWorkContractTerminateDTO,
} from "./interfaces/work-contract.dto";
import { WorkContractDetailComponent } from "./work-contract-detail";
import { WorkContractFormComponent } from "./work-contract-form";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-work-contract-list",
  templateUrl: "./work-contract-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    ApiDatePipe,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    WebButtonIconViewPdf,
  ],
})
export class WorkContractList implements OnInit {
  employeeId = signal<string | null>(null);
  private route = inject(ActivatedRoute);

  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  tableScrollH = inject(TableScrollHeightService);
  customerIdS = inject(CustomerIdService);

  items = signal<EmployeeWorkContractListDTO[]>([]);
  globalFilter = signal<string>("");
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = globalFilterFields([
    "contractNumber",
    "employeeName",
    "contractType",
    "status",
  ]);

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap.get("employeeId");
    this.employeeId.set(qp ?? null);
    this.onLoadData();
  }

  onLoadData(): void {
    const employeeId = this.employeeId();
    if (employeeId) {
      this.apiS
        .onGetList<EmployeeWorkContractListDTO[]>(
          Endpoints.HR.EmployeeWorkContract.byEmployee(employeeId),
        )
        .then((resp) => {
          if (resp) this.items.set(resp);
        });
      return;
    }

    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    this.apiS
      .onGetList<EmployeeWorkContractListDTO[]>(
        Endpoints.HR.EmployeeWorkContract.byCustomer(customerId),
      )
      .then((resp) => {
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
        { data: { item: prefilledItem, employeeId: this.employeeId() ?? undefined } },
        data.title,
        DialogSize.lg,
      )
      .then(() => this.onLoadData());
  }

  onEdit(item: EmployeeWorkContractListDTO): void {
    this.dialogS
      .openDialog(
        WorkContractFormComponent,
        { data: { item } },
        "Editar Contrato",
        DialogSize.lg,
      )
      .then(() => this.onLoadData());
  }

  onViewDetail(item: EmployeeWorkContractListDTO): void {
    this.dialogS.openDialog(
      WorkContractDetailComponent,
      { data: { id: item.id } },
      `Contrato ${item.contractNumber}`,
      DialogSize.lg,
    );
  }

  onDelete(id: string): void {
    this.apiS
      .onDelete(Endpoints.HR.EmployeeWorkContract.delete(id))
      .then(() => this.onLoadData());
  }

  onTerminate(item: EmployeeWorkContractListDTO): void {
    const dto: EmployeeWorkContractTerminateDTO = {
      terminationReason: "",
    };
    this.apiS
      .onPost(Endpoints.HR.EmployeeWorkContract.terminate(item.id), dto)
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
      PendienteFirma: "badge-info",
      Firmado: "badge-success",
    };
    return map[status] ?? "badge-neutral";
  }
}
