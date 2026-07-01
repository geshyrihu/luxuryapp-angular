import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

@Component({
  selector: "app-fire-inspection-period-form",
  templateUrl: "./fire-inspection-period-form.html",
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputCheckSignal,
  ],
})
export class FireInspectionPeriodForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private customerIdS = inject(CustomerIdService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private formB = inject(FormBuilder);
  private enumSelectS = inject(EnumSelectService);
  private dateS = inject(DateService);

  id = "";
  submitting = signal(false);
  cb_recurrences = signal<ISelectItem[]>([]);

  form = this.formB.group({
    customerId: [this.customerIdS.customerId(), Validators.required],
    name: ["", [Validators.required, Validators.maxLength(150)]],
    description: [""],
    startDate: [this.dateS.getDateNow() as any, Validators.required],
    frecuencia: [null as any, Validators.required],
    isActive: [true],
    applicationUserId: [this.authS.applicationUserId],
  });

  async ngOnInit() {
    this.id = this.config.data?.id ?? "";
    this.cb_recurrences.set(
      await firstValueFrom(this.enumSelectS.recurrence()),
    );
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`FireInspectionPeriod/${this.id}`)
      .then((result: any) => {
        this.form.patchValue({
          ...result,
          startDate: new Date(result.startDate),
        });
      });
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "FireInspectionPeriod",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      closeOnSuccess: true,
      transformPayload: () => ({
        ...this.form.getRawValue(),
        startDate: this.dateS.getDateFormat(this.form.value.startDate),
      }),
    });
  }
}
