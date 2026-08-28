import { ApiDatePipe } from "../../../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DateService } from "src/app/core/services/date.service";
import {
  SuspensionDayAddDTO,
  SuspensionDayDetailDTO,
} from "../interfaces/incident.interfaces";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

@Component({
  selector: "app-suspension-days-manager",
  imports: [
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,
    ReactiveFormsModule,
    TableModule,
    ApiDatePipe,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelAdd,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./suspension-days-manager.html",
})
export class SuspensionDaysManager implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private toastS = inject(CustomToastService);
  private dateS = inject(DateService);
  private fb = inject(NonNullableFormBuilder);

  incidentId = input.required<string>();

  days = signal<SuspensionDayDetailDTO[]>([]);
  saving = signal(false);
  loading = signal(false);

  form = this.fb.group({
    dates: this.fb.control<Date[] | null>(null),
    notes: this.fb.control(""),
  });

  private toYyyyMmDd(date: Date): string {
    return this.dateS.getDateFormat(date);
  }

  /** Parsea una fecha ISO "YYYY-MM-DD" sin desfase de zona horaria */
  private parseLocalDate(isoStr: string): Date {
    return new Date(`${isoStr.substring(0, 10)}T00:00:00`);
  }

  /** Fechas ya registradas — para deshabilitar en el datepicker */
  disabledDates = computed(() =>
    this.days().map((d) => this.parseLocalDate(String(d.suspensionDate))),
  );

  /** Resumen legible de los días registrados */
  daysFormatted = computed(() =>
    this.days()
      .map((d) =>
        this.parseLocalDate(String(d.suspensionDate)).toLocaleDateString(
          "es-MX",
          {
            day: "2-digit",
            month: "long",
          },
        ),
      )
      .join(", "),
  );

  ngOnInit(): void {
    this.loadDays();
  }

  loadDays(): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetItem<SuspensionDayDetailDTO[]>(
        Endpoints.HR.Incident.suspensionDays.getByIncident(this.incidentId()),
      )
      .then((result) => this.days.set(result ?? []))
      .finally(() => this.loading.set(false));
  }

  addDays(): void {
    // flatpickr en modo "multiple" puede propagar string "YYYY-MM-DD, YYYY-MM-DD" o Date[]
    // Casteamos a any para manejar ambos casos en runtime independientemente del tipo declarado
    const rawValue: any = this.form.controls.dates.value;
    if (!rawValue) return;

    let sorted: Date[];
    if (typeof rawValue === "string") {
      sorted = (rawValue as string)
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => !!s)
        .map((s: string) => new Date(`${s}T00:00:00`))
        .filter((d: Date) => !isNaN(d.getTime()))
        .sort((a: Date, b: Date) => a.getTime() - b.getTime());
    } else {
      sorted = (rawValue as any[])
        .map((f: any) =>
          f instanceof Date
            ? f
            : new Date(`${String(f).substring(0, 10)}T00:00:00`),
        )
        .filter((d: Date) => !isNaN(d.getTime()))
        .sort((a: Date, b: Date) => a.getTime() - b.getTime());
    }

    if (sorted.length === 0) return;

    // Validar lunes (1) y sábado (6)
    const invalidas = sorted.filter(
      (f) => f.getDay() === 1 || f.getDay() === 6,
    );
    if (invalidas.length > 0) {
      this.toastS.showWarn(
        "Días no permitidos",
        `Las suspensiones no aplican en lunes ni sábado: ${invalidas.map((d) => d.toLocaleDateString("es-MX")).join(", ")}`,
      );
      return;
    }

    // Validar días consecutivos (cuando hay más de 1)
    if (sorted.length > 1) {
      for (let i = 0; i < sorted.length - 1; i++) {
        const diffDias = Math.round(
          (sorted[i + 1].getTime() - sorted[i].getTime()) / 86400000,
        );
        if (diffDias === 1) {
          this.toastS.showWarn(
            "Días consecutivos",
            `Los días de suspensión no pueden ser consecutivos: ${sorted[i].toLocaleDateString("es-MX")} y ${sorted[i + 1].toLocaleDateString("es-MX")}`,
          );
          return;
        }
      }
    }

    // Validar máximo 8 días total
    const totalActual = this.days().length;
    if (totalActual + sorted.length > 8) {
      this.toastS.showWarn(
        "Límite excedido",
        `No se pueden superar 8 días de suspensión. Registrados: ${totalActual}. Intentando agregar: ${sorted.length}.`,
      );
      return;
    }

    // Validar duplicados contra lo ya registrado (comparar YYYY-MM-DD como string)
    const existentesISO = this.days().map((d) =>
      String(d.suspensionDate).substring(0, 10),
    );
    const duplicadas = sorted.filter((f) =>
      existentesISO.includes(this.toYyyyMmDd(f)),
    );

    if (duplicadas.length > 0) {
      this.toastS.showWarn(
        "Fechas duplicadas",
        `Ya registradas: ${duplicadas.map((d) => d.toLocaleDateString("es-MX")).join(", ")}`,
      );
      return;
    }

    const dto: SuspensionDayAddDTO = {
      incidentId: this.incidentId(),
      suspensionDates: sorted.map((date) => this.toYyyyMmDd(date)),
      notes: this.form.controls.notes.value || undefined,
    };

    this.saving.set(true);
    this.apiResponseS
      .onPost<SuspensionDayDetailDTO[]>(
        Endpoints.HR.Incident.suspensionDays.addBulk(this.incidentId()),
        dto,
      )
      .then((result) => {
        if (result !== false) {
          this.form.reset();
          this.loadDays();
        }
      })
      .finally(() => this.saving.set(false));
  }

  deleteDay(id: string): void {
    this.apiResponseS
      .onDelete(Endpoints.HR.Incident.suspensionDays.delete(id))
      .then(() => this.loadDays());
  }
}
