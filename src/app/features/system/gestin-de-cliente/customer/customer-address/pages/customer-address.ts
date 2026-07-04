import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ICustomerAddressAddOrEditDTO } from "../../models/customer.dto";

@Component({
  selector: "app-customer-address",
  templateUrl: "./customer-address.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class CustomerAddress implements OnInit {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  apiResponseS = inject(ApiResponseService);

  customerId: string = "";
  submitting = signal(false);

  form = new FormGroup({
    id: new FormControl<number | null>(null),
    customerId: new FormControl<number | string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    additionalDetails: new FormControl<string>(""),
    city: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    district: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    country: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    latitud: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    longitud: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    number: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    postalCode: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    street: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    townHall: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    unitNumber: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    this.customerId = this.config.data.customerId;
    if (this.customerId) {
      this.form.controls.customerId.setValue(this.customerId);
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<ICustomerAddressAddOrEditDTO>(
        Endpoints.CustomerAddresses.getByCustomerId(this.customerId),
      )
      .then((result) => {
        if (result) {
          this.form.patchValue(result as any);
        }
      });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    this.apiResponseS
      .onPut<ICustomerAddressAddOrEditDTO>(
        Endpoints.CustomerAddresses.update,
        this.form.value,
      )
      .then((result) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
