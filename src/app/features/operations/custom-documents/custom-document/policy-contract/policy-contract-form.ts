import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FileUploadModule } from "@iplab/ngx-file-upload";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputFile } from "src/app/core/components/inputs/web/custom-input-file-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";

interface IPolicyContractForm {
  id: FormControl<string | null>;
  providerId: FormControl<string>;
  typeOfContract: FormControl<number | string>;
  isCurrent: FormControl<boolean>;
  providerName: FormControl<string | null>;
  customerId: FormControl<string>;
  description: FormControl<string>;
  startDate: FormControl<string>;
  endDate: FormControl<string | null>;
  endDateIndefinite: FormControl<boolean>;
  document: FormControl<any>;
}

@Component({
  selector: "app-policy-contract-form",
  templateUrl: "./policy-contract-form.html",
  imports: [
    WebButtonLabelSave,
    CustomInputAutoComplete,
    CustomInputCheckSignal,
    CustomInputDateSignal,
    CustomInputFile,
    CustomInputFile,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    FileUploadModule,
    ReactiveFormsModule,
  ],
})
export class PolicyContractForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  dateS = inject(DateService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  id = signal<number>(0);
  cb_providers = signal<ISelectItem[]>([]);
  cb_type_of_contract = signal<ISelectItem[]>([]);
  cb_isCurrent = signal<ISelectItem[]>([
    { label: "Activo", value: true },
    { label: "Inactivo", value: false },
  ]);

  file: File | null = null;

  form: FormGroup<IPolicyContractForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    providerId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    typeOfContract: new FormControl<number | string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isCurrent: new FormControl(true, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    providerName: new FormControl<string | null>(null),
    customerId: new FormControl(this.customerIdS.customerId(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    startDate: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    endDate: new FormControl<string | null>(null),
    endDateIndefinite: new FormControl(false, { nonNullable: true }),
    document: new FormControl<any>(null),
  });

  async ngOnInit(): Promise<void> {
    this.id.set(this.config.data.id);

    await Promise.all([this.loadProviders(), this.loadTypeOfContract()]);

    if (this.id()) {
      await this.onLoadData();
    } else {
      this.onEndDateIndefiniteChange();
    }
  }

  private async loadProviders(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      Endpoints.PolicyContracts.providersByCustomer(
        this.customerIdS.customerId(),
      ),
    );
    this.cb_providers.set(data);
  }

  private async loadTypeOfContract(): Promise<void> {
    const data = await this.apiResponseS.onGetEnumSelectItem(`ETypeOfContract`);
    this.cb_type_of_contract.set(data as ISelectItem[]);
  }

  onEndDateIndefiniteChange(): void {
    const isIndefinite = this.form.controls.endDateIndefinite.value;
    const endDateControl = this.form.controls.endDate;

    if (isIndefinite) {
      endDateControl?.setValue(null);
      endDateControl?.disable();
      endDateControl?.clearValidators();
    } else {
      endDateControl?.enable();
    }
    endDateControl?.updateValueAndValidity();
  }

  public saveProviderId(item: ISelectItem): void {
    this.form.patchValue({
      providerId: String(item?.value),
      providerName: item?.label,
    });
  }

  async onLoadData(): Promise<void> {
    const urlApi = Endpoints.PolicyContracts.getById(this.id());
    const result: any = await this.apiResponseS.onGetItem(urlApi);

    const isEndDateIndefinite =
      result.endDate === null ||
      result.endDate === "Indefinido" ||
      result.endDate === "";

    let formattedEndDate = null;
    if (!isEndDateIndefinite && result.endDate) {
      try {
        formattedEndDate = this.dateS.getDateFormat(result.endDate);
      } catch (error) {
        console.warn("Error al formatear endDate:", error);
        formattedEndDate = null;
      }
    }

    // Buscar el provider completo para el autocomplete
    const providerId =
      typeof result.providerId === "object"
        ? result.providerId.value
        : result.providerId;

    const selectedProvider = this.cb_providers().find(
      (item) => item.value === providerId,
    );

    this.form.patchValue({
      id: result.id,
      description: result.description,
      document: result.document,
      providerId: String(providerId),
      providerName: selectedProvider?.label || null,
      startDate: this.dateS.getDateFormat(result.startDate),
      endDate: formattedEndDate,
      endDateIndefinite: isEndDateIndefinite,
      isCurrent: result.isCurrent,
      typeOfContract: result.typeOfContract,
    });

    this.onEndDateIndefiniteChange();
  }

  async submit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: !this.id()
        ? Endpoints.PolicyContracts.create
        : Endpoints.PolicyContracts.update(this.id()),
      method: !this.id() ? "POST" : "PUT",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.createModel(this.form),
    });
  }

  uploadFile(file: File | null): void {
    this.file = file;
  }

  createModel(form: FormGroup): FormData {
    const formData = new FormData();
    const formValues = form.getRawValue();

    if (this.file) {
      formData.append("document", this.file);
    }

    formData.append("providerId", String(formValues.providerId));
    formData.append("customerId", String(formValues.customerId));
    formData.append("description", formValues.description);
    formData.append("isCurrent", String(formValues.isCurrent));
    formData.append("typeOfContract", String(formValues.typeOfContract));
    formData.append(
      "startDate",
      this.dateS.getDateFormat(formValues.startDate),
    );

    const endDateValue = formValues.endDate;
    if (endDateValue) {
      try {
        const formattedDate = this.dateS.getDateFormat(endDateValue);
        formData.append("endDate", formattedDate);
      } catch (e) {
        console.error("Error formateando endDate:", e);
      }
    }

    return formData;
  }
}
