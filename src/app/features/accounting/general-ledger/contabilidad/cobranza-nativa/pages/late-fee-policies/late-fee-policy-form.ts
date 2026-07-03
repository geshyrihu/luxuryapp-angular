import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ELateFeeType } from "../../models/enums";
import {
  CreateLateFeePolicyDTO,
  UpdateLateFeePolicyDTO,
} from "../../models/late-fee-policy.dto";

import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputDecimal } from "src/app/core/components/inputs/web/custom-input-decimal-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";

interface ILateFeePolicyForm {
  graceDays: FormControl<number>;
  type: FormControl<ELateFeeType>;
  rate: FormControl<number>;
  maxRate: FormControl<number>;
  compoundsMonthly: FormControl<boolean>;
}

@Component({
  selector: "app-late-fee-policy-form",
  imports: [
    ReactiveFormsModule,
    CustomInputNumberSignal,
    CustomInputDecimal,
    CustomInputSelectSignal,
    CustomInputCheckSignal,
    WebButtonLabelSave,
  ],
  templateUrl: "./late-fee-policy-form.html",
})
export class LateFeePolicyForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  id: string = "";
  customerId: string = "";
  submitting = signal(false);

  form = new FormGroup<ILateFeePolicyForm>({
    graceDays: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    type: new FormControl(ELateFeeType.Porcentaje, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rate: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    maxRate: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    compoundsMonthly: new FormControl(false, { nonNullable: true }),
  });

  typeOptions = [
    { label: "Monto Fijo", value: ELateFeeType.Fijo },
    { label: "Porcentaje", value: ELateFeeType.Porcentaje },
  ];

  ngOnInit() {
    this.id = this.config.data.id;
    this.customerId = this.config.data.customerId;
    if (this.id) this.loadData();
  }

  async loadData() {
    const res = await this.apiResponseS.onGetItem<any>(
      Endpoints.AccountingCoi.NativeCollection.LateFeePolicies.getById(this.id),
    );
    if (res) this.form.patchValue(res);
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.AccountingCoi.NativeCollection.LateFeePolicies.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const raw = this.form.getRawValue();
        return this.id
          ? ({ id: this.id, ...raw } as UpdateLateFeePolicyDTO)
          : ({ customerId: this.customerId, ...raw } as CreateLateFeePolicyDTO);
      },
    });
  }
}
