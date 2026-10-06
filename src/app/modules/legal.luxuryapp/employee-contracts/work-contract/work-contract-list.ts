import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { WorkContractListDesktop } from "./desktop/work-contract-list-desktop";
import {
  EmployeeWorkContractListDTO,
  EmployeeWorkContractTerminateDTO,
} from "./interfaces/work-contract.dto";
import { WorkContractListMobile } from "./mobile/work-contract-list-mobile";
import { WorkContractDetailComponent } from "./work-contract-detail";
import { WorkContractFormComponent } from "./work-contract-form";

@Component({
  selector: "app-work-contract-list",
  templateUrl: "./work-contract-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [WorkContractListDesktop, WorkContractListMobile],
})
export class WorkContractList implements OnInit {
  employeeId = signal<string | null>(null);
  private route = inject(ActivatedRoute);

  apiS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  customerIdS = inject(CustomerIdService);
  confirmS = inject(ConfirmService);

  items = signal<EmployeeWorkContractListDTO[]>([]);
  globalFilter = signal<string>("");
  globalFilterFields = globalFilterFields([
    "contractNumber",
    "employeeName",
    "contractType",
    "status"]);

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
    this.dialogHandlerS
      .openDialog(
        WorkContractFormComponent,
        {
          data: {
            item: prefilledItem,
            employeeId: this.employeeId() ?? undefined,
          },
        },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onEdit(item: EmployeeWorkContractListDTO): void {
    this.dialogHandlerS
      .openDialog(
        WorkContractFormComponent,
        { data: { item } },
        "Editar Contrato",
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onViewDetail(item: EmployeeWorkContractListDTO): void {
    this.dialogHandlerS.openDialog(
      WorkContractDetailComponent,
      { data: { id: item.id } },
      `Contrato ${item.contractNumber}`,
      this.dialogHandlerS.sizeXl,
    );
  }

  async onDelete(id: string): Promise<void> {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este contrato?",
    );
    if (!ok) return;
    this.apiS
      .onDelete(Endpoints.HR.EmployeeWorkContract.delete(id))
      .then(() => this.onLoadData());
  }

  onTerminate(item: EmployeeWorkContractListDTO): void {
    const terminationReason = window.prompt(
      "Escriba el motivo de la terminación:",
    );
    if (!terminationReason?.trim()) return;

    const dto: EmployeeWorkContractTerminateDTO = {
      terminationReason: terminationReason.trim(),
    };
    this.apiS
      .onPost(Endpoints.HR.EmployeeWorkContract.terminate(item.id), dto)
      .then(() => this.onLoadData());
  }
}
