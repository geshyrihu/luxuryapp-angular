import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { LxListbox } from "@ui/adaptive/listbox/listbox";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputMultiselectSignal } from "@ui/inputs/web/custom-input-multiselect-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { IManualTemplateDetalleDTO } from "./interfaces/manuals-and-processes.dto";

interface IManualTemplateForm {
  folio: FormControl<string>;
  description: FormControl<string>;
  objetivo: FormControl<string>;
  marcoLegal: FormControl<string>;
  departament: FormControl<number | null>;
  currentVersion: FormControl<string>;
  isGlobal: FormControl<boolean>;
  roleIds: FormControl<string[]>;
  customerIds: FormControl<string[]>;
  isActive: FormControl<boolean>;
  periodicity: FormControl<number>;
  executionDaysOfWeek: FormControl<number[]>;
  executionWeekOfMonth: FormControl<number | null>;
  executionDayOfMonth: FormControl<number | null>;
  executionMonthOfYear: FormControl<number | null>;
}

@Component({
  selector: "app-manuals-and-processes-form",
  templateUrl: "./manuals-and-processes-form.html",

  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    LxListbox,
    CustomInputSelectSignal,
    WebButtonLabelSave,
    CustomInputMultiselectSignal,
    AppIcon,
  ],
})
export class ManualsAndProcessesForm implements OnInit {
  private fb = inject(FormBuilder);
  private apiS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  id = signal<string | null>(null);
  submitting = signal(false);

  roles = signal<SelectItemDto[]>([]);
  customers = signal<SelectItemDto[]>([]);
  departments = signal<SelectItemDto[]>([]);

  // Periodicity options
  periodicityOptions = [
    { label: "A Demanda", value: 0 },
    { label: "ónica Vez", value: 1 },
    { label: "Diario", value: 2 },
    { label: "Semanal", value: 3 },
    { label: "Mensual", value: 4 },
    { label: "Anual", value: 5 },
  ];

  daysOfWeekOptions = [
    { label: "Domingo", value: 0 },
    { label: "Lunes", value: 1 },
    { label: "Martes", value: 2 },
    { label: "Miórcoles", value: 3 },
    { label: "Jueves", value: 4 },
    { label: "Viernes", value: 5 },
    { label: "Síbado", value: 6 },
  ];

  weeksOfMonthOptions = [
    { label: "1ra Semana", value: 1 },
    { label: "2da Semana", value: 2 },
    { label: "3ra Semana", value: 3 },
    { label: "4ta Semana", value: 4 },
    { label: "óltima Semana", value: 5 },
  ];

  daysOfMonthOptions = Array.from({ length: 31 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  monthsOfYearOptions = [
    { label: "Enero", value: 1 },
    { label: "Febrero", value: 2 },
    { label: "Marzo", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Mayo", value: 5 },
    { label: "Junio", value: 6 },
    { label: "Julio", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Septiembre", value: 9 },
    { label: "Octubre", value: 10 },
    { label: "Noviembre", value: 11 },
    { label: "Diciembre", value: 12 },
  ];

  form: FormGroup<IManualTemplateForm> = this.fb.group({
    folio: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl("", { nonNullable: true }),
    objetivo: new FormControl("", { nonNullable: true }),
    marcoLegal: new FormControl("", { nonNullable: true }),
    departament: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    currentVersion: new FormControl("1.0", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isGlobal: new FormControl(true, { nonNullable: true }),
    roleIds: new FormControl([] as string[], { nonNullable: true }),
    customerIds: new FormControl([] as string[], { nonNullable: true }),
    isActive: new FormControl(true, { nonNullable: true }),
    periodicity: new FormControl(0, { nonNullable: true }),
    executionDaysOfWeek: new FormControl<number[]>([], { nonNullable: true }),
    executionWeekOfMonth: new FormControl<number | null>(null),
    executionDayOfMonth: new FormControl<number | null>(null),
    executionMonthOfYear: new FormControl<number | null>(null),
  });

  // Signal properties to track form value changes easily in HTML
  periodicityVal = signal<number>(0);

  ngOnInit(): void {
    this.id.set(this.config.data?.id ?? null);
    this.loadCatalogos();

    // Track periodicity changes
    this.form.controls.periodicity.valueChanges.subscribe((val) => {
      this.periodicityVal.set(val);
      // Optional: Reset sub-fields when periodicity changes
      if (val !== 3) this.form.controls.executionDaysOfWeek.setValue([]);
      if (val !== 4) {
        this.form.controls.executionWeekOfMonth.setValue(null);
        this.form.controls.executionDayOfMonth.setValue(null);
      }
      if (val !== 5) this.form.controls.executionMonthOfYear.setValue(null);
    });

    if (this.id()) this.loadData();
  }

  async loadCatalogos() {
    const [roles, customers, depts] = await Promise.all([
      this.apiS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.rolesForAnnouncements,
      ),
      this.apiS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.customersActiveShortName,
      ),
      this.apiS.onGetItem<SelectItemDto[]>(
        Endpoints.EnumSelectItems.departament,
      ),
    ]);

    const groupedRoles = (roles ?? []).reduce((acc: any[], curr) => {
      const groupName = curr.group || "Otros";
      let groupObj = acc.find((g) => g.label === groupName);
      if (!groupObj) {
        groupObj = { label: groupName, items: [] };
        acc.push(groupObj);
      }
      groupObj.items.push(curr);
      return acc;
    }, []);

    this.roles.set(groupedRoles);
    this.customers.set(customers ?? []);
    this.departments.set(depts ?? []);
  }

  async loadData() {
    const res = await this.apiS.onGetItem<IManualTemplateDetalleDTO>(
      Endpoints.ManualsPasos.getById(this.id()!),
    );
    if (!res) return;
    this.form.patchValue({
      folio: res.folio,
      description: res.description,
      objetivo: res.objetivo,
      marcoLegal: res.marcoLegal ?? "",
      departament: res.departamentValue,
      currentVersion: res.currentVersion,
      isGlobal: res.isGlobal,
      isActive: res.isActive,
      roleIds: res.roleIds ?? [],
      customerIds: res.customerIds ?? [],
      periodicity: res.periodicity ?? 0,
      executionDaysOfWeek: res.executionDaysOfWeek ?? [],
      executionWeekOfMonth: res.executionWeekOfMonth ?? null,
      executionDayOfMonth: res.executionDayOfMonth ?? null,
      executionMonthOfYear: res.executionMonthOfYear ?? null,
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: Endpoints.ManualsPasos.create,
      id: this.id(),
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
