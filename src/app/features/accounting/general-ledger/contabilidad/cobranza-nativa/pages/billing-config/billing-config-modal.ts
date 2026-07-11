import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";

// Custom Inputs
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";

// Services
import { WebButtonLabel } from "@ui/buttons/web-label";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { UpsertBillingConfigDTO } from "../../models/billing-config.dto";
import { EBillingMode } from "../../models/enums";
import { SaveNativeCollectionNotificationSettingsDTO } from "../../models/notification-settings.dto";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-billing-config-modal",
  imports: [
    AppIcon,
    CommonModule,
    ReactiveFormsModule,
    WebButtonLabel,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputSwitch,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
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
      isEmailEnabled: [true, Validators.required],
      isPushNotificationEnabled: [true, Validators.required],
    });
  }

  async loadData() {
    this.isLoading = true;
    const billingConfig = await this.apiResponseS.onGetItem<any>(
      Endpoints.AccountingCoi.NativeCollection.BillingConfig.customer(
        this.customerId,
      ),
    );
    const notificationSettings = await this.apiResponseS.onGetItem<any>(
      Endpoints.AccountingCoi.NativeCollection.NotificationSettings.byCustomer(
        this.customerId,
      ),
    );
    this.isLoading = false;

    if (billingConfig) {
      this.form.patchValue({
        billingMode: billingConfig.billingMode,
        defaultDueDays: billingConfig.defaultDueDays,
        graceDays: billingConfig.graceDays,
        globalLateFeePercentage: billingConfig.globalLateFeePercentage,
      });
    }

    if (notificationSettings) {
      this.form.patchValue({
        isEmailEnabled: notificationSettings.isEmailEnabled,
        isPushNotificationEnabled:
          notificationSettings.isPushNotificationEnabled,
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    try {
      const value = this.form.getRawValue();

      const billingPayload = {
        customerId: this.customerId,
        billingMode: value.billingMode,
        defaultDueDays: value.defaultDueDays,
        graceDays: value.graceDays,
        globalLateFeePercentage: value.globalLateFeePercentage,
      } as UpsertBillingConfigDTO;

      const notificationPayload = {
        customerId: this.customerId,
        isEmailEnabled: value.isEmailEnabled,
        isPushNotificationEnabled: value.isPushNotificationEnabled,
      } as SaveNativeCollectionNotificationSettingsDTO;

      const billingResult = await this.apiResponseS.onPost(
        Endpoints.AccountingCoi.NativeCollection.BillingConfig.save,
        billingPayload,
      );

      if (!billingResult) {
        return;
      }

      const notificationResult = await this.apiResponseS.onPost(
        Endpoints.AccountingCoi.NativeCollection.NotificationSettings.save,
        notificationPayload,
      );

      if (!notificationResult) {
        return;
      }

      this.ref.close(true);
    } finally {
      this.submitting.set(false);
    }
  }

  onClose() {
    this.ref.close(false);
  }
}
