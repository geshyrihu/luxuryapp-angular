import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { InputTextModule } from "@ui/web/primeng-inputtext/primeng-inputtext";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { SweetAlertIcon } from "src/app/core/enums/sweetalert-icon.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { WebButtonLabelActiveDesactive } from "src/app/shared/ui/buttons";
import Swal from "sweetalert2";
import { CandidateApplicationForm } from "../../candidate-application/candidate-application-form";
import { CandidateDetail } from "../candidate-detail";

interface FormerEmployeeTalentPoolItem {
  employeeId: string;
  applicationUserId: string;
  customerId: string;
  customerName: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  workPositionName: string;
  workPositionFolio: string;
  dateAdmission: string;
  salary: number;
  candidateId?: string | null;
  hasCandidate: boolean;
}

interface FormerEmployeeCandidateResult {
  employeeId: string;
  candidateId: string;
  created: boolean;
  candidateName: string;
}

@Component({
  selector: "app-former-employee-talent-pool",
  templateUrl: "./former-employee-talent-pool.html",
  styleUrl: "./former-employee-talent-pool.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CustomInputSelectSignal,
    InputTextModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
    ReactiveFormsModule,
    TableModule,
    WebButtonLabel,
    WebButtonLabelActiveDesactive,
  ],
})
export class FormerEmployeeTalentPool implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  readonly dataSignal = signal<FormerEmployeeTalentPoolItem[]>([]);
  readonly customers = signal<SelectItemDto[]>([]);
  readonly loading = signal(false);
  readonly customerControl = new FormControl<string | null>(null);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  readonly totalRecords = signal(0);
  readonly employeeState = signal<boolean>(false);

  ngOnInit(): void {
    void this.loadCustomers();
    void this.onLoadData();
  }

  async loadCustomers(): Promise<void> {
    const result = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.customersActiveShortName,
    );

    this.customers.set([
      { value: "", label: "Todos los clientes" },
      ...(result ?? []),
    ]);
  }

  async onLoadData(): Promise<void> {
    this.loading.set(true);
    const params: {
      page: number;
      recordsNumber: number;
      customerId?: string;
      isActive?: boolean;
    } = {
      page: 1,
      recordsNumber: 300,
      isActive: this.employeeState(),
    };
    const customerId = this.customerControl.value;
    if (customerId) {
      params.customerId = customerId;
    }

    const response = await this.apiResponseS.onGetPaged<
      FormerEmployeeTalentPoolItem[]
    >(EndpointsReclutamiento.Candidates.formerEmployees, params);

    this.loading.set(false);
    if (!response) return;

    this.dataSignal.set(response.data ?? []);
    this.totalRecords.set(response.totalCount ?? response.data?.length ?? 0);
  }

  async onCustomerChange(): Promise<void> {
    await this.onLoadData();
  }

  async onSelectActive(active: boolean): Promise<void> {
    this.employeeState.set(active);
    await this.onLoadData();
  }

  async onViewCandidate(item: FormerEmployeeTalentPoolItem): Promise<void> {
    const candidateId = await this.ensureCandidate(item);
    if (!candidateId) return;

    await this.dialogHandlerS.openDialog(
      CandidateDetail,
      { id: candidateId },
      "Detalle del candidato",
      this.dialogHandlerS.sizeLg,
    );
  }

  async onPostulate(item: FormerEmployeeTalentPoolItem): Promise<void> {
    const confirmation = await Swal.fire({
      title: "Postular a vacante",
      text: `¿Deseas postular a ${item.fullName} para reingreso? Se creará o reutilizará su ficha de candidato con la información de su expediente anterior.`,
      icon: SweetAlertIcon.Question,
      showCancelButton: true,
      confirmButtonText: "Sí, postular",
      cancelButtonText: "Cancelar",
    });

    if (!confirmation.isConfirmed) return;

    const candidateId = await this.ensureCandidate(item);
    if (!candidateId) return;

    await this.dialogHandlerS.openDialog(
      CandidateApplicationForm,
      {
        id: "",
        candidateId,
        allowCreateCandidate: false,
      },
      `Postular a vacante - ${item.fullName}`,
      this.dialogHandlerS.sizeLg,
    );

    await this.onLoadData();
  }

  private async ensureCandidate(
    item: FormerEmployeeTalentPoolItem,
  ): Promise<string | null> {
    if (item.candidateId) return item.candidateId;

    const result =
      await this.apiResponseS.onPost<FormerEmployeeCandidateResult>(
        EndpointsReclutamiento.Candidates.ensureFromFormerEmployee(
          item.employeeId,
        ),
        {},
      );

    if (!result) return null;

    this.dataSignal.update((data) =>
      data.map((row) =>
        row.employeeId === item.employeeId
          ? { ...row, candidateId: result.candidateId, hasCandidate: true }
          : row,
      ),
    );

    return result.candidateId;
  }
}
