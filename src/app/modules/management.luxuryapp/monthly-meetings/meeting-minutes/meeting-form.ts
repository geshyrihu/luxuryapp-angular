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
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DateService } from "@core/services/date.service";
import { EnumSelectService } from "@core/services/enum-select.service";
import { AdministrationFormList } from "./administration-form-list";
import { ComiteForm } from "./comite-form";
import { InvitedForm } from "./invited-form";

interface IMeetingForm {
  id: FormControl<string | null>;
  date: FormControl<string>;
  time: FormControl<string>;
  typeMeeting: FormControl<number | null>;
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
    typeMeeting: [null as number | null, Validators.required],
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

