import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputDateTimeSignal } from "src/app/core/components/inputs/web/custom-input-date-time-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { FormHelper } from "src/app/core/helpers/form-helper";

interface IPrestamoHerramientaForm {
  id: FormControl<string | null>;
  customerId: FormControl<string>;
  fechaSalida: FormControl<string>;
  fechaRegreso: FormControl<string | null>;
  applicationUserId: FormControl<string>;
  applicationUser: FormControl<any>;
  toolId: FormControl<number | string>;
  tool: FormControl<any>;
  observaciones: FormControl<string | null>;
  applicationUserResponsableId: FormControl<string>;
}

@Component({
  selector: "app-prestamo-herramienta-form-control",
  templateUrl: "./prestamo-herramienta-form-control.html",
  imports: [
    ReactiveFormsModule,
    CustomButtonSave,
    CustomInputAutoComplete,
    CustomInputDateTimeSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
  ],
})
export class PrestamoHerramientaFormControl implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  submitting = signal(false);

  id: string = "";
  cb_applicationUser = signal<ISelectItem[]>([]);
  cb_tool = signal<ISelectItem[]>([]);
  today: string = "";

  form: FormGroup<IPrestamoHerramientaForm> =
    new FormGroup<IPrestamoHerramientaForm>({
      id: new FormControl({ value: "", disabled: true }),
      customerId: new FormControl(this.customerIdS.customerId(), {
        nonNullable: true,
      }),
      fechaSalida: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      fechaRegreso: new FormControl<string | null>(null),
      applicationUserId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      applicationUser: new FormControl<any>(null),
      toolId: new FormControl<number | string>("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      tool: new FormControl<any>(null),
      observaciones: new FormControl<string | null>(null),
      applicationUserResponsableId: new FormControl(
        this.authS.applicationUserId,
        { nonNullable: true },
      ),
    });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;
    this.today = new Date().toISOString().slice(0, 16);

    // Establecer fecha de salida por defecto
    this.form.patchValue({ fechaSalida: this.today });

    await Promise.all([this.loadApplicationUsers(), this.loaDTOols()]);

    if (this.id) {
      await this.onLoadData();
    }
  }

  private async loadApplicationUsers(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      `application-users/${this.customerIdS.customerId()}`,
    );
    this.cb_applicationUser.set(data);
  }

  private async loaDTOols(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      `tool/${this.customerIdS.customerId()}`,
    );
    this.cb_tool.set(data);
  }

  public saveToolId(item: ISelectItem): void {
    this.form.patchValue({
      toolId: item?.value,
      tool: item,
    });
  }

  public saveEmployeeId(item: ISelectItem): void {
    this.form.patchValue({
      applicationUserId: String(item?.value),
      applicationUser: item,
    });
  }

  get f() {
    return this.form.controls;
  }

  async onLoadData(): Promise<void> {
    const urlApi = `controlprestamoherramientas/${this.id}`;
    const result: any = await this.apiResponseS.onGetItem(urlApi);

    // Extraer IDs si vienen como objetos
    const toolId =
      typeof result.toolId === "object" ? result.toolId.value : result.toolId;
    const applicationUserId =
      typeof result.applicationUserId === "object"
        ? result.applicationUserId.value
        : result.applicationUserId;

    // Buscar los objetos completos para los autocomplete
    const selecteDTOol = this.cb_tool().find((item) => item.value === toolId);
    const selectedUser = this.cb_applicationUser().find(
      (item) => item.value === applicationUserId,
    );

    this.form.patchValue({
      ...result,
      fechaSalida: new Date(result.fechaSalida),
      fechaRegreso: result.fechaRegreso ? new Date(result.fechaRegreso) : null,
      toolId: toolId,
      tool: selecteDTOol || null,
      applicationUserId: applicationUserId,
      applicationUser: selectedUser || null,
    });
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "controlprestamoherramientas",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (formValues) => ({
        customerId: formValues.customerId,
        fechaSalida: formValues.fechaSalida,
        fechaRegreso: formValues.fechaRegreso,
        applicationUserId: formValues.applicationUserId,
        toolId: formValues.toolId,
        observaciones: formValues.observaciones,
        applicationUserResponsableId: formValues.applicationUserResponsableId,
      }),
    });
  }
}
