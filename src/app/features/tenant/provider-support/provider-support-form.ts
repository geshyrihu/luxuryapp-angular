import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CrudSubmitOptions, FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

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
    CommonModule,
    ReactiveFormsModule,
    CustomInputAutoComplete,
    CustomButtonSave,
    CardModule,
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
  cb_applicationUserProvider = signal<ISelectItem[]>([]);
  cb_applicationRoles = signal<ISelectItem[]>([]);
  cb_providers = signal<ISelectItem[]>([]);
  cb_customers = signal<ISelectItem[]>([]);

  form: FormGroup<IProviderSupportForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    applicationUserId: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    applicationUser: new FormControl<string | null>(null),
    providerId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    nameProvider: new FormControl<string | null>(null),
    applicationRoleId: new FormControl<string | null>(null, { validators: [Validators.required] }),
    applicationRoleName: new FormControl<string | null>(null),
    customerId: new FormControl<string | null>(null, { validators: [Validators.required] }),
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
    const result: any = await this.apiResponseS.onGetItem(`providersupport/${this.id}`);

    // Extraer IDs
    const providerId = typeof result.providerId === "object" ? result.providerId.value : result.providerId;
    const applicationRoleId = typeof result.applicationRoleId === "object" ? result.applicationRoleId.value : result.applicationRoleId;
    const applicationUserId = typeof result.applicationUserId === "object" ? result.applicationUserId.value : result.applicationUserId;
    const customerId = typeof result.customerId === "object" ? result.customerId.value : result.customerId;

    // Buscar objetos completos
    const selectedProvider = this.cb_providers().find((item) => item.value === providerId);
    const selectedRole = this.cb_applicationRoles().find((item) => item.value === applicationRoleId);
    const selectedUser = this.cb_applicationUserProvider().find((item) => item.value === applicationUserId);
    const selectedCustomer = this.cb_customers().find((item) => item.value === customerId);

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
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(`providers/${this.customerIdS.customerId()}`),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>("application-roles-to-administrator"),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>("ApplicationUserProvider"),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>("customers-active"),
    ]);

    this.cb_providers.set(providers as ISelectItem[]);
    this.cb_applicationRoles.set(applicationRoles as ISelectItem[]);
    this.cb_applicationUserProvider.set(users as ISelectItem[]);
    this.cb_customers.set(customers as ISelectItem[]);
  }

  saveProviderId = (item: ISelectItem) => this.form.patchValue({ providerId: item?.value, nameProvider: item?.label });
  saveApplicationRoleId = (item: ISelectItem) => this.form.patchValue({ applicationRoleId: item?.value, applicationRoleName: item?.label });
  saveApplicationUserId = (item: ISelectItem) => this.form.patchValue({ applicationUserId: item?.value, applicationUser: item?.label });
  saveCustomerId = (item: ISelectItem) => this.form.patchValue({ customerId: item?.value, nameCustomer: item?.label });

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









