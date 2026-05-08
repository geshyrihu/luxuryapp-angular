import { CommonModule, DatePipe } from "@angular/common";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { MessageModule } from "primeng/message";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { getStatusSeverity as statusSeverityFn } from "src/app/features/recursos-humanos/helpers/status-severity.helper";
import { VacationBalanceDTO } from "src/app/features/recursos-humanos/interfaces/vacation-balance.interface";

export interface VacationHistoryItemDTO {
  id: string;
  employeeFullName: string;
  startDate: string;
  endDate: string;
  requestedDays: number;
  statusName: string;
  requestDate: string;
  approverName: string;
  rejectionReason?: string;
  seniorityYearDescription?: string;
}

/**
 * ?? Componente de Auditoróa Admin ó Balance de Vacaciones por Empleado.
 *
 * Permite a SuperUsuario/RecursosHumanos seleccionar cualquier empleado del
 * cliente en sesión y revisar su balance y historial de solicitudes por periodo
 * de aniversario, para validar que las reglas de negocio (RN-001 a RN-013)
 * se estón aplicando correctamente.
 *
 * **Flujo:**
 * 1. Carga empleados del `customerId` en sesión usando `select-item/employee/{customerId}`.
 * 2. Al seleccionar empleado ? carga sus años disponibles y el balance+historial del mós reciente.
 * 3. Al cambiar Año ? recarga balance e historial filtrado por ese periodo de aniversario.
 */
@Component({
  selector: "app-vacaciones-admin-auditoria",
  templateUrl: "./vacaciones-admin-auditoria.html",
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    CustomInputSelectSignal,
    MessageModule,
    TableModule,
    TagModule,
    DatePipe,
  ],
})
export class VacacionesAdminAuditoria implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  /** Lista de empleados del cliente en sesión para el selector. */
  employees = signal<ISelectItem[]>([]);

  /** ID del empleado seleccionado actualmente. */
  selectedEmployeeId = signal<string | null>(null);

  /** años de aniversario disponibles para el empleado seleccionado. */
  availableYears = signal<{ label: string; value: number }[]>([]);

  /** Año de inicio del periodo de aniversario seleccionado. */
  selectedYear = signal<number>(new Date().getFullYear());

  /** Balance del empleado para el periodo seleccionado. */
  balance = signal<VacationBalanceDTO | null>(null);

  /** Historial de solicitudes del empleado para el periodo seleccionado. */
  requests = signal<VacationHistoryItemDTO[]>([]);

  /** Spinner global del órea de resultados. */
  loadingResults = signal(false);

  /** Spinner solo para la carga inicial de empleados. */
  loadingEmployees = signal(true);

  constructor() {
    // Recarga la lista de empleados si el customerId cambia en sesión.
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.loadEmployees(customerId);
      }
    });
  }

  ngOnInit(): void {
    this.loadEmployees(this.customerIdS.customerId());
  }

  /** Carga la lista de empleados activos del cliente en sesión. */
  loadEmployees(customerId: string): void {
    if (!customerId) return;
    this.loadingEmployees.set(true);
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(`employee/${customerId}`)
      .then((response: ISelectItem[]) => this.employees.set(response ?? []))
      .finally(() => this.loadingEmployees.set(false));
  }

  /**
   * Al seleccionar un empleado:
   * 1. Limpia el estado anterior.
   * 2. Carga los años disponibles del empleado.
   * 3. Carga el balance + historial para el Año mós reciente.
   */
  async onEmployeeChange(employeeId: string | null): Promise<void> {
    this.selectedEmployeeId.set(employeeId);
    this.balance.set(null);
    this.requests.set([]);
    this.availableYears.set([]);

    if (!employeeId) return;

    this.loadingResults.set(true);
    try {
      // 1. Cargar años disponibles para este empleado.
      const years = await this.apiResponseS.onGetList<
        { label: string; value: number }[]
      >(Endpoints.HR.VacationRequestApproval.availableYears(employeeId));

      if (years && years.length > 0) {
        this.availableYears.set(years);

        // Inteligencia de Selección:
        const currentCalendarYear = new Date().getFullYear();
        const targetYear = currentCalendarYear - 1;

        const yearOption = years.find((y) => y.value === targetYear);

        if (yearOption) {
          this.selectedYear.set(yearOption.value);
        } else {
          // Si no existe (ej. es un empleado que acaba de entrar este mismo Año calendario),
          // seleccionamos el ónico/ultimo Año disponible.
          this.selectedYear.set(years[years.length - 1].value);
        }
      }

      // 2. Cargar balance + historial para el Año seleccionado.
      await this.loadBalanceAndHistory(employeeId, this.selectedYear());
    } finally {
      this.loadingResults.set(false);
    }
  }

  /** Al cambiar el Año del selector: recarga balance e historial. */
  async onYearChange(year: number): Promise<void> {
    this.selectedYear.set(year);
    const employeeId = this.selectedEmployeeId();
    if (!employeeId) return;

    this.loadingResults.set(true);
    try {
      await this.loadBalanceAndHistory(employeeId, year);
    } finally {
      this.loadingResults.set(false);
    }
  }

  /**
   * Carga en paralelo el balance del periodo y el historial completo del empleado,
   * luego filtra el historial al rango del periodo de aniversario seleccionado.
   */
  private async loadBalanceAndHistory(
    employeeId: string,
    year: number,
  ): Promise<void> {
    const [balanceData, allHistory] = await Promise.all([
      this.apiResponseS.onGetItem<VacationBalanceDTO>(
        Endpoints.HR.VacationRequestApproval.balanceByYear(employeeId, year),
      ),
      this.apiResponseS.onGetList<VacationHistoryItemDTO[]>(
        Endpoints.HR.VacationRequestApproval.history,
        { employeeId },
      ),
    ]);

    this.balance.set(balanceData);

    if (balanceData && allHistory) {
      this.requests.set(
        this.filterByAnniversaryPeriod(allHistory, balanceData),
      );
    }
  }

  /**
   * Filtra el historial para incluir solo solicitudes dentro del periodo de aniversario
   * del Año seleccionado (RN-002, RN-007).
   */
  private filterByAnniversaryPeriod(
    allHistory: VacationHistoryItemDTO[],
    balanceData: VacationBalanceDTO,
  ): VacationHistoryItemDTO[] {
    const admissionDate = new Date(balanceData.employeeAdmissionDate);
    const balanceYear = balanceData.year;

    const periodStart = new Date(
      balanceYear,
      admissionDate.getMonth(),
      admissionDate.getDate(),
    );
    const periodEnd = new Date(
      balanceYear + 1,
      admissionDate.getMonth(),
      admissionDate.getDate() - 1,
    );

    return allHistory.filter((req) => {
      const start = new Date(req.startDate);
      return start >= periodStart && start <= periodEnd;
    });
  }

  /** Retorna la severidad del tag de PrimeNG para el estado de la solicitud. */
  onGetSeverity(status: string) {
    return statusSeverityFn(status);
  }
}
