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
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputNumberSignal } from "@ui/inputs/web/lux-input-number-signal";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";

@Component({
  selector: "app-aspel-customer-empresa-form",
  templateUrl: "./aspel-customer-empresa-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    LuxInputSelectSignal,
    LuxInputNumberSignal,
    ButtonWeb,
  ],
})
export class AspelCustomerEmpresaForm implements OnInit {
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  apiResponseS = inject(ApiResponseService);

  submitting = signal(false);
  id: string = "";
  cb_customer = signal<SelectItemDto[]>([]);

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
      .onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.customersActive)
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
