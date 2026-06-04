import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";

interface IRescheduleForm {
  meetingDate: FormControl<Date | string | null>;
  startTime: FormControl<string>;
  endTime: FormControl<string>;
  modality: FormControl<number | null>;
  location: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: "app-junta-mensual-session-reschedule-form",
  templateUrl: "./junta-mensual-session-reschedule-form.html",
  imports: [
    ReactiveFormsModule,
    CustomButtonSave,
    CustomInputDateSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
  ],
})
export class JuntaMensualSessionRescheduleForm implements OnInit {
  private readonly formB = inject(FormBuilder);
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly dateS = inject(DateService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly submitting = signal(false);
  readonly id = signal<string>("");

  readonly form: FormGroup<IRescheduleForm> = this.formB.group({
    meetingDate: [null as Date | string | null, Validators.required],
    startTime: ["", Validators.required],
    endTime: ["", Validators.required],
    modality: [0 as number | null, Validators.required],
    location: [""],
    description: [""],
  });

  ngOnInit(): void {
    const detail = this.config.data.detail;
    this.id.set(detail.id);

    const start = this.parseBusinessDateTime(
      detail.agenda?.startAt ?? detail.scheduledAt,
    );
    const end = this.parseBusinessDateTime(
      detail.agenda?.endAt ?? detail.scheduledEndAt,
    );

    if (!start || !end) {
      return;
    }

    this.form.patchValue({
      meetingDate: start,
      startTime: this.toTimeValue(start),
      endTime: this.toTimeValue(end),
      modality: detail.modality,
      location: detail.location ?? "",
      description: detail.agenda?.description ?? "",
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    const raw = this.form.getRawValue();
    const startAt = this.combineDateAndTime(raw.meetingDate, raw.startTime);
    const endAt = this.combineDateAndTime(raw.meetingDate, raw.endTime);

    if (!startAt || !endAt) return;

    this.submitting.set(true);
    this.apiResponseS
      .onPut(
        `JuntaMensualSession/${this.id()}/reschedule`,
        {
          startAt,
          endAt,
          modality: raw.modality,
          location: raw.location ?? "",
          description: raw.description ?? "",
        },
      )
      .then((result) => {
        if (result) {
          this.ref.close(true);
          return;
        }

        this.submitting.set(false);
      });
  }

  private toTimeValue(date: Date) {
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  private combineDateAndTime(
    dateValue: Date | string | null,
    timeValue: string | null,
  ) {
    if (!dateValue || !timeValue) return null;

    const date =
      dateValue instanceof Date
        ? dateValue
        : this.dateS.parseDate(dateValue) || new Date(`${dateValue}T00:00:00`);
    const [hours, minutes] = timeValue.split(":").map(Number);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hh = `${hours}`.padStart(2, "0");
    const mm = `${minutes}`.padStart(2, "0");

    return `${year}-${month}-${day}T${hh}:${mm}:00`;
  }

  private parseBusinessDateTime(value: string | Date | null | undefined) {
    if (!value) return null;

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    const normalized = `${value}`.trim();
    const match = normalized.match(
      /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/,
    );

    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second ?? "0"),
      );
    }

    const parsed = new Date(normalized);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
}
