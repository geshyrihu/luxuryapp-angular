import {
  ChangeDetectionStrategy,
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

  const week1 = diasArray.controls.filter(
    (g) => g.get("numeroSemanaCiclo")?.value === 1,
  );

  const incompleteDay = week1.find((g) => {
    const entry = g.get("horaEntrada")?.value;
    const exit = g.get("horaSalida")?.value;
    return !!entry !== !!exit;
  });

  return incompleteDay ? { incompleteWorkDay: true } : null;
};

@Component({
  selector: "app-work-position-schedule-form",
  templateUrl: "./work-position-schedule-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputSwitch,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class WorkPositionScheduleForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private enumSelectS = inject(EnumSelectService);
  private destroyRef = inject(DestroyRef);

  submitting = signal(false);
  cb_tipoJornada = signal<SelectItemDto[]>([]);
  id = "";

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
      diasDeTrabajo: this.formB.array<DiaDeTrabajoFormGroup>([]),
    },
    { validators: [requireBothOrNoneTimeValidator] },
  );

  readonly days = [
    { label: "Lunes", dw: 1 },
    { label: "Martes", dw: 2 },
    { label: "Miércoles", dw: 3 },
    { label: "Jueves", dw: 4 },
    { label: "Viernes", dw: 5 },
    { label: "Sábado", dw: 6 },
    { label: "Domingo", dw: 0 },
  ] as const;

  readonly weekDays = computed(() => {
    const dias = this.form.controls.diasDeTrabajo;
    return this.days.map((day) => {
      const ctrl = dias.controls.find(
        (g) =>
          g.controls.numeroSemanaCiclo.value === 1 &&
          g.controls.diaSemana.value === day.dw,
      );
      return {
        ...day,
        entry: ctrl?.get("horaEntrada") ?? null,
        exit: ctrl?.get("horaSalida") ?? null,
      };
    });
  });

  readonly tipoJornadaValue = signal(this.form.controls.tipoJornada.value);
  readonly duracionCicloValue = signal(
    this.form.controls.duracionCicloSemanas.value,
  );
  readonly cantidadDias = computed(() => 7 * this.duracionCicloValue());
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
    this.sincronizarDiasDeTrabajo();
    if (this.id) this.onLoadData();

    this.form.controls.tipoJornada.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        this.tipoJornadaValue.set(v);
        this.sincronizarDiasDeTrabajo();
      });

    this.form.controls.duracionCicloSemanas.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        this.duracionCicloValue.set(v);
        this.sincronizarDiasDeTrabajo();
      });
  }

  private sincronizarDiasDeTrabajo(): void {
    // El backend exige 7 x DuracionCicloSemanas filas para cualquier TipoJornada.
    // La UI captura solo la semana 1; materializamos N semanas x 7 dias en
    // NumeroSemanaCiclo=1..N clonando los valores de la semana 1 al enviar.
    const semanas = this.duracionCicloValue();

    const total = 7 * semanas;
    const current = this.form.controls.diasDeTrabajo;

    if (current.length !== total) {
      current.clear({ emitEvent: false });
      for (let s = 1; s <= semanas; s++) {
        for (const day of this.days) {
          current.push(
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
    }
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

    this.proyectarSemanas();

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
        ctrl.patchValue(dia);
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

  /**
   * Copia las horas de entrada/salida del dia anterior al dia actual.
   * Caso de uso: horarios uniformes (Lun-Vie 9-18, Sab-Dom descanso).
   * Solo aplica a la semana 1 (la UI no muestra semanas adicionales).
   */
  copiarDelDiaAnterior(dwActual: number): void {
    const orden = [0, 1, 2, 3, 4, 5, 6];
    const idx = orden.indexOf(dwActual);
    if (idx <= 0) return;
    const dwAnterior = orden[idx - 1];

    const diaAnterior = this.findDia(1, dwAnterior);
    const diaActual = this.findDia(1, dwActual);
    if (!diaAnterior || !diaActual) return;

    const entrada = diaAnterior.get("horaEntrada")?.value ?? null;
    const salida = diaAnterior.get("horaSalida")?.value ?? null;
    diaActual.get("horaEntrada")?.setValue(entrada, { emitEvent: false });
    diaActual.get("horaSalida")?.setValue(salida, { emitEvent: false });
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
