import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { InputSelectBool } from "@ui/inputs/adaptive/input-select-bool/input-select-bool";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { EndpointsAdmin } from "src/app/core/constants/endpoints/admin.endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomerLocationAddOrEditDTO } from "./interfaces/customer-location-add-or-edit.dto";
import { CustomerLocationType, CustomerLocationTypeOptions } from "./interfaces/customer-location-type.enum";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

@Component({
  selector: "app-customer-location-form",
  templateUrl: "./customer-location-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputMask,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputSelectSignal,
    InputSelectBool,
    WebButtonLabelSave,
  ],
})
export class CustomerLocationForm implements OnInit {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  apiResponseS = inject(ApiResponseService);

  customerId: string = "";
  id: string = "";
  submitting = signal(false);

  locationTypeOptions: SelectItemDto[] = CustomerLocationTypeOptions.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  form = new FormGroup({
    id: new FormControl<string | null>(null),
    customerId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    locationType: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phoneOne: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(15)],
    }),
    phoneTwo: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(15)],
    }),
    contactName: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(100)],
    }),
    notes: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(500)],
    }),
    sortOrder: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.min(0)],
    }),
    isActive: new FormControl<boolean>(true, {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.customerId = this.config.data.customerId;
    this.id = this.config.data.id ?? "";

    if (this.customerId) {
      this.form.controls.customerId.setValue(this.customerId);
    }
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<CustomerLocationAddOrEditDTO>(
        EndpointsAdmin.CustomerLocations.getById(this.id),
      )
      .then((result) => {
        if (result) {
          this.form.patchValue(result);
        }
      });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    const payload = this.form.getRawValue() as CustomerLocationAddOrEditDTO;
    const endpoint = !this.id
      ? EndpointsAdmin.CustomerLocations.create
      : EndpointsAdmin.CustomerLocations.update(this.id);
    const method = !this.id ? "POST" : "PUT";

    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint,
      method,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => payload,
    });
  }
}
