import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { PaymentMethodAddOrEditDto } from "./models/payment-method-add-or-edit.dto";
interface IPaymentMethodForm {
  id: FormControl<string | null>;
  codigo: FormControl<string>;
  descripcion: FormControl<string>;
  applicationUserId: FormControl<string | null>;
}

@Component({
  selector: "app-payment-method-form",
  templateUrl: "./payment-method-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, CustomInputTextSignal, WebButtonLabelSave],
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
    this.apiResponseS
      .onGetItem<PaymentMethodAddOrEditDto>(
        Endpoints.PaymentMethods.getById(this.id),
      )
      .then((result) => {
        if (result) this.form.patchValue(result as any);
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
