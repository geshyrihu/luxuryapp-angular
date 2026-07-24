import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DateService } from "src/app/core/services/date.service";

@Component({
  selector: "app-elevators-emergency-call-form",
  templateUrl: "./elevators-emergency-call-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class ElevatorsEmergencyCallForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  datePipe = inject(DatePipe);
  dateS = inject(DateService);
  ref = inject(DynamicDialogRef);

  cb_elevators = signal<SelectItemDto[]>([]);

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
    const urlApi = Endpoints.RefactorMantenimiento.elevatorsEmergencyCallById(
      this.id,
    );
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      const requestDate = this.dateS.getDateFormat(result.requestDate);
      result.requestDate = requestDate;
      this.form.patchValue(result);
    });
  }

  onLoadDataElevators() {
    const urlApi =
      Endpoints.RefactorMantenimiento.elevatorsparepartschangeElevatorsById(
        this.config.data.customerId,
      );
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.cb_elevators.set(result);
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "elevators-emergency-call",
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
