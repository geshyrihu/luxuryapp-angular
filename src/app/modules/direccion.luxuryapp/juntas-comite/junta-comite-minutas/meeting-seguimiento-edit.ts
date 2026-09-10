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
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";

@Component({
  selector: "app-meeting-seguimiento-edit",
  templateUrl: "./meeting-seguimiento-edit.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class MeetingSeguimientoEdit implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  submitting = signal(false);

  id: string = "";

  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    meetingDetailsId: new FormControl<number>(
      this.config.data.meetingDetailsId,
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    fecha: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    seguimiento: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(250)],
    }),
    applicationUserId: new FormControl<string>(this.authS.applicationUserId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data.idMeetingSeguimiento;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.MeetingDetailsTracking.getById(this.id))
      .then((result: any) => {
        result.fecha = this.dateS.getDateFormat(result.fecha);
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.id = this.config.data.idMeetingSeguimiento;

    this.submitting.set(true);

    const payload = {
      ...this.form.value,
      fecha: this.dateS.getDateFormat(this.form.value.fecha as any),
    };

    if (!this.id) {
      this.apiResponseS
        .onPost(Endpoints.MeetingDetailsTracking.base, payload)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(Endpoints.MeetingDetailsTracking.update(this.id), payload)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}
