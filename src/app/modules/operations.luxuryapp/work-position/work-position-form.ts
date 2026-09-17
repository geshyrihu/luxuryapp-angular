import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";

import { LxMessage } from "@ui/adaptive/message/message";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { EnumSelectService } from "@core/services/enum-select.service";
import type { WorkDayForm, WorkPositionScheduleForm } from "../../recruitment.luxuryapp/work-positions/models/work-position-schedule-form.model";
import type { WorkPositionScheduleDto } from "../../recruitment.luxuryapp/work-positions/models/work-position-schedule-dto.model";
import { WorkPositionService } from "../../recruitment.luxuryapp/work-positions/interfaces/work-position.service";

type WorkDayControls = {
  id: FormControl<string>;
  diaSemana: FormControl<number>;
  numeroSemanaCiclo: FormControl<number>;
  horaEntrada: FormControl<string | null>;
  horaSalida: FormControl<string | null>;
  esDescanso: FormControl<boolean>;
};
type WorkDayGroup = FormGroup<WorkDayControls>;

const workDayValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control.get("esDescanso")?.value) return null;
  const entry = control.get("horaEntrada")?.value as string | null;
  const exit = control.get("horaSalida")?.value as string | null;
  if (!entry || !exit) return { missingBothHours: true };
  if (entry === exit) return { invalidTimeOrder: true };
  return null;
};

const scheduleValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const days = control.get("diasDeTrabajo") as FormArray<WorkDayGroup> | null;
  return days?.controls.some((day) => day.invalid) ? { incompleteWorkDay: true } : null;
};

@Component({
  selector: "app-work-position-form",
  templateUrl: "./work-position-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    .schedule-week { overflow-x: auto; }
    .schedule-week-days { display: grid; grid-template-columns: repeat(7, minmax(118px, 1fr)); gap: .35rem; min-width: 826px; }
    .schedule-day { min-width: 0; padding: .35rem !important; }
    .schedule-day-header { min-height: 1.3rem; font-size: .72rem; }
    .schedule-day-header strong { font-size: .75rem; }
    .schedule-day-header label { font-size: .65rem; white-space: nowrap; }
    .schedule-day-hours { display: grid; grid-template-columns: 1fr 1fr; gap: .25rem; }
    .schedule-day-hours label { font-size: .65rem; }
    .schedule-day-hours input { min-width: 0; padding: .2rem .25rem; font-size: .72rem; }
    .schedule-day-copy { font-size: .62rem; white-space: nowrap; }
    .schedule-week-header { font-size: .78rem; }
  `],
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    InputAutocomplete,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    LxMessage,
  ],
})
export class WorkPositionForm implements OnInit {
  // --- INYECCIóN DE DEPENDENCIAS ---
  readonly apiS = inject(ApiResponseService);
  private fb = inject(FormBuilder);
  public authS = inject(AuthService);
  public aspRoleS = inject(AspRoleService);
  private config = inject(DynamicDialogConfig);
  private customerIdS = inject(CustomerIdService);
  private ref = inject(DynamicDialogRef);
  private enumSelectS = inject(EnumSelectService);
  private workPositionService = inject(WorkPositionService);

  // --- SIGNALS Y PROPIEDADES ---
  submitting = signal(false);
  id = signal<string | null>(null);

  cb_applicationRole = signal<SelectItemDto[]>([]);
  cb_employee = signal<SelectItemDto[]>([]);
  cb_state = signal<SelectItemDto[]>([]);
  scheduleLoaded = signal(false);
  scheduleSaving = signal(false);
  scheduleError = signal<string | null>(null);

  readonly days = [
    { label: "LUNES", dw: 1 }, { label: "MARTES", dw: 2 }, { label: "MIÉRCOLES", dw: 3 },
    { label: "JUEVES", dw: 4 }, { label: "VIERNES", dw: 5 }, { label: "SÁBADO", dw: 6 }, { label: "DOMINGO", dw: 0 },
  ] as const;

  readonly AspRole = ApplicationRole;
  readonly canEditCurrentSalary = computed(() =>
    this.aspRoleS.hasAny([ApplicationRole.RecursosHumanos, ApplicationRole.SuperUsuario]),
  );
  readonly scheduleForm = this.fb.group({
    id: this.fb.control(""),
    name: this.fb.control("Horario del puesto", [Validators.required, Validators.maxLength(100)]),
    isActive: this.fb.control(true),
    tipoJornada: this.fb.control(1, Validators.required),
    observaciones: this.fb.control("", Validators.maxLength(500)),
    diasDeTrabajo: this.fb.array<WorkDayGroup>(this.buildWorkDays()),
  }, { validators: scheduleValidator });

  readonly weeklyHours = computed(() => {
    const result: Record<number, number> = {};
    for (const week of [1, 2, 3, 4]) {
      let minutes = 0;
      for (const day of this.workDays.controls.filter((item) => item.controls.numeroSemanaCiclo.value === week)) {
        if (day.controls.esDescanso.value || !day.controls.horaEntrada.value || !day.controls.horaSalida.value) continue;
        const [eh, em] = day.controls.horaEntrada.value.split(":").map(Number);
        const [sh, sm] = day.controls.horaSalida.value.split(":").map(Number);
        let difference = sh * 60 + sm - (eh * 60 + em);
        if (difference < 0) difference += 24 * 60;
        minutes += difference;
      }
      result[week] = Number((minutes / 60).toFixed(2));
    }
    return result;
  });

  // --- FORMULARIO REACTIVO ---
  // Se define sin el genórico explicito en .group para que FormBuilder
  // maneje correctamente el array [value, validators] en modo strict.
  form = this.fb.nonNullable.group({
    id: [""],
    customerId: [this.customerIdS.customerId()],
    folio: [""],
    applicationRoleId: ["", Validators.required],
    applicationRoleName: [null as string | null],
    sueldo: [0.0],
    sueldoBase: [0.0, [Validators.required, Validators.min(0)]],
    state: [true as boolean | null, Validators.required],
    employeeId: [null as string | null],
    employeeName: [null as string | null],
    jobDescriptionId: [null as string | null],
    benefits: [""],
  });

  async ngOnInit(): Promise<void> {
    const id = this.config.data?.id;
    if (id) this.id.set(id);

    await this.onLoadSelectItems();

    if (this.id()) {
      await this.onLoadData();
      await this.loadSchedule();
    } else {
      this.scheduleLoaded.set(true);
    }
  }

  async onLoadSelectItems(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const [state, applicationRoles, employees] =
      await Promise.all([
        lastValueFrom(this.enumSelectS.state()),
        this.apiS.onGetSelectItem<SelectItemDto[]>(
          Endpoints.SelectItems.applicationRolesToAdministrator,
        ),
        this.apiS.onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.employeesByCustomer(customerId)),
      ]);

    this.cb_state.set(state);
    this.cb_applicationRole.set(applicationRoles ?? []);
    this.cb_employee.set(employees ?? []);
  }

  async onLoadData(): Promise<void> {
    const result = await this.apiS.onGetItem<any>(
      Endpoints.WorkPositions.forEdit(this.id()),
    );

    if (result) {
      this.form.patchValue(result);

      // Asegurar que los nombres se carguen si no vienen del backend
      if (!this.form.value.applicationRoleName && result.applicationRoleId) {
        const role = this.cb_applicationRole().find(
          (i) => i.value === result.applicationRoleId,
        );
        if (role) this.form.patchValue({ applicationRoleName: role.label });
      }
      if (!this.form.value.employeeName && result.employeeId) {
        const emp = this.cb_employee().find(
          (i) => i.value === result.employeeId,
        );
        if (emp) this.form.patchValue({ employeeName: emp.label });
      }
    }
  }

  async loadSchedule(): Promise<void> {
    try {
      const response = await firstValueFrom(this.workPositionService.getSchedule(this.id()!));
      this.scheduleLoaded.set(true);
      if (response.data) this.patchSchedule(response.data);
    } catch {
      this.scheduleError.set("No se pudo cargar el horario del puesto.");
      this.scheduleLoaded.set(true);
    }
  }

  saveEmployee = (item: SelectItemDto) => {
    this.form.patchValue({
      employeeId: item?.value || null,
      employeeName: item?.label || null,
    });
  };

  saveApplicationRole = (item: SelectItemDto) => {
    this.form.patchValue({
      applicationRoleId: item?.value || "",
      applicationRoleName: item?.label || null,
    });
  };

  async onSubmit(): Promise<void> {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: Endpoints.WorkPositions.base,
      id: this.id(),
      ref: this.ref,
      submitting: this.submitting,
      closeOnSuccess: false,
    });
    if (result === false) return;
    if (!this.id() && result?.id) this.id.set(result.id);
    if (!this.id()) return;
    this.scheduleSaving.set(true);
    try {
      await firstValueFrom(this.workPositionService.updateSchedule(this.id()!, this.scheduleForm.getRawValue() as WorkPositionScheduleForm));
      this.ref.close(true);
    } catch {
      this.scheduleError.set("El puesto se guardó, pero no se pudo actualizar su horario.");
    } finally {
      this.scheduleSaving.set(false);
      this.submitting.set(false);
    }
  }

  get workDays(): FormArray<WorkDayGroup> {
    return this.scheduleForm.controls.diasDeTrabajo;
  }

  findDay(week: number, dayOfWeek: number): WorkDayGroup | undefined {
    return this.workDays.controls.find((day) => day.controls.numeroSemanaCiclo.value === week && day.controls.diaSemana.value === dayOfWeek);
  }

  onRestChange(day: WorkDayGroup, isRest: boolean): void {
    day.controls.esDescanso.setValue(isRest);
    if (isRest) {
      day.controls.horaEntrada.setValue(null);
      day.controls.horaSalida.setValue(null);
    }
    day.updateValueAndValidity();
    this.scheduleForm.updateValueAndValidity();
  }

  dayHasError(day: WorkDayGroup): boolean {
    return day.touched && day.invalid;
  }

  copyPreviousDay(week: number, currentDay: number): void {
    const order = [1, 2, 3, 4, 5, 6, 0];
    const index = order.indexOf(currentDay);
    if (index <= 0) return;
    const source = this.findDay(week, order[index - 1]);
    const target = this.findDay(week, currentDay);
    if (source && target) target.patchValue(source.getRawValue());
  }

  copyPreviousWeek(week: number): void {
    if (week < 2) return;
    for (const day of this.days) {
      const source = this.findDay(week - 1, day.dw);
      const target = this.findDay(week, day.dw);
      if (source && target) target.patchValue(source.getRawValue());
    }
  }

  private buildWorkDays(): WorkDayGroup[] {
    const groups: WorkDayGroup[] = [];
    for (let week = 1; week <= 4; week++) {
      for (const day of this.days) groups.push(this.createDayGroup(day.dw, week));
    }
    return groups;
  }

  private createDayGroup(dayOfWeek: number, week: number, value?: WorkDayForm): WorkDayGroup {
    return this.fb.group<WorkDayControls>({
      id: this.fb.control(value?.id ?? ""),
      diaSemana: this.fb.control(value?.diaSemana ?? dayOfWeek),
      numeroSemanaCiclo: this.fb.control(value?.numeroSemanaCiclo ?? week),
      horaEntrada: this.fb.control(value?.horaEntrada ?? null),
      horaSalida: this.fb.control(value?.horaSalida ?? null),
      esDescanso: this.fb.control(value?.esDescanso ?? false),
    }, { validators: workDayValidator });
  }

  private patchSchedule(schedule: WorkPositionScheduleDto): void {
    this.scheduleForm.patchValue({
      id: schedule.id,
      name: schedule.name,
      isActive: schedule.isActive,
      tipoJornada: schedule.tipoJornada,
      observaciones: schedule.observaciones,
    });
    const byKey = new Map((schedule.diasDeTrabajo ?? []).map((day) => [`${day.numeroSemanaCiclo}-${day.diaSemana}`, day]));
    this.workDays.clear();
    for (let week = 1; week <= 4; week++) {
      for (const day of this.days) this.workDays.push(this.createDayGroup(day.dw, week, byKey.get(`${week}-${day.dw}`)));
    }
    this.scheduleForm.updateValueAndValidity();
  }
}
