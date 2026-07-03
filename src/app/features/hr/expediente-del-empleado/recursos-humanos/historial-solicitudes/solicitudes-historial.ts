import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { firstValueFrom } from "rxjs";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web-label/button-item";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import Swal from "sweetalert2";
import { PermisoDetalleModal } from "../calendario-vacaciones-permisos/modal-permiso-detalle";
import { VacacionDetalleModal } from "../calendario-vacaciones-permisos/modal-vacacion-detalle";

import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
interface LeaveHistoryItemDTO {
  id: string;
  customerName?: string;
  employeeFullName: string;
  roleName?: string;
  startDate: string;
  endDate: string;
  statusName: string;
  requestDate: string;
  requestTypeName: string;
  approverName: string | null;
  approvalDate?: string | null;
}

interface VacationHistoryItemDTO {
  id: string;
  customerName?: string;
  employeeFullName: string;
  roleName?: string;
  startDate: string;
  endDate: string;
  statusName: string;
  requestDate: string;
  requestedDays: number;
  seniorityYearDescription: string;
  approverName: string | null;
  approvalDate?: string | null;
}

interface IHistorialSolicitud {
  id: string;
  customerName?: string;
  solicitud: string;
  employeeFullName: string;
  roleName?: string;
  startDate: string;
  endDate: string;
  status: string;
  requestDate: string;
  requestType: "leave" | "vacation";
  daysRequested: string;
  approverName: string | null;
  approvalDate?: string | null;
}

@Component({
  selector: "app-solicitudes-historial",
  templateUrl: "./solicitudes-historial.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    WebButtonLabelItem,
    WebButtonLabel,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    DataViewMobile,
    PrimeNgCustomCaption,
    CardModule,
  ],
  providers: [DatePipe],
})
export class SolicitudesHistorial implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private enumSelectS = inject(EnumSelectService);
  private formBuilder = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  private authS = inject(AuthService);
  private aspRoleS = inject(AspRoleService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  allowedCancellerRoles: EApplicationRole[] = [
    EApplicationRole.SuperUsuario,
    EApplicationRole.RecursosHumanos,
  ];
  canCancel = computed(() => this.aspRoleS.hasAny(this.allowedCancellerRoles));
  data = signal<IHistorialSolicitud[]>([]);
  loading = signal(true);
  employees = signal<ISelectItem[]>([]);
  requestTypes = signal<ISelectItem[]>([]);
  statuses = signal<ISelectItem[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  filterForm = this.formBuilder.group({
    employeeId: [null as number | null],
    requestType: [null as string | null],
    status: [null as string | null],
    startDate: [null as Date | null],
    endDate: [null as Date | null],
  });

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.loadEmployees(customerId);
        this.onSearch();
      }
    });
  }

  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  globalFilterFields = computed(() => {
    const data = this.data();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.loadStaticFilters();
  }

  async onCancel(item: IHistorialSolicitud): Promise<void> {
    const { value: reason } = await Swal.fire({
      title: "Cancelar Solicitud",
      input: "textarea",
      inputLabel: `Motivo de cancelación para la solicitud ${item.solicitud} de ${item.employeeFullName}:`,
      inputPlaceholder: "Ingresa el motivo de la cancelación aquó...",
      inputValidator: (value) => {
        if (!value) {
          return "El motivo de la cancelación es obligatorio.";
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar Cancelación",
      cancelButtonText: "No Cancelar",
      icon: "warning",
    });

    if (!reason) return;

    const dto = { rejectionReason: reason };
    const requestPromise =
      item.requestType === "vacation"
        ? this.apiResponseS.onPut(
            Endpoints.HR.VacationRequestApproval.cancel(item.id),
            dto,
          )
        : this.apiResponseS.onPut(
            Endpoints.HR.LeaveRequestApproval.cancel(item.id),
            dto,
          );

    requestPromise
      .then((success) => {
        if (success) {
          Swal.fire(
            "Cancelado",
            `La solicitud de ${item.solicitud} ha sido cancelada.`,
            "success",
          );
          this.onSearch();
        }
      })
      .catch((error) => {
        console.error("Error al llamar al API para cancelar:", error);
      });
  }

  loadStaticFilters() {
    this.requestTypes.set([
      { label: "Todos", value: null },
      { label: "Permisos", value: "leave" },
      { label: "Vacaciones", value: "vacation" },
    ]);

    firstValueFrom(this.enumSelectS.requestStatus(false)).then((response) => {
      const statuses = response || [];
      this.statuses.set([{ label: "Todos", value: null }, ...statuses]);
    });
  }

  loadEmployees(customerId: string) {
    this.apiResponseS
      .onGetSelectItem<
        ISelectItem[]
      >(Endpoints.SelectItems.employeesByUserId(customerId))
      .then((response) => {
        this.employees.set(response || []);
      });
  }

  onSearch() {
    this.loading.set(true);
    const formValues = this.filterForm.getRawValue();

    const params: Record<string, string | number> = {};
    const customerId: string = this.customerIdS.customerId();
    if (customerId) params.customerId = customerId;
    if (formValues.employeeId) params.employeeId = formValues.employeeId;
    if (formValues.status) params.status = formValues.status;
    if (formValues.startDate) {
      params.startDate =
        this.datePipe.transform(formValues.startDate, "yyyy-MM-dd") ?? "";
    }
    if (formValues.endDate) {
      params.endDate =
        this.datePipe.transform(formValues.endDate, "yyyy-MM-dd") ?? "";
    }

    const leaveRequest =
      formValues.requestType !== "vacation"
        ? this.apiResponseS.onGetList<LeaveHistoryItemDTO[]>(
            Endpoints.HR.LeaveRequestApproval.history,
            params,
          )
        : Promise.resolve([]);

    const vacationRequest =
      formValues.requestType !== "leave"
        ? this.apiResponseS.onGetList<VacationHistoryItemDTO[]>(
            Endpoints.HR.VacationRequestApproval.history,
            params,
          )
        : Promise.resolve([]);

    Promise.all([leaveRequest, vacationRequest])
      .then(([leaveResult, vacationResult]) => {
        const mappedLeaves = (leaveResult || []).map((item) => {
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

          const mapped: IHistorialSolicitud = {
            id: item.id,
            customerName: item.customerName,
            solicitud: item.requestTypeName,
            employeeFullName: item.employeeFullName,
            roleName: item.roleName,
            startDate: item.startDate,
            endDate: item.endDate,
            status: item.statusName,
            requestDate: item.requestDate,
            requestType: "leave",
            daysRequested: `${diffDays} día(s)`,
            approverName: item.approverName,
            approvalDate: item.approvalDate,
          };

          return mapped;
        });

        const mappedVacations = (vacationResult || []).map((item) => {
          const mapped: IHistorialSolicitud = {
            id: item.id,
            customerName: item.customerName,
            solicitud: "Vacaciones",
            employeeFullName: item.employeeFullName,
            roleName: item.roleName,
            startDate: item.startDate,
            endDate: item.endDate,
            status: item.statusName,
            requestDate: item.requestDate,
            requestType: "vacation",
            daysRequested: `${item.requestedDays} día(s) (${item.seniorityYearDescription})`,
            approverName: item.approverName,
            approvalDate: item.approvalDate,
          };

          return mapped;
        });

        const combinedData: IHistorialSolicitud[] = [
          ...mappedLeaves,
          ...mappedVacations,
        ];
        combinedData.sort(
          (a, b) =>
            new Date(b.requestDate).getTime() -
            new Date(a.requestDate).getTime(),
        );
        this.data.set(combinedData);
      })
      .finally(() => this.loading.set(false));
  }

  onReset() {
    this.filterForm.reset();
    this.onSearch();
  }

  onShowDetail(item: IHistorialSolicitud) {
    if (item.requestType === "leave") {
      this.dialogHandlerS.openDialog(
        PermisoDetalleModal,
        { id: item.id },
        "Detalle de Permiso",
        this.dialogHandlerS.sizeLg,
      );
    }

    if (item.requestType === "vacation") {
      this.dialogHandlerS.openDialog(
        VacacionDetalleModal,
        { id: item.id },
        "Detalle de Vacaciones",
        this.dialogHandlerS.sizeLg,
      );
    }
  }
}
