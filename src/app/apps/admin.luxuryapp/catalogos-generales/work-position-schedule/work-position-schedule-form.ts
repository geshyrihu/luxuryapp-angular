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
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomInputTime } from "@ui/inputs/web/custom-input-time-signal";
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
import { WorkPositionScheduleFormGroup } from "./interfaces/work-position-schedule-form.interface";
import { WorkPositionScheduleDto } from "./interfaces/work-position-schedule.dto";

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
    CustomInputTime,
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
  cb_turnoTrabajo = signal<SelectItemDto[]>([]);
  specialShiftTypes: SelectItemDto[] = [
    { label: "Turno fijo", value: "" },
    { label: "24x24", value: "24x24" },
    { label: "12x12", value: "12x12" },
  ];
  id = "";

  form: FormGroup<WorkPositionScheduleFormGroup> = this.formB.group({
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
    turnoTrabajo: new FormControl(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    tipoTurnoEspecial: new FormControl("", {
      validators: [Validators.maxLength(50)],
      nonNullable: true,
    }),
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
    observationsWorkShift: new FormControl("", {
      validators: [Validators.maxLength(500)],
      nonNullable: true,
    }),
  });

  readonly days = [
    { label: "Lunes", entry: "lunesEntrada", exit: "lunesSalida" },
    { label: "Martes", entry: "martesEntrada", exit: "martesSalida" },
    { label: "Miercoles", entry: "miercolesEntrada", exit: "miercolesSalida" },
    { label: "Jueves", entry: "juevesEntrada", exit: "juevesSalida" },
    { label: "Viernes", entry: "viernesEntrada", exit: "viernesSalida" },
    { label: "Sabado", entry: "sabadoEntrada", exit: "sabadoSalida" },
    { label: "Domingo", entry: "domingoEntrada", exit: "domingoSalida" },
  ] as const;

  // Espejo en signal del valor de tipoTurnoEspecial: el FormControl no es un signal,
  // asi que se sincroniza via valueChanges para poder derivar isSpecialShift de forma reactiva.
  private readonly tipoTurnoEspecialValue = signal(
    this.form.controls.tipoTurnoEspecial.value,
  );
  readonly isSpecialShift = computed(() => !!this.tipoTurnoEspecialValue());

  async ngOnInit(): Promise<void> {
    this.id = this.config.data?.id ?? "";
    this.cb_turnoTrabajo.set(await lastValueFrom(this.enumSelectS.turnoTrabajo()));
    if (this.id) this.onLoadData();

    this.form.controls.tipoTurnoEspecial.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.tipoTurnoEspecialValue.set(value);

        // Turno especial y turno fijo son mutuamente excluyentes: si el usuario elige
        // un turno especial, los horarios por dia capturados previamente ya no aplican.
        if (value) {
          this.resetDayControls();
        }
      });
  }

  private resetDayControls(): void {
    for (const day of this.days) {
      this.form.get(day.entry)?.setValue(null, { emitEvent: false });
      this.form.get(day.exit)?.setValue(null, { emitEvent: false });
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
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Catalogs.WorkPositionSchedule.create,
      id: this.id || null,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  getControl(name: string): FormControl<string | null> {
    return this.form.get(name) as FormControl<string | null>;
  }

  private toFormValue(item: WorkPositionScheduleDto) {
    return {
      ...item,
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
