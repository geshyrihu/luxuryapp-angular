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
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
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
import { DiaDeTrabajoControls, DiaDeTrabajoFormGroup, WorkPositionScheduleControls, WorkPositionScheduleFormGroup } from "./interfaces/work-position-schedule-form.interface";
import { WorkPositionScheduleDto } from "./interfaces/work-position-schedule.dto";

const TIME_INPUT_FORMAT = /^([0-1]?\d|2[0-3]):[0-5]\d$/;

const requireBothOrNoneTimeValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const days = [
    ["lunesEntrada", "lunesSalida"],
    ["martesEntrada", "martesSalida"],
    ["miercolesEntrada", "miercolesSalida"],
    ["juevesEntrada", "juevesSalida"],
    ["viernesEntrada", "viernesSalida"],
    ["sabadoEntrada", "sabadoSalida"],
    ["domingoEntrada", "domingoSalida"],
  ];

  const incompleteDay = days.find(([entry, exit]) => {
    const hasEntry = !!control.get(entry)?.value;
    const hasExit = !!control.get(exit)?.value;
    return hasEntry !== hasExit;
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

  form = this.formB.group<WorkPositionScheduleControls>({
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

    // [LEGACY] Mantener hasta migrar la UI a tabs por semana.
    turnoTrabajo: new FormControl(0, { nonNullable: true }),
    lunesEntrada: new FormControl<string | null>(null),
    lunesSalida: new FormControl<string | null>(null),
    martesEntrada: new FormControl<string | null>(null),
    martesSalida: new FormControl<string | null>(null),
    miercolesEntrada: new FormControl<string | null>(null),
    miercolesSalida: new FormControl<string | null>(null),
    juevesEntrada: new FormControl<string | null>(null),
    juevesSalida: new FormControl<string | null>(null),
    viernesEntrada: new FormControl<string | null>(null),
    viernesSalida: new FormControl<string | null>(null),
    sabadoEntrada: new FormControl<string | null>(null),
    sabadoSalida: new FormControl<string | null>(null),
    domingoEntrada: new FormControl<string | null>(null),
    domingoSalida: new FormControl<string | null>(null),
    observationsWorkShift: new FormControl("", { nonNullable: true }),
  }, { validators: [requireBothOrNoneTimeValidator] });

  readonly days = [
    { label: "Lunes", dw: 1, entry: "lunesEntrada", exit: "lunesSalida" },
    { label: "Martes", dw: 2, entry: "martesEntrada", exit: "martesSalida" },
    { label: "Miercoles", dw: 3, entry: "miercolesEntrada", exit: "miercolesSalida" },
    { label: "Jueves", dw: 4, entry: "juevesEntrada", exit: "juevesSalida" },
    { label: "Viernes", dw: 5, entry: "viernesEntrada", exit: "viernesSalida" },
    { label: "Sabado", dw: 6, entry: "sabadoEntrada", exit: "sabadoSalida" },
    { label: "Domingo", dw: 0, entry: "domingoEntrada", exit: "domingoSalida" },
  ] as const;

  readonly tipoJornadaValue = signal(this.form.controls.tipoJornada.value);
  readonly duracionCicloValue = signal(this.form.controls.duracionCicloSemanas.value);
  readonly cantidadDias = computed(
    () => 7 * this.duracionCicloValue(),
  );
  readonly duracionCicloOptions: SelectItemDto[] = [
    { label: "1 semana (ciclo semanal)", value: 1 },
    { label: "2 semanas (quincenal)", value: 2 },
    { label: "3 semanas", value: 3 },
    { label: "4 semanas (mensual)", value: 4 },
  ];
  readonly timeOptions: SelectItemDto[] = Array.from({ length: 48 }, (_, i) => {
    const horas = Math.floor(i / 2).toString().padStart(2, "0");
    const minutos = i % 2 === 0 ? "00" : "30";
    const valor = `${horas}:${minutos}`;
    return { label: valor, value: valor };
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data?.id ?? "";
    this.cb_tipoJornada.set(await lastValueFrom(this.enumSelectS.tipoJornada()));
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
    // La UI sigue capturando solo los 14 inputs de la semana 1, asi que materializamos
    // N semanas x 7 dias en NumeroSemanaCiclo=1..N clonando los valores de la semana 1.
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

  onLoadData() {
    this.apiResponseS
      .onGetItem<WorkPositionScheduleDto>(
        Endpoints.Catalogs.WorkPositionSchedule.getById(this.id),
      )
      .then((result) => {
        if (result) this.form.patchValue(this.toFormValue(result));
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Antes de mandar al backend, proyectamos los 14 inputs legacy a diasDeTrabajo
    // (semana 1) cuando aplica, conservando los inputs que el usuario vio en pantalla.
    this.proyectarInputsADias();

    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Catalogs.WorkPositionSchedule.create,
      id: this.id || null,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  private proyectarInputsADias(): void {
    const map: Record<number, { entry: string; exit: string }> = {
      1: { entry: "lunesEntrada", exit: "lunesSalida" },
      2: { entry: "martesEntrada", exit: "martesSalida" },
      3: { entry: "miercolesEntrada", exit: "miercolesSalida" },
      4: { entry: "juevesEntrada", exit: "juevesSalida" },
      5: { entry: "viernesEntrada", exit: "viernesSalida" },
      6: { entry: "sabadoEntrada", exit: "sabadoSalida" },
      0: { entry: "domingoEntrada", exit: "domingoSalida" },
    };

    const dias = this.form.controls.diasDeTrabajo;
    for (let i = 0; i < dias.length; i++) {
      const grupo = dias.at(i);
      const dw = grupo.controls.diaSemana.value;
      const semana = grupo.controls.numeroSemanaCiclo.value;
      // Solo semana 1 viene de los inputs del usuario; semanas 2..N se duplican.
      if (semana !== 1) {
        const semana1 = this.findDia(1, dw);
        if (semana1) {
          grupo.controls.horaEntrada.setValue(semana1.controls.horaEntrada.value, { emitEvent: false });
          grupo.controls.horaSalida.setValue(semana1.controls.horaSalida.value, { emitEvent: false });
          grupo.controls.esDescanso.setValue(semana1.controls.esDescanso.value, { emitEvent: false });
        }
        continue;
      }
      const refs = map[dw];
      if (!refs) continue;
      const entrada = this.form.get(refs.entry)?.value ?? null;
      const salida = this.form.get(refs.exit)?.value ?? null;
      const esDescanso = !entrada && !salida;
      grupo.controls.horaEntrada.setValue(this.normalizeTime(entrada), { emitEvent: false });
      grupo.controls.horaSalida.setValue(this.normalizeTime(salida), { emitEvent: false });
      grupo.controls.esDescanso.setValue(esDescanso, { emitEvent: false });
    }
  }

  private findDia(semana: number, dw: number) {
    return this.form.controls.diasDeTrabajo.controls.find(
      (g) => g.controls.numeroSemanaCiclo.value === semana && g.controls.diaSemana.value === dw,
    );
  }

  private normalizeTime(value: string | null): string | null {
    if (!value) return null;
    if (TIME_INPUT_FORMAT.test(value)) return value + ":00";
    return value;
  }

  getControl(name: string): FormControl<string | null> {
    return this.form.get(name) as FormControl<string | null>;
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
    const labelAnterior = this.days.find(d => d.dw === dwAnterior);
    const labelActual = this.days.find(d => d.dw === dwActual);
    if (!labelAnterior || !labelActual) return;
    const entrada = this.form.get(labelAnterior.entry)?.value ?? null;
    const salida = this.form.get(labelAnterior.exit)?.value ?? null;
    this.form.get(labelActual.entry)?.setValue(entrada);
    this.form.get(labelActual.exit)?.setValue(salida);
  }

  private toFormValue(item: WorkPositionScheduleDto) {
    return {
      ...item,
      tipoJornada: item.tipoJornada ?? 1,
      duracionCicloSemanas: item.duracionCicloSemanas ?? 1,
      observaciones: item.observaciones ?? "",
      diasDeTrabajo: [],
      lunesEntrada: this.toTimeInput(item.lunesEntrada),
      lunesSalida: this.toTimeInput(item.lunesSalida),
      martesEntrada: this.toTimeInput(item.martesEntrada),
      martesSalida: this.toTimeInput(item.martesSalida),
      miercolesEntrada: this.toTimeInput(item.miercolesEntrada),
      miercolesSalida: this.toTimeInput(item.miercolesSalida),
      juevesEntrada: this.toTimeInput(item.juevesEntrada),
      juevesSalida: this.toTimeInput(item.juevesSalida),
      viernesEntrada: this.toTimeInput(item.viernesEntrada),
      viernesSalida: this.toTimeInput(item.viernesSalida),
      sabadoEntrada: this.toTimeInput(item.sabadoEntrada),
      sabadoSalida: this.toTimeInput(item.sabadoSalida),
      domingoEntrada: this.toTimeInput(item.domingoEntrada),
      domingoSalida: this.toTimeInput(item.domingoSalida),
    };
  }

  private toTimeInput(value: string | null): string | null {
    if (!value) return null;
    return value.slice(0, 5);
  }
}
