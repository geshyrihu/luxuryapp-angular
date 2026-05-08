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

interface IPaymentTypeForm {
  id: FormControl<string | null>;
  codigo: FormControl<string>;
  descripcion: FormControl<string>;
  applicationUserId: FormControl<string | null>;
}

@Component({
  selector: "app-payment-type-form",
  templateUrl: "./payment-type-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomButtonSave,
    CardModule,
  ],
})
export class PaymentTypeForm implements OnInit {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);

  id: string = "";
  form: FormGroup<IPaymentTypeForm>;

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
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS.onGetItem(`MetodoPago/${this.id}`).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    if (!this.id) {
      this.apiResponseS
        .onPost(`MetodoPago`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`MetodoPago/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}









