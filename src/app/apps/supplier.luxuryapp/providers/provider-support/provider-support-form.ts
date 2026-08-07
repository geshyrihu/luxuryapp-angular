import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  CrudSubmitOptions,
  FormHelper,
} from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

interface IProviderSupportForm {
  id: FormControl<string | null>;
  applicationUserId: FormControl<string>;
  applicationUser: FormControl<string | null>; // Name select
  providerId: FormControl<number | null>;
  nameProvider: FormControl<string | null>; // Name select
  applicationRoleId: FormControl<string | null>;
  applicationRoleName: FormControl<string | null>;
  customerId: FormControl<string | null>;
  nameCustomer: FormControl<string | null>; // Name select
}

@Component({
  selector: "app-provider-support-form",
  templateUrl: "./provider-support-form.html",
  imports: [
    AppIcon,
    ReactiveFormsModule,
    InputAutocomplete,
    WebButtonLabelSave,
  ],
})
export class ProviderSupportForm implements OnInit {
  private config = inject(DynamicDialogConfig);
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  customerIdS = inject(CustomerIdService);
  private ref = inject(DynamicDialogRef);

  submitting = signal(false);
  id: string = "";

  // Signals para ComboBoxes
  cb_applicationUserProvider = signal<SelectItemDto[]>([]);
  cb_applicationRoles = signal<SelectItemDto[]>([]);
  cb_providers = signal<SelectItemDto[]>([]);
  cb_customers = signal<SelectItemDto[]>([]);

  form: FormGroup<IProviderSupportForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    applicationUserId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    applicationUser: new FormControl<string | null>(null),
    providerId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    nameProvider: new FormControl<string | null>(null),
    applicationRoleId: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    applicationRoleName: new FormControl<string | null>(null),
    customerId: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    nameCustomer: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;
    await this.onLoadSelectItem();
    if (this.id !== "") {
      await this.onLoadData();
    }

    // Sync Id
    this.form.controls.id.setValue(this.id);
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.ProviderSupport.getById(this.id),
    );

    // Extraer IDs
    const providerId =
      typeof result.providerId === "object"
        ? result.providerId.value
        : result.providerId;
    const applicationRoleId =
      typeof result.applicationRoleId === "object"
        ? result.applicationRoleId.value
        : result.applicationRoleId;
    const applicationUserId =
      typeof result.applicationUserId === "object"
        ? result.applicationUserId.value
        : result.applicationUserId;
    const customerId =
      typeof result.customerId === "object"
        ? result.customerId.value
        : result.customerId;

    // Buscar objetos completos
    const selectedProvider = this.cb_providers().find(
      (item) => item.value === providerId,
    );
    const selectedRole = this.cb_applicationRoles().find(
      (item) => item.value === applicationRoleId,
    );
    const selectedUser = this.cb_applicationUserProvider().find(
      (item) => item.value === applicationUserId,
    );
    const selectedCustomer = this.cb_customers().find(
      (item) => item.value === customerId,
    );

    this.form.patchValue({
      ...result,
      providerId,
      applicationRoleId,
      applicationRoleName: selectedRole || null,
      applicationUserId,
      applicationUser: selectedUser || null,
      customerId,
      nameCustomer: selectedCustomer || null,
    });
  }

  async onLoadSelectItem(): Promise<void> {
    const [providers, applicationRoles, users, customers] = await Promise.all([
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        `providers/${this.customerIdS.customerId()}`,
      ),
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.applicationRolesToAdministrator,
      ),
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.applicationUserProvider,
      ),
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.customersActive,
      ),
    ]);

    this.cb_providers.set(providers as SelectItemDto[]);
    this.cb_applicationRoles.set(applicationRoles as SelectItemDto[]);
    this.cb_applicationUserProvider.set(users as SelectItemDto[]);
    this.cb_customers.set(customers as SelectItemDto[]);
  }

  saveProviderId = (item: SelectItemDto) =>
    this.form.patchValue({
      providerId: item?.value,
      nameProvider: item?.label,
    });
  saveApplicationRoleId = (item: SelectItemDto) =>
    this.form.patchValue({
      applicationRoleId: item?.value,
      applicationRoleName: item?.label,
    });
  saveApplicationUserId = (item: SelectItemDto) =>
    this.form.patchValue({
      applicationUserId: item?.value,
      applicationUser: item?.label,
    });
  saveCustomerId = (item: SelectItemDto) =>
    this.form.patchValue({
      customerId: item?.value,
      nameCustomer: item?.label,
    });

  onSubmit() {
    const options: CrudSubmitOptions = {
      form: this.form,
      api: this.apiResponseS,
      endpoint: "providersupport",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (formValue: any) => {
        return {
          applicationUserId: formValue.applicationUserId,
          providerId: formValue.providerId,
          applicationRoleId: formValue.applicationRoleId,
          customerId: formValue.customerId,
        };
      },
    };
    FormHelper.submitCrud(options);
  }
}
