import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DateService } from "src/app/core/services/date.service";

interface IAgendaSupervisionForm {
  id: FormControl<string | null>;
  fechaSolicitud: FormControl<Date | string | null>;
  customerId: FormControl<string | null>;
  problema: FormControl<string>;
  solucion: FormControl<string>;
  fechaConclusion: FormControl<Date | string | null>;
  applicationUserId: FormControl<string | null>;
}

@Component({
  selector: "app-agenda-supervision-form",
  templateUrl: "./agenda-supervision-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
  ],
})
export class AgendaSupervisionForm implements OnInit {
  private authS = inject(AuthService);
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private dateS = inject(DateService);
  submitting = signal(false);

  id: string = "";

  cb_customer = signal<ISelectItem[]>([]);
  rangeDates: Date[];

  form: FormGroup<IAgendaSupervisionForm> = this.formB.group({
    id: [""],
    fechaSolicitud: [
      this.dateS.getDateNow() as Date | string | null,
      Validators.required,
    ],
    customerId: [
      this.authS.userToken.infoUserAuthDTO.customerId,
      Validators.required,
    ],
    problema: ["", Validators.required],
    solucion: [""],
    fechaConclusion: [null],
    applicationUserId: [this.authS.applicationUserId],
  });

  onLoadSelectItem() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(`customers-active`)
      .then((response: any) => {
        this.cb_customer.set(response);
      });
  }

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.onLoadSelectItem();
    if (this.id) this.onLoadData();

    this.form.controls.id.setValue(this.id);
  }

  onLoadData() {
    const urlApi = `AgendaSupervision/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      // Date handling might need adjustment if getDateFormat returns string
      // But CustomInputDateSignal expects Date object or compatible string.
      // DateService.getDateFormat likely returns string "yyyy-MM-dd".
      // Typed form expects Date|null if defined as such, or string if defined as string.
      // Initial value for fechaSolicitud is Date.

      const data = {
        ...result,
        fechaConclusion: this.dateS.getDateFormat(result.fechaConclusion),
        fechaSolicitud: this.dateS.getDateFormat(result.fechaSolicitud),
      };
      this.form.patchValue(data);
    });
  }

  submit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "AgendaSupervision",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => ({
        ...this.form.getRawValue(),
        fechaSolicitud: this.dateS.getDateFormat(
          this.form.controls.fechaSolicitud.value,
        ),
        fechaConclusion: this.dateS.getDateFormat(
          this.form.controls.fechaConclusion.value,
        ),
      }),
    });
  }
}
