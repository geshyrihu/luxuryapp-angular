import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable } from "@ui/web/table/table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { DialogSize } from "@core/enums/dialog-size.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
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
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

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
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    TableCaption,
    TableFooter,
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
  confirmS = inject(ConfirmService);

  items = signal<EmployeeWorkContractListDTO[]>([]);
  globalFilter = signal<string>("");
  tableRows: number = tableRows();
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

  async onDelete(id: string): Promise<void> {
    const ok = await this.confirmS.confirm("¿Está seguro de eliminar este contrato?");
    if (!ok) return;
    this.apiS
      .onDelete(Endpoints.HR.EmployeeWorkContract.delete(id))
      .then(() => this.onLoadData());
  }

  onTerminate(item: EmployeeWorkContractListDTO): void {
    const terminationReason = window.prompt("Escriba el motivo de la terminación:");
    if (!terminationReason?.trim()) return;

    const dto: EmployeeWorkContractTerminateDTO = {
      terminationReason: terminationReason.trim(),
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
