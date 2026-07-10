import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDatepicker } from "@ui/inputs/web/custom-input-datepicker-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { TableModule } from "primeng/table";
import {
  PastVacationHistoryItemDTO,
  RegisterPastVacationDTO,
} from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/interfaces/register-past-vacation.interface";
import { VacationBalanceDTO } from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/interfaces/vacation-balance.interface";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { GlobalErrorService } from "src/app/core/http/services/global-error.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";

@Component({
  selector: "app-registrar-vacaciones-pasadas",
  templateUrl: "./vacaciones-pasadas-registro.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LxCard,
    CustomInputSelectSignal,
    CustomInputDatepicker,
    LxMessage,
    LxSkeleton,
    CustomInputTextAreaSignal,
    WebButtonLabel,
    WebButtonLabelSave,
    TableModule,
    LxTag,
  ],
})
export class VacacionesPasadasRegistro implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private formB = inject(FormBuilder);
  private authS = inject(AuthService);
  private dialogHandlerS = inject(DialogHandlerService);
  private globalErrorS = inject(GlobalErrorService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  employees = signal<ISelectItem[]>([]);
  submitting = signal(false);
  balance = signal<VacationBalanceDTO | null>(null);
  loadingBalance = signal(false);
  isSuperUsuario = signal(false);
  eligibilityStatus = signal<
    "eligible" | "not-yet-6-months" | "not-eligible-this-year" | null
  >(null);
  allowedAdvanceDaysDisplay = signal<number | null>(null);
  availableAdvanceDaysDisplay = signal<number | null>(null);
  serverError = signal<string | null>(null);
  diasFestivos = signal<Date[]>([]);
  dateRangeSignal = signal<(Date | null)[] | null>(null);
  history = signal<PastVacationHistoryItemDTO[]>([]);
  loadingHistory = signal(false);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  form = this.formB.nonNullable.group(
    {
      employeeId: [null as number | null, [Validators.required]],
      dateRange: [
        { value: null as Date[] | null, disabled: true },
        [Validators.required],
      ],
      comments: ["", [Validators.maxLength(500)]],
    },
    { validators: this.dateRangeValidator.bind(this) },
  );

  requestedDays = computed(() => {
    const dateRange = this.dateRangeSignal();
    const holidays = this.diasFestivos();
    if (dateRange && dateRange[0] && dateRange[1]) {
      const [startDate, endDate] = dateRange;
      return this.calculateBusinessDays(startDate, endDate, holidays);
    }
    return 0;
  });

  effectiveAvailableDaysAfterSelection = computed(() => {
    const currentBalance = this.balance();
    const daysRequested = this.requestedDays();

    if (!currentBalance) {
      return 0;
    }
    return currentBalance.availableDays - daysRequested;
  });

  private calculateBusinessDays(
    startDate: Date,
    endDate: Date,
    holidays: Date[],
  ): number {
    if (!startDate || !endDate) return 0;
    let days = 0;
    const current = new Date(startDate);
    current.setUTCHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setUTCHours(0, 0, 0, 0);

    while (current <= end) {
      const dayOfWeek = current.getUTCDay();

      if (dayOfWeek === 0) {
        current.setUTCDate(current.getUTCDate() + 1);
        continue;
      }

      const isHoliday = holidays.some(
        (holiday) => holiday.getTime() === current.getTime(),
      );

      if (isHoliday) {
        current.setUTCDate(current.getUTCDate() + 1);
        continue;
      }

      days++;
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return days;
  }

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.loadEmployees();
    });
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.loadHolidays(currentYear);
    this.onLoadData();
  }

  loadHolidays(year: number): void {
    this.apiResponseS
      .onGetItem(`configuracion/dias-festivos/${year}`)
      .then((response: { fecha: string }[]) => {
        const holidays = response.map((item) => {
          const date = new Date(item.fecha);
          return new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
          );
        });
        this.diasFestivos.set(holidays);
      });
  }

  private destroyRef = inject(DestroyRef);
  private userRoleSignal = toSignal(this.authS.userRole$);

  onLoadData() {
    this.isSuperUsuario.set(this.userRoleSignal() === "SuperUsuario");

    this.form.controls.employeeId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((employeeId) => {
        this.resetBalanceState();
        this.history.set([]);
        if (employeeId) {
          this.refreshBalance();
          this.loadHistory(employeeId);
        }
      });

    this.form.controls.dateRange.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log("é” [ValueChanges] dateRange:", value);
        this.dateRangeSignal.set(value);
        this.form.updateValueAndValidity();
      });
  }

  // Nuevo método para capturar la selección manual
  onDateSelect(value: Date[] | null) {
    console.log("click ?? [onSelect] Calendario:", value);
    // Forzamos la actualización por si el ValueChanges falla
    this.dateRangeSignal.set(value);
    this.form.updateValueAndValidity();
    console.log(
      "é” Estado Form tras selección:",
      this.form.status,
      "Errores:",
      this.form.errors,
    );
  }

  loadEmployees(): void {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId) return;
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(`employee/${customerId}`)
      .then((response: ISelectItem[]) => this.employees.set(response));
  }

  loadHistory(employeeId: number): void {
    this.loadingHistory.set(true);
    this.apiResponseS
      .onGetList<PastVacationHistoryItemDTO[]>(
        Endpoints.HR.VacationRequestApproval.history,
        { employeeId },
      )
      .then((response) => this.history.set(response))
      .finally(() => this.loadingHistory.set(false));
  }

  loadBalance(employeeId: number): void {
    this.loadingBalance.set(true);
    this.apiResponseS
      .onGetItem(`vacation-request-approvals/${employeeId}/balance`)
      .then((response: VacationBalanceDTO) => {
        console.log("é” Balance Cargado:", response);
        this.balance.set(response);
        if (response) {
          const hireDate = new Date(response.employeeAdmissionDate);
          const today = new Date();

          let monthsOfService =
            (today.getFullYear() - hireDate.getFullYear()) * 12 +
            today.getMonth() -
            hireDate.getMonth();
          if (today.getDate() < hireDate.getDate()) {
            monthsOfService--;
          }

          if (monthsOfService < 6) {
            console.warn("⚠é Empleado con menos de 6 meses");
            this.eligibilityStatus.set("not-yet-6-months");
            this.form.controls.dateRange.disable();
          } else if (response.seniorityYears < 1 && response.isAdvancePeriod) {
            this.eligibilityStatus.set("eligible");
            this.allowedAdvanceDaysDisplay.set(response.allowedAdvanceDays);
            this.availableAdvanceDaysDisplay.set(response.availableAdvanceDays);
            this.form.controls.dateRange.enable();
          } else if (response.totalDays > 0 || response.isAdvancePeriod) {
            this.eligibilityStatus.set("eligible");
            this.allowedAdvanceDaysDisplay.set(null);
            this.availableAdvanceDaysDisplay.set(null);
            this.form.controls.dateRange.enable();
          } else {
            console.warn("⚠é No elegible este Aóo");
            this.eligibilityStatus.set("not-eligible-this-year");
            this.form.controls.dateRange.disable();
          }
        } else {
          this.eligibilityStatus.set(null);
          this.form.controls.dateRange.disable();
        }
      })
      .catch((err) => {
        console.error("? Error cargando balance:", err);
        this.balance.set(null);
        this.form.controls.dateRange.disable();
      })
      .finally(() => this.loadingBalance.set(false));
  }

  refreshBalance() {
    const employeeId = this.form.controls.employeeId.value;
    if (!employeeId) return;

    this.loadBalance(employeeId);
  }

  resetBalanceState(): void {
    this.form.controls.dateRange.reset();
    this.form.controls.dateRange.disable();
    this.balance.set(null);
    this.dateRangeSignal.set(null);
    this.eligibilityStatus.set(null);
    this.allowedAdvanceDaysDisplay.set(null);
    this.availableAdvanceDaysDisplay.set(null);
  }

  clearDateRange(): void {
    this.form.controls.dateRange.reset();
  }

  onDateCleared(): void {
    this.clearDateRange();
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const dateRange = control.get("dateRange")?.value;
    const balance = this.balance();

    if (
      !dateRange ||
      !Array.isArray(dateRange) ||
      !dateRange[0] ||
      !dateRange[1]
    ) {
      return { incompleteRange: true };
    }

    if (!balance) {
      return { noBalance: true };
    }

    const requestedDays = this.calculateBusinessDays(
      dateRange[0],
      dateRange[1],
      this.diasFestivos(),
    );

    const available = balance.isAdvancePeriod
      ? balance.availableDays + balance.availableAdvanceDays
      : balance.availableDays;

    console.log(
      `é” Validando: Solicitados=${requestedDays}, Disponibles=${available}`,
    );

    if (requestedDays > available) {
      console.error("? Error: Días insuficientes");
      return {
        notEnoughDays: {
          requested: requestedDays,
          available: available,
        },
      };
    }

    console.log("? Validación exitosa");
    return null;
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }

  onSubmit(): void {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);
    this.serverError.set(null);

    const formValue = this.form.getRawValue(); // Use getRawValue for TypedForms to get all values safely
    const dateRange = formValue.dateRange;

    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      this.submitting.set(false);
      return;
    }

    const [startDate, endDate] = dateRange;

    const DTO: RegisterPastVacationDTO = {
      employeeId: formValue.employeeId!, // Assert non-null as validated
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
      reason: formValue.comments?.trim(),
    };

    this.apiResponseS
      .onPost(Endpoints.HR.PastVacations.create, DTO)
      .then((result) => {
        if (result) {
          // Capturamos el ID antes de limpiar para no perder el contexto
          const currentEmployeeId = this.form.controls.employeeId.value;

          // Limpieza selectiva: No usamos form.reset() para no perder el empleado
          this.form.controls.dateRange.reset();
          this.form.controls.comments.reset();

          // Refrescamos los datos para que el usuario vea el cambio reflejado
          if (currentEmployeeId) {
            console.log(
              "é” Refrescando datos para el empleado:",
              currentEmployeeId,
            );
            this.refreshBalance();
            this.loadHistory(currentEmployeeId);
          }
        } else {
          const error = this.globalErrorS.errorSubject.getValue();
          this.serverError.set(
            error?.message || "Ocurrió un error inesperado.",
          );
        }
      })
      .finally(() => this.submitting.set(false));
  }
}
