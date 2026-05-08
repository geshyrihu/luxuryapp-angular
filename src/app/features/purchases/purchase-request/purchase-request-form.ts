import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-purchase-request-form",
  templateUrl: "./purchase-request-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
  ],
})
export class PurchaseRequestForm implements OnInit {
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  id: string = "";
  submitting = signal(false);
  cb_status: ISelectItem[] = [];

  // Tipado Estricto
  form = this.formB.nonNullable.group({
    id: [{ value: "", disabled: true }],
    requestedBy: ["", [Validators.required, Validators.maxLength(100)]],
    area: ["", [Validators.required, Validators.maxLength(100)]],
    expenseJustification: [
      "",
      [Validators.required, Validators.maxLength(100)],
    ],
    customerId: [this.customerIdS.customerId(), [Validators.required]],
    status: [3, [Validators.required]],
  });

  ngOnInit(): void {
    this.onLoadEnumSelectItem();
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();

    // Sincronizar ID
    this.form.controls.id.setValue(this.id);
  }
  onLoadData() {
    const urlApi = `purchaserequest/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onLoadEnumSelectItem() {
    const urlApi = `EPurchaseRequestStatus`;
    this.apiResponseS.onGetEnumSelectItem(urlApi).then((result: any) => {
      this.cb_status = result;
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    const formValue = this.form.getRawValue();

    if (this.id === "") {
      this.apiResponseS
        .onPost(`purchaserequest`, formValue)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`purchaserequest/${this.id}`, formValue)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}
