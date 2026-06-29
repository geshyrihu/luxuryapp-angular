import { DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/web/inputs/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/web/inputs/custom-input-textarea-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";

@Component({
  selector: "app-elevators-emergency-call-form",
  templateUrl: "./elevators-emergency-call-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
    CardModule,
  ],
})
export class ElevatorsEmergencyCallForm implements OnInit {
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
    folio: ["", [Validators.required]],
    customerId: [this.config.data.customerId, [Validators.required]],
    machineryId: [null as number | null, [Validators.required]],
    requestDate: ["", [Validators.required]],
    report: ["", [Validators.required]],
    request: [""],
    personWhoReports: ["", [Validators.required]],
    technicianWhoAttended: [""],
  });

  ngOnInit(): void {
    this.onLoadDataElevators();
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();
  }

  onLoadData() {
    const urlApi = `ElevatorsEmergencyCall/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      const requestDate = this.dateS.getDateFormat(result.requestDate);
      result.requestDate = requestDate;
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
      endpoint: "ElevatorsEmergencyCall",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const formValue = { ...this.form.getRawValue() };
        formValue.requestDate = this.datePipe.transform(
          this.form.value.requestDate,
          "yyyy-MM-dd",
        );
        return formValue;
      },
    });
  }
}

