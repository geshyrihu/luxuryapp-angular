import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageModule } from "primeng/message";
import { PanelModule } from "primeng/panel";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { GlobalErrorService } from "src/app/core/services/global-error.service";
import { VacationBalanceDTO } from "src/app/features/hr/expediente-del-empleado/recursos-humanos/interfaces/vacation-balance.interface";
import { VacationRequestMyDTO } from "../interfaces/vacation-request.interface";

interface HolidayResponseDTO {
  fecha: string;
}

interface VacationRequestEditDTO {
  startDate: string;
  endDate: string;
  reason: string | null;
}
@Component({
  selector: "app-vacaciones-form",
  templateUrl: "./vacaciones-form.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    PanelModule,
    MessageModule,
    CustomInputDateSignal,
    // CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class VacacionesForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  globalErrorS = inject(GlobalErrorService);
  id: string | null = this.config.data?.id || null;
  submitting = signal(false);
  serverError = signal<string | null>(null);
  balance: VacationBalanceDTO | null = null;
  currentYear = new Date().getFullYear();
  disabledDates = signal<Date[]>([]); // Signal para fechas deshabilitadas
  diasFestivos = signal<Date[]>([]); // Signal para días festivos

  // Crear signals que escuchen los cambios del formulario
  private startDateSignal = signal<Date | null>(null);
  private endDateSignal = signal<Date | null>(null);

  form = this.formB.nonNullable.group(
    {
      startDate: ["", [Validators.required]], // Type inferred as string | Date? Initially "" suggests string. CustomInputDateSignal often works with Date or string.
      endDate: ["", [Validators.required]],
      reason: ["", [Validators.maxLength(500)]],
    },
    { validators: this.dateRangeValidator.bind(this) },
  );

  requestedDaysCount = computed(() => {
    const startDate = this.startDateSignal();
    const endDate = this.endDateSignal();
    const holidays = this.diasFestivos();

    if (startDate && endDate && new Date(endDate) >= new Date(startDate)) {
      return this.calculateDaysBetweenDates(
        new Date(startDate),
        new Date(endDate),
        holidays,
      );
    }
    return 0;
  });

  effectiveAvailableDays = computed(() => {
    if (!this.balance) {
      return 0;
    }
    return this.balance.availableDays - this.requestedDaysCount();
  });

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // TODO: Cargar dinámicamente los aóos si el rango de fechas abarca mís de uno.
    this.loadHolidays(this.currentYear);
    this.loadAvailableYearsAndBalance();
    this.loadExistingRequests();

    this.form.controls.startDate.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const newDate = this.dateS.parseDate(value);
        this.startDateSignal.set(newDate);

        // Reactividad de Periodo: Si la fecha seleccionada pertenece a otro Periodo Laboral, recargamos el saldo correspondiente.
        if (newDate && this.balance) {
          const admissionDate = new Date(this.balance.employeeAdmissionDate);

          // Trabajar estrictamente en zona local para consistencia UI
          const targetDate = new Date(
            newDate.getFullYear(),
            newDate.getMonth(),
            newDate.getDate(),
          );
          const annivThisYear = new Date(
            targetDate.getFullYear(),
            admissionDate.getMonth(),
            admissionDate.getDate(),
          );

          const computedYear =
            targetDate < annivThisYear
              ? targetDate.getFullYear() - 1
              : targetDate.getFullYear();
          if (computedYear !== this.currentYear) {
            this.currentYear = computedYear;
            // Refresca el Aóo mostrado en UI y recalcula los pending days correctos
            this.reloadBalanceForYear(this.currentYear);
          }
        }
      });

    this.form.controls.endDate.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.endDateSignal.set(this.dateS.parseDate(value));
      });
  }

  loadHolidays(year: number): void {
    this.apiResponseS
      .onGetItem<HolidayResponseDTO[]>(Endpoints.Settings.holidaysByYear(year))
      .then((response) => {
        if (!response) return;
        const holidays = response.map((item) => {
          const date = new Date(item.fecha);
          // La fecha de la API viene como YYYY-MM-DD. Al crear un new Date()
          // puede interpretarse como UTC, pero para la comparación en el cliente,
          // es mís seguro tratarlo con la zona horaria local. Re-ajustamos a UTC 00:00.
          return new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
          );
        });
        this.diasFestivos.set(holidays);
      });
  }

  async reloadBalanceForYear(year: number): Promise<void> {
    try {
      let url = Endpoints.HR.VacationRequest.getBalanceByYear(year);
      if (this.id) {
        url += `&excludeRequestId=${this.id}`;
      }
      this.balance = await this.apiResponseS.onGetItem<VacationBalanceDTO>(url);
      this.form.updateValueAndValidity(); // Forzar re-validación con el nuevo saldo
    } catch (e) {
      console.error("Error al recargar el saldo para el Aóo:", year, e);
    }
  }

  async loadAvailableYearsAndBalance(): Promise<void> {
    try {
      // 1. Obtener balance por defecto (backend decide el periodo activo basado en UtcNow)
      let url = Endpoints.HR.VacationRequest.getBalance;
      if (this.id) {
        url += `?excludeRequestId=${this.id}`;
      }

      this.balance = await this.apiResponseS.onGetItem<VacationBalanceDTO>(url);
      if (this.balance) {
        this.currentYear = this.balance.year;
      }

      // 2. Obtener lista de aóos para el selector
      const response = await this.apiResponseS.onGetList<
        { label: string; value: number }[]
      >(Endpoints.HR.VacationRequest.availableYears);
      if (response && response.length > 0) {
        // Aseguramos que el Aóo devuelto por el backend esté pre-seleccionado
        const yearOption = response.find((y) => y.value === this.currentYear);
        if (!yearOption) {
          this.currentYear = response[response.length - 1].value;
        }
      }
    } catch (error) {
      console.error("Error loading available years or balance:", error);
    }

    // 3. Cargar la data del form (si es edición) o validar de inmediato
    if (this.id) {
      this.apiResponseS
        .onGetItem<VacationRequestEditDTO>(
          Endpoints.HR.VacationRequest.getById(this.id),
        )
        .then((requestData) => {
          if (!requestData) return;
          this.form.patchValue(requestData);
          if (requestData.startDate)
            this.startDateSignal.set(
              this.dateS.parseDate(requestData.startDate),
            );
          if (requestData.endDate)
            this.endDateSignal.set(this.dateS.parseDate(requestData.endDate));
        });
    } else {
      this.form.updateValueAndValidity();
    }
  }

  loadExistingRequests(): void {
    this.apiResponseS
      .onGetList<VacationRequestMyDTO[]>(Endpoints.HR.VacationRequest.getAll)
      .then((requests) => {
        if (!requests) return;
        const datesToDisable: Date[] = [];
        requests.forEach((request) => {
          if (this.id && request.id === this.id) {
            return;
          }

          if (
            request.status === "Rechazada" ||
            request.status === "Cancelada"
          ) {
            return;
          }

          const start = new Date(request.startDate);
          const end = new Date(request.endDate);

          start.setUTCHours(0, 0, 0, 0);
          end.setUTCHours(0, 0, 0, 0);

          let currentDate = new Date(start);

          while (currentDate <= end) {
            datesToDisable.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
        this.disabledDates.set(datesToDisable);
        // Forzar validación una vez que sabemos qué fechan colisionan
        this.form.updateValueAndValidity();
      });
  }

  private calculateDaysBetweenDates(
    startDate: Date,
    endDate: Date,
    holidays: Date[],
  ): number {
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

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get("startDate")?.value;
    const endDate = control.get("endDate")?.value;

    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return { dateRangeInvalid: true };
    }

    if (!this.balance) {
      return null; // Espera a que cargue el balance
    }

    // Calcula días solicitados
    const requested = this.calculateDaysBetweenDates(
      start,
      end,
      this.diasFestivos(),
    );

    // Regla 1: Prevenir que la solicitud contenga fechas anteriores al ingreso del empleado
    const admissionDate = new Date(this.balance.employeeAdmissionDate);
    admissionDate.setUTCHours(0, 0, 0, 0); // Limpiar horas para no afectar la comparación.
    const startUTC = new Date(start);
    startUTC.setUTCHours(0, 0, 0, 0);

    if (startUTC < admissionDate) {
      return { beforeAdmission: true };
    }

    // Regla 2: Empalme con solicitudes previas.
    // Asegura que ninguna fecha dentro del rango caiga en un día previamente bloqueado (aprobado/pendiente).
    let hasOverlap = false;
    let currentDate = new Date(startUTC);
    const endDateUTC = new Date(end);
    endDateUTC.setUTCHours(0, 0, 0, 0);
    const disabled = this.disabledDates();

    while (currentDate <= endDateUTC) {
      // En UI bloqueamos los ms exactos con timezone, validemos .getTime()
      if (
        disabled.some(
          (d) =>
            d.getTime() === currentDate.getTime() ||
            (d.getUTCDate() === currentDate.getUTCDate() &&
              d.getUTCMonth() === currentDate.getUTCMonth() &&
              d.getUTCFullYear() === currentDate.getUTCFullYear()),
        )
      ) {
        hasOverlap = true;
        break;
      }
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    if (hasOverlap) {
      return { overlapDates: true };
    }

    // Regla 3: Saldo Insuficiente (Aplica a TODOS, tanto normales como en periodo de adelanto)
    if (requested > this.balance.availableDays) {
      return {
        notEnoughDays: {
          requestedDays: requested,
          availableDays: this.balance.availableDays,
        },
      };
    }

    // Regla 4: Lómite estricto de Adelanto (RN-006)
    // Extra-candado solo para empleados de Nuevo Ingreso (<1 Aóo)
    if (this.balance.isAdvancePeriod) {
      if (requested > this.balance.availableAdvanceDays) {
        return {
          advanceLimitExceeded: {
            requestedDays: requested,
            availableAdvance: this.balance.availableAdvanceDays,
          },
        };
      }
    }

    return null;
  }

  private formatDate(date: Date | string): string {
    return this.dateS.getDateFormat(date) ?? "";
  }

  async onSubmit(): Promise<void> {
    this.serverError.set(null);

    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.id
        ? Endpoints.HR.VacationRequest.update(this.id)
        : Endpoints.HR.VacationRequest.create,
      method: this.id ? "PUT" : "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (formValue) => ({
        startDate: this.formatDate(formValue.startDate),
        endDate: this.formatDate(formValue.endDate),
        reason: formValue.reason,
      }),
    });

    if (!result) {
      const error = this.globalErrorS.errorSubject.getValue();
      this.serverError.set(error?.message || "Ocurrió un error inesperado.");
    }
  }
}
