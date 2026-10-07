import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { EndpointsReclutamiento } from "@core/constants/endpoints/reclutamiento.endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
@Component({
  selector: "app-status-request-dismissal-discount-form",
  templateUrl: "./status-request-dismissal-discount-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    LuxInputTextSignal,
    LuxInputNumberSignal,
    ButtonWeb,
  ],
})
export class StatusRequestDismissalDiscountForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  submitting = signal(false);

  id: string = "";

  form = this.formB.nonNullable.group({
    id: [{ value: this.id, disabled: true }],
    requestBajaId: ["", Validators.required],
    description: ["", Validators.required],
    discount: [0, Validators.required], // Assumed number
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }
  onLoadData() {
    const urlApi = EndpointsReclutamiento.RequestDismissalDiscount.getById(
      this.id,
    );
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: EndpointsReclutamiento.RequestDismissalDiscount.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }
}
