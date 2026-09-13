import {
  ChangeDetectorRef,
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
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
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

const requireBothOrNoneTimeValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const diasArray = group.get("diasDeTrabajo") as FormArray;
  if (!diasArray) return null;

  const incompleteDay = diasArray.controls.find((g) => {
    const esDescanso = g.get("esDescanso")?.value;
    if (esDescanso) return false;
    const entry = g.get("horaEntrada")?.value;
    const exit = g.get("horaSalida")?.value;
    return !!entry !== !!exit;
  });

  return incompleteDay ? { incompleteWorkDay: true } : null;
};

@Component({
  selector: "app-work-position-schedule-form",
  templateUrl: "./work-position-schedule-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputSwitch,
    CustomInputSelectSignal,
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
    { label: "Lunes", dw: 1 },
    { label: "Martes", dw: 2 },
    { label: "Miércoles", dw: 3 },
    { label: "Jueves", dw: 4 },
    { label: "Viernes", dw: 5 },
    { label: "Sábado", dw: 6 },
    { label: "Domingo", dw: 0 },
  ] as const;

  private buildDiasDeTrabajo(): DiaDeTrabajoFormGroup[] {
    const dias: DiaDeTrabajoFormGroup[] = [];
    // Siempre 4 semanas (28 días) para permitir configurar todas
    for (let s = 1; s <= 4; s++) {
      for (const day of this.days) {
        dias.push(
          this.formB.group<DiaDeTrabajoControls>({
            diaSemana: this.formB.nonNullable.control(day.dw),
            numeroSemanaCiclo: this.formB.nonNullable.control(s),
            horaEntrada: this.formB.control<string | null>(null),
            horaSalida: this.formB.control<string | null>(null),
            esDescanso: this.formB.nonNullable.control(false),
          }),
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
      description: new FormControl("", {
        validators: [Validators.maxLength(250)],
        nonNullable: true,
      }),
      isActive: new FormControl(true, { nonNullable: true }),

      tipoJornada: new FormControl(1, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      duracionCicloSemanas: new FormControl(1, {
        validators: [Validators.required, Validators.min(1), Validators.max(4)],
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
    { validators: [requireBothOrNoneTimeValidator] },
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
          entry: ctrl?.get("horaEntrada") ?? null,
          exit: ctrl?.get("horaSalida") ?? null,
          rest: ctrl?.get("esDescanso") ?? null,
        };
      });
    });
    return semanas;
  });

  readonly tipoJornadaValue = signal(this.form.controls.tipoJornada.value);
  readonly duracionCicloValue = signal(
    this.form.controls.duracionCicloSemanas.value,
  );
  readonly duracionCicloOptions: SelectItemDto[] = [
    { label: "1 semana (ciclo semanal)", value: 1 },
    { label: "2 semanas (quincenal)", value: 2 },
    { label: "3 semanas", value: 3 },
    { label: "4 semanas (mensual)", value: 4 },
  ];
  readonly timeOptions: SelectItemDto[] = Array.from({ length: 48 }, (_, i) => {
    const horas = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minutos = i % 2 === 0 ? "00" : "30";
    const valor = `${horas}:${minutos}`;
    return { label: valor, value: valor };
  });

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

    this.form.controls.duracionCicloSemanas.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        this.duracionCicloValue.set(v);
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
    this.duracionCicloValue.set(this.form.controls.duracionCicloSemanas.value);
    this.proyectarSemanas();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    // Filtrar solo los días del ciclo seleccionado
    const cicloSeleccionado = this.duracionCicloValue();
    payload.diasDeTrabajo = payload.diasDeTrabajo?.filter(
      (d: DiaDeTrabajoDto) => d.numeroSemanaCiclo <= cicloSeleccionado,
    ) ?? [];

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

  private proyectarSemanas(): void {
    const semanas = this.duracionCicloValue();
    if (semanas <= 1) return;

    for (let s = 2; s <= semanas; s++) {
      for (const day of this.days) {
        const semana1 = this.findDia(1, day.dw);
        const target = this.findDia(s, day.dw);
        if (!semana1 || !target) continue;
        target.controls.horaEntrada.setValue(semana1.controls.horaEntrada.value, { emitEvent: false });
        target.controls.horaSalida.setValue(semana1.controls.horaSalida.value, { emitEvent: false });
        target.controls.esDescanso.setValue(semana1.controls.esDescanso.value, { emitEvent: false });
      }
    }
  }

  private findDia(semana: number, dw: number) {
    return this.form.controls.diasDeTrabajo.controls.find(
      (g) =>
        g.controls.numeroSemanaCiclo.value === semana &&
        g.controls.diaSemana.value === dw,
    );
  }

  /** Copia Semana 1 a una semana específica (2-4) */
  copiarSemana1A(semanaDestino: number): void {
    if (semanaDestino < 2 || semanaDestino > 4) return;
    for (const day of this.days) {
      const origen = this.findDia(1, day.dw);
      const destino = this.findDia(semanaDestino, day.dw);
      if (!origen || !destino) continue;
      destino.controls.horaEntrada.setValue(origen.controls.horaEntrada.value, { emitEvent: false });
      destino.controls.horaSalida.setValue(origen.controls.horaSalida.value, { emitEvent: false });
      destino.controls.esDescanso.setValue(origen.controls.esDescanso.value, { emitEvent: false });
    }
    this.cdr.markForCheck();
  }

  /** Limpia semanas 2-4 poniendo todo en descanso */
  limpiarSemanasPosteriores(): void {
    for (let s = 2; s <= 4; s++) {
      for (const day of this.days) {
        const dia = this.findDia(s, day.dw);
        if (!dia) continue;
        dia.controls.horaEntrada.setValue(null, { emitEvent: false });
        dia.controls.horaSalida.setValue(null, { emitEvent: false });
        dia.controls.esDescanso.setValue(true, { emitEvent: false });
        dia.controls.horaEntrada.disable({ emitEvent: false });
        dia.controls.horaSalida.disable({ emitEvent: false });
      }
    }
    this.form.updateValueAndValidity();
    this.cdr.markForCheck();
  }

  /** Copia del día anterior dentro de la misma semana */
  copiarDelDiaAnteriorEnSemana(semana: number, dwActual: number): void {
    const orden = [0, 1, 2, 3, 4, 5, 6];
    const idx = orden.indexOf(dwActual);
    if (idx <= 0) return;
    const dwAnterior = orden[idx - 1];

    const diaAnterior = this.findDia(semana, dwAnterior);
    const diaActual = this.findDia(semana, dwActual);
    if (!diaAnterior || !diaActual) return;

    const entrada = diaAnterior.get("horaEntrada")?.value ?? null;
    const salida = diaAnterior.get("horaSalida")?.value ?? null;
    diaActual.get("horaEntrada")?.setValue(entrada);
    diaActual.get("horaSalida")?.setValue(salida);
    this.cdr.markForCheck();
  }

  /**
   * Copia las horas de entrada/salida del dia anterior al dia actual.
   * Caso de uso: horarios uniformes (Lun-Vie 9-18, Sab-Dom descanso).
   * Solo aplica a la semana 1.
   */
  copiarDelDiaAnterior(dwActual: number): void {
    this.copiarDelDiaAnteriorEnSemana(1, dwActual);
  }

  onRestChange(semana: number, dw: number, isRest: boolean): void {
    const dia = this.findDia(semana, dw);
    if (!dia) return;

    if (isRest) {
      dia.controls.horaEntrada.setValue(null, { emitEvent: false });
      dia.controls.horaSalida.setValue(null, { emitEvent: false });
      dia.controls.horaEntrada.disable({ emitEvent: false });
      dia.controls.horaSalida.disable({ emitEvent: false });
    } else {
      dia.controls.horaEntrada.enable({ emitEvent: false });
      dia.controls.horaSalida.enable({ emitEvent: false });
    }
    this.form.updateValueAndValidity();
  }

  private toFormValue(item: WorkPositionScheduleDto) {
    return {
      ...item,
      tipoJornada: item.tipoJornada ?? 1,
      duracionCicloSemanas: item.duracionCicloSemanas ?? 1,
      observaciones: item.observaciones ?? "",
    };
  }
}
