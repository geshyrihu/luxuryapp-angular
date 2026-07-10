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
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";

@Component({
  selector: "app-aspel-customer-empresa-form",
  templateUrl: "./aspel-customer-empresa-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    WebButtonLabelSave,
  ],
})
export class AspelCustomerEmpresaForm implements OnInit {
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  apiResponseS = inject(ApiResponseService);

  submitting = signal(false);
  id: string = "";
  cb_customer = signal<ISelectItem[]>([]);

  form: FormGroup = this.formBuilder.group({
    customerId: ["", Validators.required],
    customerIdAspelId: [
      "",
      [Validators.required, Validators.pattern("^[0-9]*$")],
    ],
    empresa: ["", Validators.required],
  });

  ngOnInit() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.customersActive)
      .then((response: any) => {
        this.cb_customer.set(response);
      });

    this.id = this.config.data.id;
    if (this.id) {
      this.form.patchValue(this.config.data);
    } else {
      // For create, we might pre-fill the customer if it's in the context
      if (this.config.data.customerId) {
        this.form.patchValue({ customerId: this.config.data.customerId });
      }
    }
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.AspelCustomerEmpresa.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
