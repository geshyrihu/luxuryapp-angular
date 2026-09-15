import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { InputTextModule } from "@ui/web/primeng-inputtext/primeng-inputtext";
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
import { lastValueFrom } from "rxjs";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { EnumSelectService } from "@core/services/enum-select.service";
import type { DiaDeTrabajoDto } from "./interfaces/work-position.model";

@Component({
  selector: "app-work-position-form",
  templateUrl: "./work-position-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
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

  // --- SIGNALS Y PROPIEDADES ---
  submitting = signal(false);
  id = signal<string | null>(null);

  cb_applicationRole = signal<SelectItemDto[]>([]);
  cb_employee = signal<SelectItemDto[]>([]);
  cb_workPositionSchedule = signal<SelectItemDto[]>([]);
  workPositionSchedules = signal<WorkPositionScheduleOption[]>([]);
  selectedSchedule = signal<WorkPositionScheduleOption | null>(null);
  cb_state = signal<SelectItemDto[]>([]);

  readonly AspRole = ApplicationRole;
  readonly canEditCurrentSalary = computed(() =>
    this.aspRoleS.hasAny([ApplicationRole.RecursosHumanos, ApplicationRole.SuperUsuario]),
  );
  readonly scheduleWeeks = computed(() => {
    const schedule = this.selectedSchedule();
    const findDay = (dw: number, nw: number) =>
      schedule?.diasDeTrabajo?.find((d) => d.diaSemana === dw && d.numeroSemanaCiclo === nw);

    const weeks = [];
    for (let w = 1; w <= 4; w++) {
      weeks.push({
        weekNumber: w,
        days: [
          { name: "Lun", ...findDay(1, w) },
          { name: "Mar", ...findDay(2, w) },
          { name: "Mié", ...findDay(3, w) },
          { name: "Jue", ...findDay(4, w) },
          { name: "Vie", ...findDay(5, w) },
          { name: "Sáb", ...findDay(6, w) },
          { name: "Dom", ...findDay(7, w) },
        ],
      });
    }
    return weeks;
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
    workPositionScheduleId: [null as string | null],
    workPositionScheduleName: [null as string | null],
    benefits: [""],
  });

  async ngOnInit(): Promise<void> {
    const id = this.config.data?.id;
    if (id) this.id.set(id);

    await this.onLoadSelectItems();

    if (this.id()) {
      await this.onLoadData();
    }

    this.form.controls.workPositionScheduleId.valueChanges.subscribe((scheduleId) => {
      this.setSelectedSchedule(scheduleId);
    });
  }

  async onLoadSelectItems(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const [state, applicationRoles, employees, schedules] =
      await Promise.all([
        lastValueFrom(this.enumSelectS.state()),
        this.apiS.onGetSelectItem<SelectItemDto[]>(
          Endpoints.SelectItems.applicationRolesToAdministrator,
        ),
        this.apiS.onGetSelectItem<SelectItemDto[]>(
          Endpoints.SelectItems.employeesByCustomer(customerId),
        ),
        this.apiS.onGetList<WorkPositionScheduleOption[]>(
          Endpoints.Catalogs.WorkPositionSchedule.getAll,
        ),
      ]);

    this.cb_state.set(state);
    this.cb_applicationRole.set(applicationRoles ?? []);
    this.cb_employee.set(employees ?? []);
    this.workPositionSchedules.set(schedules ?? []);
    this.cb_workPositionSchedule.set(
      (schedules ?? [])
        .filter((schedule) => schedule.isActive)
        .map((schedule) => ({
          label: schedule.name,
          value: schedule.id,
        })),
    );
    this.setSelectedSchedule(this.form.controls.workPositionScheduleId.value);
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
      this.setSelectedSchedule(result.workPositionScheduleId ?? null);
    }
  }

  setSelectedSchedule(scheduleId: string | null): void {
    const selected = this.workPositionSchedules().find((schedule) => schedule.id === scheduleId) ?? null;
    this.selectedSchedule.set(selected);
    this.form.patchValue(
      { workPositionScheduleName: selected?.name ?? null },
      { emitEvent: false },
    );
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

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: Endpoints.WorkPositions.base,
      id: this.id(),
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}

interface WorkPositionScheduleOption {
  id: string;
  name: string;
  isActive: boolean;
  tipoJornadaName: string;
  diasDeTrabajo: DiaDeTrabajoDto[] | null;
  observaciones: string;
}

