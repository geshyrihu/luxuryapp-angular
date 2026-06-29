import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/web/inputs/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { CustomInputTime } from "src/app/core/components/web/inputs/custom-input-time-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { AdministrationFormList } from "./administration-form-list";
import { ComiteForm } from "./comite-form";
import { InvitedForm } from "./invited-form";
import { FormHelper } from "src/app/core/helpers/form-helper";

interface IMeetingForm {
  id: FormControl<string | null>;
  date: FormControl<string>;
  time: FormControl<string>;
  eTypeMeeting: FormControl<number | null>;
  customerId: FormControl<string | null>;
  applicationUserId: FormControl<string | null>;
  presentacionJuntaComiteId: FormControl<string | null>;
  juntaMensualSessionId: FormControl<string | null>;
}

@Component({
  selector: "app-meeting-form",
  templateUrl: "./meeting-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputTime,
    CustomInputSelectSignal,
    CustomButtonSave,
    ComiteForm,
    InvitedForm,
    AdministrationFormList,
  ],
})
export class MeetingForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customToastS = inject(CustomToastService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  dateS = inject(DateService);
  formB = inject(FormBuilder);
  customerId = this.config.data.customerId;

  dateNow = new Date().toISOString().slice(0, 10);
  id: string = "";
  participantInvitado: any[] = [];
  cb_typeMeeting = signal<ISelectItem[]>([]);

  form: FormGroup<IMeetingForm> = this.formB.group({
    id: [""],
    date: [this.dateNow, Validators.required],
    time: [""],
    eTypeMeeting: [null as number | null, Validators.required],
    customerId: [this.customerId],
    applicationUserId: [this.authS.applicationUserId],
    presentacionJuntaComiteId: [null],
    juntaMensualSessionId: [this.config.data?.juntaMensualSessionId ?? null],
  });

  submitting = signal(false);

  private normalizeTime(value: string | null | undefined): string {
    return value ? value.slice(0, 5) : "";
  }

  ngOnInit() {
    this.enumSelectS.typeMeeting().subscribe((result: ISelectItem[]) => {
      this.cb_typeMeeting.set(result);
    });

    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  async onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    if (
      !this.id &&
      this.form.controls.eTypeMeeting.value !== 2 &&
      !this.form.controls.juntaMensualSessionId.value
    ) {
      this.customToastS.showInfo(
        "Alta desde agenda",
        "Las minutas de comite y asamblea ya no pueden crearse directamente aqui. Primero registra la agenda de la junta para generar la sesion mensual y, desde ella, la minuta vinculada.",
      );
      return;
    }

    const formValue = this.form.getRawValue();
    const payload = {
      ...formValue,
      date: this.dateS.getDateFormat(formValue.date) ?? "",
      time: formValue.time || null,
    };

    if (!this.id) {
      delete (payload as any).id;
    }

    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Meetings.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: () => payload
    });

    if (result) {
      if (!this.id && result.id) {
        this.id = result.id;
        this.form.controls.id.setValue(this.id);
      }
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS.onGetItem(Endpoints.Meetings.getById(this.id)).then((result: any) => {
      result.time = this.normalizeTime(result.time);
      this.form.patchValue(result);
    });
  }
}

