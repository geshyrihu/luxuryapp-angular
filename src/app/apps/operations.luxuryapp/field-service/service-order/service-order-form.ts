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
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DateService } from "src/app/core/services/date.service";

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
}

@Component({
  selector: "app-service-order-form",
  templateUrl: "./service-order-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    WebButtonLabel,
    InputAutocomplete,
    CustomInputCurrencySignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    CustomInputSwitch,
    CustomInputTextSignal,
  ],
})
export class ServiceOrderForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  dateS = inject(DateService);
  customerIdS = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  id = signal<number>(0);

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
      validators: [Validators.required],
    }),
    requestDate: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<number | null>(null, [Validators.required]),
    providerId: new FormControl<number | null>(null),
    provider: new FormControl<string | null>(null),
    price: new FormControl<number | null>(null, [Validators.required]),
    employeeResponsableId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    employeeResponsable: new FormControl<string | null>(null),
    typeMaintance: new FormControl<number | null>(null, [Validators.required]),
    executionDate: new FormControl("", { nonNullable: true }),
    observations: new FormControl<string | null>(null),
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
  });

  async ngOnInit(): Promise<void> {
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
      Endpoints.SelectItems.usersByCustomer(this.customerIdS.customerId()),
    );
    this.cb_applicationUser.set(data || []);
  }

  private async loadStatus(): Promise<void> {
    const data = await this.apiResponseS.onGetEnumSelectItem(
      Endpoints.EnumSelectItems.status,
    );
    this.cb_Status.set((data as SelectItemDto[]) || []);
  }

  private async loadTypeMaintance(): Promise<void> {
    const data = await this.apiResponseS.onGetEnumSelectItem<SelectItemDto[]>(
      Endpoints.EnumSelectItems.typeMaintance,
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
    this.form.patchValue({
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
    });
  }

  async onSubmit() {
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
        providerId: formValue.providerId,
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
