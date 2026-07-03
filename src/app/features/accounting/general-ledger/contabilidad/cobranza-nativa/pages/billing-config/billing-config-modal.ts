import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";

// Custom Inputs
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";

// Services
import { WebButtonLabel } from "src/app/core/components/buttons/web-label";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { UpsertBillingConfigDTO } from "../../models/billing-config.dto";
import { EBillingMode } from "../../models/enums";

@Component({
  selector: "app-billing-config-modal",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WebButtonLabel,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
  templateUrl: "./billing-config-modal.html",
})
export default class BillingConfigModal implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);
  private enumSelectS = inject(EnumSelectService);

  form!: FormGroup;
  customerId: string = "";
  isLoading = false;
  submitting = signal(false);
  billingModeOptions = signal<ISelectItem[]>([]);

  constructor() {
    this.enumSelectS
      .billingMode()
      .subscribe((opts) => this.billingModeOptions.set(opts));
  }

  ngOnInit(): void {
    this.customerId = this.config.data?.customerId;
    this.buildForm();
    if (this.customerId) {
      this.loadData();
    }
  }

  buildForm() {
    this.form = this.fb.group({
      billingMode: [EBillingMode.Native, Validators.required],
      defaultDueDays: [10, [Validators.required, Validators.min(0)]],
      graceDays: [0, [Validators.required, Validators.min(0)]],
      globalLateFeePercentage: [null, [Validators.min(0), Validators.max(100)]],
    });
  }

  async loadData() {
    this.isLoading = true;
    const result = await this.apiResponseS.onGetItem<any>(
      Endpoints.AccountingCoi.NativeCollection.BillingConfig.customer(
        this.customerId,
      ),
    );
    this.isLoading = false;
    if (result) {
      this.form.patchValue({
        billingMode: result.billingMode,
        defaultDueDays: result.defaultDueDays,
        graceDays: result.graceDays,
        globalLateFeePercentage: result.globalLateFeePercentage,
      });
    }
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.AccountingCoi.NativeCollection.BillingConfig.save,
      method: "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (value) =>
        ({
          customerId: this.customerId,
          billingMode: value.billingMode,
          defaultDueDays: value.defaultDueDays,
          graceDays: value.graceDays,
          globalLateFeePercentage: value.globalLateFeePercentage,
        }) as UpsertBillingConfigDTO,
    });
  }

  onClose() {
    this.ref.close(false);
  }
}
