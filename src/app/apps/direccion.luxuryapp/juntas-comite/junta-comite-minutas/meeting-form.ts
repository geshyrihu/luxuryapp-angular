import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTime } from "@ui/inputs/web/custom-input-time-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { AdministrationFormList } from "./administration-form-list";
import { ComiteForm } from "./comite-form";
import { InvitedForm } from "./invited-form";

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputTime,
    CustomInputSelectSignal,
    WebButtonLabelSave,
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
  cb_typeMeeting = signal<SelectItemDto[]>([]);

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
    this.enumSelectS.typeMeeting().subscribe((result: SelectItemDto[]) => {
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
      transformPayload: () => payload,
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
    this.apiResponseS
      .onGetItem(Endpoints.Meetings.getById(this.id))
      .then((result: any) => {
        result.time = this.normalizeTime(result.time);
        this.form.patchValue(result);
      });
  }
}
