import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { WebInputToggleSwitch } from "@ui/inputs/web/input-toggle-switch/input-toggle-switch";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { lastValueFrom } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import {
  DiaDeTrabajoControls,
  DiaDeTrabajoFormGroup,
  WorkPositionScheduleControls,
} from "./interfaces/work-position-schedule-form.interface";
import {
  DiaDeTrabajoDto,
  WorkPositionScheduleDto,
} from "./interfaces/work-position-schedule.dto";

const formCompleteValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const diasArray = group.get("diasDeTrabajo") as FormArray;
  if (!diasArray) return null;

  const incompleteDay = diasArray.controls.find((g) => g.hasError("missingBothHours"));
  if (incompleteDay) return { incompleteWorkDay: true };

  const invalidOrderDay = diasArray.controls.find((g) => g.hasError("invalidTimeOrder"));
  if (invalidOrderDay) return { invalidTimeOrder: true };

  return null;
};

const dayTimeValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const entry = control.get("horaEntrada")?.value;
  const exit = control.get("horaSalida")?.value;
  const isRest = control.get("esDescanso")?.value;

  if (isRest) return null;

  if (!entry && !exit) return { missingBothHours: true };

  if (entry && exit) {
    if (entry === exit) {
      return { invalidTimeOrder: true };
    }
  }

  return null;
};

@Component({
  selector: "app-work-position-schedule-form",
  templateUrl: "./work-position-schedule-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    WebInputToggleSwitch,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    WebButtonIcon,
  ],
})
export class WorkPositionScheduleForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private enumSelectS = inject(EnumSelectService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  submitting = signal(false);
  cb_tipoJornada = signal<SelectItemDto[]>([]);
  id = "";

  readonly days = [
    { label: "LUNES", dw: 1 },
    { label: "MARTES", dw: 2 },
    { label: "MIÉRCOLES", dw: 3 },
    { label: "JUEVES", dw: 4 },
    { label: "VIERNES", dw: 5 },
    { label: "SÁBADO", dw: 6 },
    { label: "DOMINGO", dw: 0 },
  ] as const;

  private buildDiasDeTrabajo(): DiaDeTrabajoFormGroup[] {
    const dias: DiaDeTrabajoFormGroup[] = [];
    // Siempre 4 semanas (28 días) fijas
    for (let s = 1; s <= 4; s++) {
      for (const day of this.days) {
        dias.push(
          this.formB.group<DiaDeTrabajoControls>(
            {
              diaSemana: this.formB.nonNullable.control(day.dw),
              numeroSemanaCiclo: this.formB.nonNullable.control(s),
              horaEntrada: this.formB.control<string | null>(null),
              horaSalida: this.formB.control<string | null>(null),
              esDescanso: this.formB.nonNullable.control(false),
            },
            { validators: [dayTimeValidator] },
          ),
        );
      }
    }
    return dias;
  }

  form = this.formB.group<WorkPositionScheduleControls>(
    {
      id: new FormControl<string | null>({ value: "", disabled: true }),
      name: new FormControl("", {
        validators: [Validators.required, Validators.maxLength(100)],
        nonNullable: true,
      }),
      isActive: new FormControl(true, { nonNullable: true }),

      tipoJornada: new FormControl(1, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      observaciones: new FormControl("", {
        validators: [Validators.maxLength(500)],
        nonNullable: true,
      }),
      diasDeTrabajo: this.formB.array<DiaDeTrabajoFormGroup>(
        this.buildDiasDeTrabajo(),
      ),
    },
    { validators: [formCompleteValidator] },
  );

  readonly weekDays = computed(() => {
    const dias = this.form.controls.diasDeTrabajo;
    if (!dias || dias.length === 0) return [];

    // Agrupar por semana: retorna array de 4 semanas, cada una con 7 días
    const semanas = [1, 2, 3, 4].map((semana) => {
      return this.days.map((day) => {
        const ctrl = dias.controls.find(
          (g) =>
            g.controls.numeroSemanaCiclo.value === semana &&
            g.controls.diaSemana.value === day.dw,
        );
        return {
          ...day,
          semana,
          uniqueKey: `s${semana}d${day.dw}`, // clave única para tracking
          entry: ctrl?.get("horaEntrada") ?? null,
          exit: ctrl?.get("horaSalida") ?? null,
          rest: ctrl?.get("esDescanso") ?? null,
        };
      });
    });
    return semanas;
  });

  formValue = toSignal(this.form.valueChanges);

  readonly weeklyHours = computed(() => {
    this.formValue(); // track changes
    const semanas = this.weekDays();
    const hoursPerWeek: Record<number, number> = {};

    for (const week of semanas) {
      if (week.length === 0) continue;
      const weekNum = week[0].semana;
      let totalMinutes = 0;

      for (const day of week) {
        if (day.rest?.value) continue;

        const entryStr = day.entry?.value;
        const exitStr = day.exit?.value;

        let entryMinutes = 0;
        let exitMinutes = 0;

        if (entryStr) {
          const [h, m] = entryStr.split(':').map(Number);
          entryMinutes = h * 60 + m;
        }
        
        if (exitStr) {
          const [h, m] = exitStr.split(':').map(Number);
          exitMinutes = h * 60 + m;
        }

        if (entryStr && exitStr) {
          if (exitMinutes > entryMinutes) {
            totalMinutes += (exitMinutes - entryMinutes);
          } else if (exitMinutes < entryMinutes) {
            const minutosHastaMedianoche = (24 * 60) - entryMinutes;
            totalMinutes += minutosHastaMedianoche + exitMinutes;
          }
        } else if (entryStr && !exitStr) {
          totalMinutes += ((24 * 60) - entryMinutes);
        } else if (!entryStr && exitStr) {
          totalMinutes += (exitMinutes - 0);
        }
      }

      hoursPerWeek[weekNum] = Number((totalMinutes / 60).toFixed(2));
    }

    return hoursPerWeek;
  });

  readonly tipoJornadaValue = signal(this.form.controls.tipoJornada.value);
  readonly timeOptions: SelectItemDto[] = Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2);
    const horas24 = h.toString().padStart(2, "0");
    const minutos = i % 2 === 0 ? "00" : "30";
    const valor = `${horas24}:${minutos}`;

    const h12 = h === 0 ? 12 : (h > 12 ? h - 12 : h);
    const ampm = h < 12 ? 'AM' : 'PM';
    const label = `${h12.toString().padStart(2, "0")}:${minutos} ${ampm}`;

    return { label, value: valor };
  });

  // Días con error de orden de tiempo (entrada >= salida)
  readonly invalidTimeOrderDays = computed(() => {
    const dias = this.form.controls.diasDeTrabajo;
    if (!dias) return [];

    const invalid: { semana: number; dw: number }[] = [];
    for (let s = 1; s <= 4; s++) {
      for (const day of this.days) {
        const ctrl = dias.controls.find(
          (g) =>
            g.controls.numeroSemanaCiclo.value === s &&
            g.controls.diaSemana.value === day.dw,
        );
        if (ctrl?.hasError("invalidTimeOrder")) {
          invalid.push({ semana: s, dw: day.dw });
        }
      }
    }
    return invalid;
  });

  /** Verifica si un campo específico debe mostrar borde rojo:
   * - Si el día tiene error invalidTimeOrder (entrada >= salida) → AMBOS campos en rojo
   * - Si NO es día de descanso Y este campo específico está vacío → rojo solo en ese campo
   */
  isFieldRed(semana: number, dw: number, field: 'entrada' | 'salida'): boolean {
    const dia = this.findDia(semana, dw);
    if (!dia) return false;

    if (dia.hasError("invalidTimeOrder")) return true;
    if (dia.hasError("missingBothHours")) return true;

    return false;
  }

  async ngOnInit(): Promise<void> {
    this.id = this.config.data?.id ?? "";
    this.cb_tipoJornada.set(
      await lastValueFrom(this.enumSelectS.tipoJornada()),
    );
    if (this.id) this.onLoadData();

    this.form.controls.tipoJornada.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        this.tipoJornadaValue.set(v);
      });
  }

  private onLoadData() {
    this.apiResponseS
      .onGetItem<WorkPositionScheduleDto>(
        Endpoints.Catalogs.WorkPositionSchedule.getById(this.id),
      )
      .then((result) => {
        if (result) {
          this.form.patchValue(this.toFormValue(result));
          this.loadDiasDeTrabajo(result.diasDeTrabajo ?? []);
        }
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    // Enviar todos los 28 días (4 semanas fijas)
    // No filtrar por ciclo ya que ahora es fijo 4 semanas

    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Catalogs.WorkPositionSchedule.create,
      id: this.id || null,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  private loadDiasDeTrabajo(dias: DiaDeTrabajoDto[]): void {
    const diasArray = this.form.controls.diasDeTrabajo;
    for (const dia of dias) {
      const ctrl = diasArray.controls.find(
        (g) =>
          g.controls.numeroSemanaCiclo.value === dia.numeroSemanaCiclo &&
          g.controls.diaSemana.value === dia.diaSemana,
      );
      if (ctrl) {
        ctrl.patchValue({
          ...dia,
          horaEntrada: dia.horaEntrada?.slice(0, 5) ?? null,
          horaSalida: dia.horaSalida?.slice(0, 5) ?? null,
        });
      }
    }
  }

  private _restChangeGuard = false;

  onRestChange(semana: number, dw: number, isRest: boolean): void {
    if (this._restChangeGuard) return;
    this._restChangeGuard = true;
    try {
      const dia = this.findDia(semana, dw);
      if (!dia) return;

      if (isRest) {
        dia.controls.horaEntrada.clearValidators();
        dia.controls.horaSalida.clearValidators();
        dia.controls.horaEntrada.setValue(null);
        dia.controls.horaSalida.setValue(null);
        dia.controls.horaEntrada.disable();
        dia.controls.horaSalida.disable();
      } else {
        dia.controls.horaEntrada.clearValidators();
        dia.controls.horaSalida.clearValidators();
        dia.controls.horaEntrada.enable();
        dia.controls.horaSalida.enable();
      }
      dia.controls.horaEntrada.updateValueAndValidity();
      dia.controls.horaSalida.updateValueAndValidity();
      this.form.updateValueAndValidity();
    } finally {
      this._restChangeGuard = false;
    }
  }

  findDia(semana: number, dw: number) {
    return this.form.controls.diasDeTrabajo.controls.find(
      (g) =>
        g.controls.numeroSemanaCiclo.value === semana &&
        g.controls.diaSemana.value === dw,
    );
  }

  /** Obtiene el label del día para mostrar en alertas */
  getDayLabel(dw: number): string {
    return this.days.find(d => d.dw === dw)?.label ?? `Día ${dw}`;
  }

  /** Copia del día anterior en la misma semana (Lunes=1..Domingo=0) */
  copiarDelDiaAnterior(semana: number, dwActual: number): void {
    const orden = [1, 2, 3, 4, 5, 6, 0]; // Lunes a Domingo
    const idx = orden.indexOf(dwActual);
    if (idx <= 0) return;
    const dwAnterior = orden[idx - 1];

    const origen = this.findDia(semana, dwAnterior);
    const destino = this.findDia(semana, dwActual);
    if (!origen || !destino) return;

    destino.controls.horaEntrada.setValue(origen.controls.horaEntrada.value);
    destino.controls.horaSalida.setValue(origen.controls.horaSalida.value);
    destino.controls.esDescanso.setValue(origen.controls.esDescanso.value);
    this.cdr.markForCheck();
  }

  /** Copia los 7 días de la semana anterior a la semana actual */
  copiarDeSemanaAnterior(semanaDestino: number): void {
    if (semanaDestino < 2 || semanaDestino > 4) return;
    const semanaOrigen = semanaDestino - 1;

    for (const day of this.days) {
      const origen = this.findDia(semanaOrigen, day.dw);
      const destino = this.findDia(semanaDestino, day.dw);
      if (!origen || !destino) continue;

      destino.controls.horaEntrada.setValue(origen.controls.horaEntrada.value);
      destino.controls.horaSalida.setValue(origen.controls.horaSalida.value);
      destino.controls.esDescanso.setValue(origen.controls.esDescanso.value);
    }
    this.cdr.markForCheck();
  }

  private toFormValue(item: WorkPositionScheduleDto) {
    return {
      ...item,
      tipoJornada: item.tipoJornada ?? 1,
      observaciones: item.observaciones ?? "",
    };
  }
}
