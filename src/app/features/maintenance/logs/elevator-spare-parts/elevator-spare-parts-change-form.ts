import { DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/web/inputs/custom-input-date-signal";
import { CustomInputNumberSignal } from "src/app/core/components/web/inputs/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/web/inputs/custom-input-textarea-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";

@Component({
  selector: "app-elevator-spare-parts-change-form",
  templateUrl: "./elevator-spare-parts-change-form.html",
  imports: [
    ReactiveFormsModule,
    CustomButtonSave,
    CustomInputDateSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CardModule,
  ],
})
export class ElevatorSparePartsChangeForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  datePipe = inject(DatePipe);
  dateS = inject(DateService);
  ref = inject(DynamicDialogRef);

  cb_elevators = signal<ISelectItem[]>([]);

  id: string = "";

  submitting = signal(false);

  form = this.formB.nonNullable.group({
    id: [{ value: "", disabled: true }],
    folio: [""],
    customerId: [this.config.data.customerId, [Validators.required]],
    machineryId: [null as number | null, [Validators.required]],
    changeDate: ["", [Validators.required]],
    failure: ["", [Validators.required]],
    partName: ["", [Validators.required]],
    partKey: ["", [Validators.required]],
    price: [null as number | null, [Validators.required]],
    supervised: ["", [Validators.required]],
  });

  ngOnInit(): void {
    this.onLoadDataElevators();
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();
  }

  onLoadData() {
    const urlApi = `elevatorsparepartschange/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      const changeDate = this.dateS.getDateFormat(result.changeDate);
      result.changeDate = changeDate;
      this.form.patchValue(result);
    });
  }

  onLoadDataElevators() {
    const urlApi = `elevatorsparepartschange/elevators/${this.config.data.customerId}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.cb_elevators.set(result);
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "elevatorsparepartschange",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const formValue = { ...this.form.getRawValue() };
        formValue.changeDate = this.datePipe.transform(
          this.form.value.changeDate,
          "yyyy-MM-dd",
        );
        return formValue;
      },
    });
  }
}

