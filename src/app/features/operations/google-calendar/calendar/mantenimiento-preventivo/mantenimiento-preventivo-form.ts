import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SelectItem } from "primeng/api";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface IMantenimientoPreventivoForm {
  id: FormControl<string | null>;
  activity: FormControl<string>;
  machineryId: FormControl<number | string | null>;
  month: FormControl<number | null>;
  observation: FormControl<string>;
  price: FormControl<number | null>;
  providerId: FormControl<number | string | null>;
  recurrence: FormControl<number | null>;
  typeMaintance: FormControl<number | null>;
  customerId: FormControl<string>;
  accountingCatalogId: FormControl<number | string | null>;
  machineryName: FormControl<any>;
  providerName: FormControl<any>;
  accountingCatalogName: FormControl<any>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-mantenimiento-preventivo-form",
  templateUrl: "./mantenimiento-preventivo-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputAutoComplete,
    CustomButtonSave,
    CardModule,
  ],
})
export class MantenimientoPreventivoForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  cb_machinery = signal<ISelectItem[]>([]);
  cb_providers = signal<ISelectItem[]>([]);
  cb_recurrencia = signal<ISelectItem[]>([]);
  cb_accountingCatalogs = signal<ISelectItem[]>([]);
  cb_TypeMaintance = signal<SelectItem[]>([]);
  cb_month = signal<ISelectItem[]>([]);

  submitting = signal(false);

  id: string = "";
  idMachinery: number = null;

  form: FormGroup<IMantenimientoPreventivoForm> =
    new FormGroup<IMantenimientoPreventivoForm>({
      id: new FormControl({ value: "", disabled: true }),
      activity: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      machineryId: new FormControl<number | string | null>(null, {
        validators: [Validators.required],
      }),
      month: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      observation: new FormControl("", { nonNullable: true }),
      price: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      providerId: new FormControl<number | string | null>(null, {
        validators: [Validators.required],
      }),
      recurrence: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      typeMaintance: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      customerId: new FormControl(this.customerIdS.customerId(), {
        nonNullable: true,
      }),
      accountingCatalogId: new FormControl<number | string | null>(null, {
        validators: [Validators.required],
      }),
      machineryName: new FormControl<any>(null, {
        validators: [Validators.required],
      }),
      providerName: new FormControl<any>(null, {
        validators: [Validators.required],
      }),
      accountingCatalogName: new FormControl<any>(null, {
        validators: [Validators.required],
      }),
      applicationUserId: new FormControl(this.authS.applicationUserId, {
        nonNullable: true,
      }),
    });

  async ngOnInit(): Promise<void> {
    this.idMachinery = this.config.data.idMachinery;

    await Promise.all([
      this.loadMachineries(),
      this.loadProviders(),
      this.loadAccountingCatalogs(),
      this.loadRecurrence(),
      this.loadTypeMaintance(),
      this.loadMonths(),
    ]);

    switch (this.config.data.task) {
      case "create":
        await this.onGetMachinerySelectItem();
        break;
      case "edit":
        await this.onLoadData();
        break;
      case "copy":
        await this.LoadCopy();
        break;
    }
  }

  private async loadMonths(): Promise<void> {
    const data = await firstValueFrom(this.enumSelectS.month());
    this.cb_month.set(data);
  }

  private async loadMachineries(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      `MachineriesGetAll/${this.customerIdS.customerId()}`,
    );
    this.cb_machinery.set(data);
  }

  private async loadProviders(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      `providers/${this.customerIdS.customerId()}`,
    );
    this.cb_providers.set(data);
  }

  private async loadAccountingCatalogs(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      `AccountingCatalogs/${this.customerIdS.customerId()}`,
    );
    this.cb_accountingCatalogs.set(data);
  }

  private async loadRecurrence(): Promise<void> {
    const data = await firstValueFrom(this.enumSelectS.recurrence());
    this.cb_recurrencia.set(data);
  }

  private async loadTypeMaintance(): Promise<void> {
    const data = await firstValueFrom(this.enumSelectS.typeMaintance());
    this.cb_TypeMaintance.set(data);
  }

  public saveMachineryId = (item: ISelectItem) =>
    this.form.patchValue({
      machineryId: item ? item.value : null,
      machineryName: item,
    });
  public saveProviderId = (item: ISelectItem) =>
    this.form.patchValue({
      providerId: item ? item.value : null,
      providerName: item,
    });
  public saveAccountingCatalog = (item: ISelectItem) =>
    this.form.patchValue({
      accountingCatalogId: item ? item.value : null,
      accountingCatalogName: item,
    });

  get f() {
    return this.form.controls;
  }

  async onGetMachinerySelectItem(): Promise<void> {
    if (this.config.data.idMachinery !== 0) {
      const result: any = await this.apiResponseS.onGetList(
        `Machineries/GetMachinerySelectItem/${this.config.data.idMachinery}`,
      );

      const selectedMachinery = this.cb_machinery().find(
        (item) => item.value === result.value,
      );

      this.form.patchValue({
        machineryId: result.value,
        machineryName: selectedMachinery || null,
        typeMaintance: 0,
      });
    }
  }

  async LoadCopy(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      `MaintenanceCalendars/Get/${this.config.data.id}`,
    );
    this.id = "";
    this.onPathForm(result);
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      `MaintenanceCalendars/Get/${this.config.data.id}`,
    );
    this.id = result.id;
    this.onPathForm(result);
  }

  onPathForm(result: any): void {
    const machineryId =
      typeof result.machineryId === "object"
        ? result.machineryId.value
        : result.machineryId;
    const providerId =
      typeof result.providerId === "object"
        ? result.providerId.value
        : result.providerId;
    const accountingCatalogId =
      typeof result.accountingCatalog === "object"
        ? result.accountingCatalog.value
        : result.accountingCatalog;

    const selectedMachinery = this.cb_machinery().find(
      (item) => item.value === machineryId,
    );
    const selectedProvider = this.cb_providers().find(
      (item) => item.value === providerId,
    );
    const selectedAccountingCatalog = this.cb_accountingCatalogs().find(
      (item) => item.value === accountingCatalogId,
    );
    const selectedMonth = this.cb_month().find(
      (item) => item.label === result.month,
    );

    const activity = result.activity?.replace(/<[^>]*>|&nbsp;/g, "") || "";
    const observation =
      result.observation?.replace(/<[^>]*>|&nbsp;/g, "") || "";

    this.form.patchValue({
      ...result,
      machineryId,
      machineryName: selectedMachinery || null,
      providerId,
      providerName: selectedProvider || null,
      accountingCatalogId,
      accountingCatalogName: selectedAccountingCatalog || null,
      activity,
      observation,
      month: selectedMonth ? selectedMonth.value : null,
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "MaintenanceCalendars",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const { machineryName, providerName, accountingCatalogName, ...rest } =
          this.form.getRawValue();
        return rest;
      },
    });
  }
}
