import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DateService } from "@core/services/date.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { LuxInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { LuxInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { LuxInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { LuxInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";

interface IServiceOrderForm {
  id: FormControl<string | null>;
  machineryId: FormControl<number | null>;
  machinery: FormControl<string | null>;
  activity: FormControl<string>;
  requestDate: FormControl<string>;
  status: FormControl<number | null>;
  providerId: FormControl<number | null>;
  provider: FormControl<string | null>;
  price: FormControl<number | null>;
  employeeResponsableId: FormControl<string>;
  employeeResponsable: FormControl<string | null>;
  typeMaintance: FormControl<number | null>;
  executionDate: FormControl<string>;
  observations: FormControl<string | null>;
  cumplimientoActividades: FormControl<boolean>;
  equiposOperando: FormControl<boolean>;
  ocacionoDanos: FormControl<boolean>;
  calidadTrabajos: FormControl<boolean>;
  maintenanceCalendarId: FormControl<number | null>;
  isInternalExecution: FormControl<boolean>;
}

@Component({
  selector: "app-service-order-form",
  templateUrl: "./service-order-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    ButtonWeb,
    InputAutocomplete,
    LuxInputCurrencySignal,
    LuxInputDateSignal,
    LuxInputTextAreaSignal,
    LuxInputSwitch,
    LuxInputTextSignal,
  ],
})
export class ServiceOrderForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  dateS = inject(DateService);
  customerIdS = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);
  destroyRef = inject(DestroyRef);

  submitting = signal(false);
  id = signal<number>(0);
  isFinalStatus = false;

  // Signals para los catálogos
  cb_machinery = signal<SelectItemDto[]>([]);
  cb_providers = signal<SelectItemDto[]>([]);
  cb_Status = signal<SelectItemDto[]>([]);
  cb_TypeMaintance = signal<SelectItemDto[]>([]);
  cb_applicationUser = signal<SelectItemDto[]>([]);

  form: FormGroup<IServiceOrderForm> = new FormGroup<IServiceOrderForm>({
    id: new FormControl({ value: "", disabled: true }),
    machineryId: new FormControl<number | null>(null, [Validators.required]),
    machinery: new FormControl<string | null>(null),
    activity: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2000)],
    }),
    requestDate: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<number | null>(null, [Validators.required]),
    providerId: new FormControl<number | null>(null),
    provider: new FormControl<string | null>(null),
    // La validación de coherencia se aplica por grupo más abajo.
    price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    employeeResponsableId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    employeeResponsable: new FormControl<string | null>(null),
    typeMaintance: new FormControl<number | null>(null, [Validators.required]),
    executionDate: new FormControl("", { nonNullable: true }),
    observations: new FormControl<string | null>(null, [
      Validators.maxLength(4000),
    ]),
    cumplimientoActividades: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    equiposOperando: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    ocacionoDanos: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    calidadTrabajos: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    maintenanceCalendarId: new FormControl<number | null>(null),
    isInternalExecution: new FormControl(false, { nonNullable: true }),
  });

  private static coherenceValidator = (
    group: AbstractControl,
  ): ValidationErrors | null => {
    const requestDate = group.get("requestDate")?.value;
    const executionDate = group.get("executionDate")?.value;
    const price = group.get("price")?.value;
    const status = group.get("status")?.value;
    const errors: ValidationErrors = {};

    if (price != null && Number(price) < 0) errors["negativePrice"] = true;

    if (
      requestDate &&
      executionDate &&
      new Date(executionDate) < new Date(requestDate)
    ) {
      errors["executionBeforeRequest"] = true;
    }

    // Status.Concluido === 1 requiere fecha de ejecución.
    if (status === 1 && !executionDate)
      errors["concludedWithoutExecution"] = true;

    return Object.keys(errors).length ? errors : null;
  };

  async ngOnInit(): Promise<void> {
    this.form.setValidators(ServiceOrderForm.coherenceValidator);
    this.form.updateValueAndValidity();
    this.form.controls.isInternalExecution.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyExecutionMode());

    this.id.set(this.config.data.id);

    await Promise.all([
      this.loadMachineries(),
      this.loadProviders(),
      this.loadApplicationUsers(),
      this.loadStatus(),
      this.loadTypeMaintance(),
    ]);

    if (this.id() !== 0) {
      await this.onLoadData();
    }
  }

  private async loadMachineries(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.machineryActiveByCustomer(
        this.customerIdS.customerId(),
      ),
    );
    this.cb_machinery.set(data || []);
  }

  private async loadProviders(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.providers(this.customerIdS.customerId()),
    );
    this.cb_providers.set(data || []);
  }

  private async loadApplicationUsers(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.employeesByUserId(this.customerIdS.customerId()),
    );
    this.cb_applicationUser.set(data || []);
  }

  private async loadStatus(): Promise<void> {
    // defaultOption=false omite el placeholder "--Seleccione una opción--".
    const data = await this.apiResponseS.onGetEnumSelectItem("status/false");
    this.cb_Status.set((data as SelectItemDto[]) || []);
  }

  private async loadTypeMaintance(): Promise<void> {
    const data = await this.apiResponseS.onGetEnumSelectItem<SelectItemDto[]>(
      "type-maintance/false",
    );
    this.cb_TypeMaintance.set(data || []);
  }

  public saveMachineryId = (item: SelectItemDto) =>
    this.form.patchValue({
      machineryId: item?.value,
      machinery: item?.label,
    });
  public saveProviderId = (item: SelectItemDto) =>
    this.form.patchValue({
      providerId: item?.value,
      provider: item?.label,
    });

  private applyExecutionMode(): void {
    const providerId = this.form.controls.providerId;
    const provider = this.form.controls.provider;

    if (this.form.controls.isInternalExecution.value) {
      providerId.setValue(null, { emitEvent: false });
      provider.setValue(null, { emitEvent: false });
      providerId.disable({ emitEvent: false });
      provider.disable({ emitEvent: false });
    } else {
      providerId.enable({ emitEvent: false });
      provider.enable({ emitEvent: false });
    }

    providerId.updateValueAndValidity({ emitEvent: false });
    provider.updateValueAndValidity({ emitEvent: false });
    this.form.updateValueAndValidity({ emitEvent: false });
  }
  public saveResponsibleUserId = (item: SelectItemDto) =>
    this.form.patchValue({
      employeeResponsableId: String(item?.value),
      employeeResponsable: item?.label,
    });

  async onLoadData(): Promise<void> {
    const urlApi = Endpoints.ServiceOrders.getById(this.id());
    const result: any = await this.apiResponseS.onGetItem(urlApi);

    // Formatear fechas
    const executionDate = result.executionDate
      ? this.dateS.getDateFormat(result.executionDate)
      : "";
    const requestDate = this.dateS.getDateFormat(result.requestDate);

    // Limpiar HTML
    const activity = result.activity?.replace(/<[^>]*>|&nbsp;/g, "") || "";
    const observations =
      result.observations?.replace(/<[^>]*>|&nbsp;/g, "") || "";

    // Extraer IDs
    const machineryId =
      result.machineryId && typeof result.machineryId === "object"
        ? result.machineryId.value
        : result.machineryId;
    const providerId =
      result.providerId && typeof result.providerId === "object"
        ? result.providerId.value
        : result.providerId;
    const employeeResponsableId =
      result.employeeResponsableId &&
      typeof result.employeeResponsableId === "object"
        ? result.employeeResponsableId.value
        : result.employeeResponsableId;

    // Buscar objetos completos
    const selectedMachinery = this.cb_machinery().find(
      (item) => item.value === machineryId,
    );
    const selectedProvider = this.cb_providers().find(
      (item) => item.value === providerId,
    );
    const selectedEmployee = this.cb_applicationUser().find(
      (item) => item.value === employeeResponsableId,
    );

    // Actualizar formulario
    this.form.patchValue(
      {
        ...result,
        executionDate,
        requestDate,
        activity,
        observations,
        machineryId: machineryId,
        machinery: selectedMachinery?.label || null,
        providerId: providerId,
        provider: selectedProvider?.label || null,
        employeeResponsableId: String(employeeResponsableId),
        employeeResponsable: selectedEmployee?.label || null,
        isInternalExecution: result.isInternalExecution === true,
      },
      { emitEvent: false },
    );
    this.isFinalStatus = [1, 2, 4].includes(Number(result.status));
    this.applyExecutionMode();
    if (this.isFinalStatus) this.form.disable({ emitEvent: false });
  }

  async onSubmit() {
    if (this.isFinalStatus) return;

    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.ServiceOrders.create,
      id: this.id() === 0 ? null : String(this.id()),
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (formValue) => ({
        machineryId: formValue.machineryId,
        activity: formValue.activity,
        requestDate: this.dateS.getDateFormat(formValue.requestDate as any),
        status: formValue.status,
        providerId: formValue.isInternalExecution ? null : formValue.providerId,
        isInternalExecution: formValue.isInternalExecution,
        price: formValue.price,
        employeeResponsableId: formValue.employeeResponsableId,
        typeMaintance: formValue.typeMaintance,
        executionDate: formValue.executionDate
          ? this.dateS.getDateFormat(formValue.executionDate as any)
          : null,
        observations: formValue.observations,
        cumplimientoActividades: formValue.cumplimientoActividades,
        equiposOperando: formValue.equiposOperando,
        ocacionoDanos: formValue.ocacionoDanos,
        calidadTrabajos: formValue.calidadTrabajos,
        maintenanceCalendarId: formValue.maintenanceCalendarId,
      }),
    });
  }
}
