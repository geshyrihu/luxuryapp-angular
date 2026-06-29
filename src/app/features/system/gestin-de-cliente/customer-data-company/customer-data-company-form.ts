import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
import { CustomInputPhonePrefix } from "src/app/core/components/inputs/web/custom-input-phone-prefix";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";

@Component({
  selector: "app-customer-data-company-form",
  templateUrl: "./customer-data-company-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    CustomInputPhonePrefix,
    CustomInputAutoComplete,
    CustomButtonSave,
  ],
})
export class CustomerDataCompanyForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);

  // Signals para ComboBoxes
  cb_applicationUser = signal<ISelectItem[]>([]);
  cb_customer = signal<ISelectItem[]>([]);
  cb_applicationRole = signal<ISelectItem[]>([]);

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    customerId: new FormControl<string | null>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    customer: new FormControl<any>(null),
    applicationRoleId: new FormControl<string | null>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    applicationRole: new FormControl<any>(null),
    phoneNumberPrefix: new FormControl<string>("+52"),
    applicationUserId: new FormControl<string | null>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    applicationUser: new FormControl<any>(null),
    email: new FormControl<string>("", {
      validators: [Validators.email],
    }),
    phoneNumber: new FormControl<string>(""),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id || "";

    await this.onLoadSelectItem();

    if (this.id !== "") {
      await this.onLoadData();
    }
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.CustomerDataCompany.getById(this.id),
    );

    if (result) {
      // Extraer IDs de forma segura
      const customerId =
        result.customerId && typeof result.customerId === "object"
          ? result.customerId.value
          : result.customerId;
      const applicationUserId =
        result.applicationUserId && typeof result.applicationUserId === "object"
          ? result.applicationUserId.value
          : result.applicationUserId;
      const applicationRoleId =
        result.applicationRoleId && typeof result.applicationRoleId === "object"
          ? result.applicationRoleId.value
          : result.applicationRoleId;

      // Buscar objetos completos para la UI de autocomplete
      const selectedCustomer = this.cb_customer().find(
        (item) => item.value === customerId,
      );
      const selectedUser = this.cb_applicationUser().find(
        (item) => item.value === applicationUserId,
      );
      const selectedRole = this.cb_applicationRole().find(
        (item) => item.value === applicationRoleId,
      );

      this.form.patchValue({
        ...result,
        customerId,
        customer: selectedCustomer || null,
        applicationUserId,
        applicationUser: selectedUser || null,
        applicationRoleId,
        applicationRole: selectedRole || null,
      });
    }
  }

  async onLoadSelectItem(): Promise<void> {
    const [customers, users, applicationRoles] = await Promise.all([
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.SelectItems.customersActive,
      ),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.SelectItems.applicationUser,
      ),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.SelectItems.applicationRolesToAdministrator,
      ),
    ]);

    this.cb_customer.set((customers as ISelectItem[]) ?? []);
    this.cb_applicationUser.set((users as ISelectItem[]) ?? []);
    this.cb_applicationRole.set((applicationRoles as ISelectItem[]) ?? []);
  }

  saveCustomer = (item: ISelectItem) => {
    this.form.patchValue({
      customerId: item?.value,
      customer: item?.label,
    });
  };

  saveApplicationUser = (item: ISelectItem) => {
    this.form.patchValue({
      applicationUserId: item?.value,
      applicationUser: item?.label,
    });
  };

  savAppRoles = (item: ISelectItem) => {
    this.form.patchValue({
      applicationRoleId: item?.value,
      applicationRole: item?.label,
    });
  };

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.CustomerDataCompany.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const v = this.form.getRawValue();
        return {
          customerId: v.customerId,
          applicationRoleId: v.applicationRoleId,
          phoneNumberPrefix: v.phoneNumberPrefix,
          applicationUserId: v.applicationUserId,
          email: v.email,
          phoneNumber: v.phoneNumber,
        };
      },
    });
  }
}
