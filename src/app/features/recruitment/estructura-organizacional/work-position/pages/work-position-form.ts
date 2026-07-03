import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { lastValueFrom } from "rxjs";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

@Component({
  selector: "app-work-position-form",
  templateUrl: "./work-position-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    CustomInputTextSignal,
    CustomInputAutoComplete,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    MessageModule,
    DividerModule,
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

  cb_applicationRole = signal<ISelectItem[]>([]);
  cb_employee = signal<ISelectItem[]>([]);
  cb_turnoTrabajo = signal<ISelectItem[]>([]);
  cb_state = signal<ISelectItem[]>([]);

  readonly AspRole = EApplicationRole;

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
    turnoTrabajo: [0, Validators.required],
    lunesEntrada: [""],
    lunesSalida: [""],
    martesEntrada: [""],
    martesSalida: [""],
    miercolesEntrada: [""],
    miercolesSalida: [""],
    juevesEntrada: [""],
    juevesSalida: [""],
    viernesEntrada: [""],
    viernesSalida: [""],
    sabadoEntrada: [""],
    sabadoSalida: [""],
    domingoEntrada: [""],
    domingoSalida: [""],
    jobDescriptionId: [null as string | null],
    workScheduleId: [null as string | null],
    observationsWorkShift: [""],
    benefits: [""],
  });

  async ngOnInit(): Promise<void> {
    const id = this.config.data?.id;
    if (id) this.id.set(id);

    await this.onLoadSelectItems();

    if (this.id()) {
      await this.onLoadData();
    }
  }

  async onLoadSelectItems(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const [turnoTrabajo, state, applicationRoles, employees] =
      await Promise.all([
        lastValueFrom(this.enumSelectS.turnoTrabajo()),
        lastValueFrom(this.enumSelectS.state()),
        this.apiS.onGetSelectItem<ISelectItem[]>(
          `application-roles-to-administrator`,
        ),
        this.apiS.onGetSelectItem<ISelectItem[]>(`Employee/${customerId}`),
      ]);

    this.cb_turnoTrabajo.set(turnoTrabajo);
    this.cb_state.set(state);
    this.cb_applicationRole.set(applicationRoles ?? []);
    this.cb_employee.set(employees ?? []);
  }

  async onLoadData(): Promise<void> {
    const result = await this.apiS.onGetItem<any>(
      `work-positions/for-edit/${this.id()}`,
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

  saveEmployee = (item: ISelectItem) => {
    this.form.patchValue({
      employeeId: item?.value || null,
      employeeName: item?.label || null,
    });
  };

  saveApplicationRole = (item: ISelectItem) => {
    this.form.patchValue({
      applicationRoleId: item?.value || "",
      applicationRoleName: item?.label || null,
    });
  };

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: "work-positions",
      id: this.id(),
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
