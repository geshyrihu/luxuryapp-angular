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
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { IPaymentMethodAddOrEditDTO, IPaymentMethodDTO } from "../models/payment-method.dto";

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
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    if (!this.id) {
      this.apiResponseS
        .onPost<IPaymentMethodDTO>(Endpoints.PaymentMethods.create, this.form.value)
        .then((result) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut<IPaymentMethodDTO>(Endpoints.PaymentMethods.update(this.id), this.form.value)
        .then((result) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}









