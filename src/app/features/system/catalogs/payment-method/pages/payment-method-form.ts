import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { IPaymentMethodAddOrEditDTO } from "../models/payment-method.dto";

interface IPaymentMethodForm {
  id: FormControl<string | null>;
  codigo: FormControl<string>;
  descripcion: FormControl<string>;
  applicationUserId: FormControl<string | null>;
}

@Component({
  selector: "app-payment-method-form",
  templateUrl: "./payment-method-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomButtonSave,
    CardModule,
  ],
})
export class PaymentMethodForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  private authS = inject(AuthService);
  submitting = signal(false);

  id: string = "";
  form: FormGroup<IPaymentMethodForm>;

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.form = this.formB.group({
      id: new FormControl({ value: this.id, disabled: true }),
      codigo: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      descripcion: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      applicationUserId: new FormControl<string | null>(
        this.authS.userToken.infoUserAuthDTO.applicationUserId,
      ),
    });
    if (this.id) {
      this.onLoadItem();
    }
  }

  onLoadItem() {
    this.apiResponseS.onGetItem<IPaymentMethodAddOrEditDTO>(Endpoints.PaymentMethods.getById(this.id)).then((result) => {
      if(result) this.form.patchValue(result as any);
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.PaymentMethods.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}










