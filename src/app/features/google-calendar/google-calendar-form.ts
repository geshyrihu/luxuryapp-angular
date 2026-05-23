import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { SelectModule } from "primeng/select";
import { firstValueFrom } from "rxjs";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ERecurrence } from "src/app/core/enums/e-recurrence.enum";
import { EGoogleCalendarRecurrenceMode } from "src/app/core/enums/google-calendar-recurrence-mode.enum";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { CustomInputDateSignal } from "../../core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "../../core/components/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "../../core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "../../core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "../../core/components/inputs/web/custom-input-textarea-signal";

interface IGoogleCalendarGuestForm {
  id: FormControl<string | null>;
  name: FormControl<string>;
  email: FormControl<string>;
}

interface IGoogleCalendarEventListItem {
  id: string;
  customerId: string;
  title: string;
  startAt: string;
  endAt: string;
}

interface IGoogleCalendarEventDetail {
  id: string;
  customerId: string;
  subjectType: number;
  modality: number;
  startAt: string;
  endAt: string;
  description: string;
  location: string;
  isRecurring: boolean;
  recurrence: number | null;
  recurrenceMode: number | null;
  recurrenceEndDate: string | null;
  recurrenceSummary: string;
  guests: Array<{ id?: string; name?: string; email?: string }>;
}

interface IOptionShortcut {
  label: string;
  value: number;
  description: string;
}

interface IGoogleCalendarEventForm {
  customerId: FormControl<string>;
  subjectType: FormControl<number | null>;
  modality: FormControl<number | null>;
  meetingDate: FormControl<Date | string | null>;
  startTime: FormControl<string>;
  isRecurring: FormControl<boolean>;
  recurrence: FormControl<number | null>;
  recurrenceMode: FormControl<number | null>;
  recurrenceEndDate: FormControl<Date | string | null>;
  description: FormControl<string>;
  location: FormControl<string>;
  guests: FormArray<FormGroup<IGoogleCalendarGuestForm>>;
}

@Component({
  selector: "app-google-calendar-form",
  templateUrl: "./google-calendar-form.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    CustomButtonSave,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputSwitch,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
  ],
})
export class GoogleCalendarForm implements OnInit {
  private static readonly MeetingDurationMinutes = 90;
  private static readonly StartTimeBlockingWindowMinutes = 60;

  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly aspRoleS = inject(AspRoleService);
  private readonly enumSelectS = inject(EnumSelectService);

  readonly submitting = signal(false);
  readonly id = signal<string | null>(null);
  readonly recurrenceOptions = signal<ISelectItem[]>([]);
  readonly recurrenceModeOptions = signal<ISelectItem[]>([
    {
      label: "Mismo dia del mes",
      value: EGoogleCalendarRecurrenceMode.DayOfMonth,
    },
    {
      label: "Mismo martes/tercer martes del mes",
      value: EGoogleCalendarRecurrenceMode.OrdinalWeekday,
    },
  ]);
  readonly meetingDurationMinutes = signal(
    GoogleCalendarForm.MeetingDurationMinutes,
  );
  readonly canOverrideScheduleConflicts = this.aspRoleS.anyOf([
    EApplicationRole.SuperUsuario,
  ]);
  readonly isEditMode = computed(() => !!this.id());
  readonly subjectTypeOptions = signal<IOptionShortcut[]>([
    {
      label: "JCM",
      value: 0,
      description: "Junta de comite mensual",
    },
    {
      label: "ASAM",
      value: 1,
      description: "Asamblea",
    },
    {
      label: "JLUX",
      value: 2,
      description: "Junta interna con areas del grupo Luxury",
    },
    {
      label: "JINT",
      value: 3,
      description: "Junta con proveedores y otros asuntos",
    },
  ]);
  readonly modalityOptions = signal<IOptionShortcut[]>([
    {
      label: "VIR",
      value: 0,
      description: "Virtual",
    },
    {
      label: "PRE",
      value: 1,
      description: "Presencial",
    },
  ]);
  readonly timeSlotOptions = signal(this.buildTimeSlotOptions());
  readonly dateEvents = signal<IGoogleCalendarEventListItem[]>([]);
  readonly selectedDate = signal<Date | null>(null);
  readonly selectedStartTime = signal<string>("");
  readonly loadingDateAvailability = signal(false);
  readonly isStartTimeDisabled = computed(
    () =>
      !this.selectedDate() ||
      this.loadingDateAvailability() ||
      this.form.controls.startTime.disabled,
  );
  readonly recurrencePreview = computed(() => this.buildRecurrencePreview());
  readonly computedEndTimeLabel = computed(() => {
    const endTime = this.getEndTimeForStart(this.form.controls.startTime.value);
    return endTime ? this.toDisplayTime(endTime) : "";
  });
  readonly startTimeOptions = computed(() =>
    this.timeSlotOptions().map((slot) => {
      const computedEndTime = this.getEndTimeForStart(slot.value);
      const conflicts = computedEndTime
        ? this.getConflictsForSlot(slot.value, computedEndTime)
        : [];
      const blocked = !computedEndTime || conflicts.length > 0;
      return {
        ...slot,
        disabled: blocked && !this.canOverrideScheduleConflicts(),
        conflictCount: conflicts.length,
      };
    }),
  );

  readonly form = new FormGroup<IGoogleCalendarEventForm>({
    customerId: new FormControl(this.config.data.customerId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    subjectType: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    modality: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    meetingDate: new FormControl<Date | string | null>(null, {
      validators: [Validators.required],
    }),
    startTime: new FormControl(
      { value: "", disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    isRecurring: new FormControl(false, {
      nonNullable: true,
    }),
    recurrence: new FormControl<number | null>(null),
    recurrenceMode: new FormControl<number | null>(null),
    recurrenceEndDate: new FormControl<Date | string | null>(null),
    description: new FormControl("", { nonNullable: true }),
    location: new FormControl("", { nonNullable: true }),
    guests: new FormArray<FormGroup<IGoogleCalendarGuestForm>>([]),
  });

  get guestsArray(): FormArray<FormGroup<IGoogleCalendarGuestForm>> {
    return this.form.controls.guests;
  }

  get overlapConflicts(): string[] {
    return this.form.errors?.["overlappingSchedule"] ?? [];
  }

  async ngOnInit() {
    this.id.set(this.config.data.id ?? null);
    this.form.addValidators(() => this.validateScheduleRules());

    await this.loadRecurrenceOptions();
    this.setupScheduleValidationRefresh();
    this.setupRecurringStateRefresh();

    if (this.id()) {
      await this.onLoadData();
    } else {
      this.addGuest();
      this.applyRecurringState(false, false);
    }

    if (this.isEditMode()) {
      this.lockRecurrenceConfiguration();
    }
  }

  async onLoadData() {
    const result = (await this.apiResponseS.onGetItem(
      `google-calendar-events/${this.id()}`,
    )) as IGoogleCalendarEventDetail | null;

    if (!result) {
      return;
    }

    this.form.patchValue({
      customerId: result.customerId,
      subjectType: result.subjectType,
      modality: result.modality,
      meetingDate: this.extractDateInputValue(result.startAt),
      startTime: this.extractTimePart(result.startAt),
      isRecurring: result.isRecurring,
      recurrence: result.recurrence,
      recurrenceMode: result.recurrenceMode,
      recurrenceEndDate: this.extractDateInputValue(result.recurrenceEndDate),
      description: result.description,
      location: result.location,
    });
    this.applyRecurringState(result.isRecurring, false);
    await this.loadEventsForSelectedDate();

    this.guestsArray.clear();
    const guests = Array.isArray(result.guests) ? result.guests : [];
    if (!guests.length) {
      this.addGuest();
    } else {
      guests.forEach((guest) => this.addGuest(guest));
    }

    this.form.updateValueAndValidity();
  }

  addGuest(guest?: { id?: string; name?: string; email?: string }) {
    this.guestsArray.push(
      new FormGroup<IGoogleCalendarGuestForm>({
        id: new FormControl(guest?.id ?? null),
        name: new FormControl(guest?.name ?? "", { nonNullable: true }),
        email: new FormControl(guest?.email ?? "", {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        }),
      }),
    );
  }

  removeGuest(index: number) {
    this.guestsArray.removeAt(index);
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "google-calendar-events",
      id: this.id(),
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => ({
        customerId: this.form.controls.customerId.getRawValue(),
        subjectType: this.form.controls.subjectType.value,
        modality: this.form.controls.modality.value,
        startAt: this.combineDateAndTime(
          this.form.controls.meetingDate.value,
          this.form.controls.startTime.value,
        ),
        endAt: this.combineDateAndTime(
          this.form.controls.meetingDate.value,
          this.getEndTimeForStart(this.form.controls.startTime.value),
        ),
        isRecurring: this.form.controls.isRecurring.getRawValue(),
        recurrence: this.form.controls.isRecurring.getRawValue()
          ? this.form.controls.recurrence.getRawValue()
          : null,
        recurrenceMode: this.form.controls.isRecurring.getRawValue()
          ? this.form.controls.recurrenceMode.getRawValue()
          : null,
        recurrenceEndDate: this.form.controls.isRecurring.getRawValue()
          ? this.form.controls.recurrenceEndDate.getRawValue()
          : null,
        description: this.form.controls.description.getRawValue(),
        location: this.form.controls.location.getRawValue(),
        guests: this.guestsArray.getRawValue().filter((guest) => guest.email),
      }),
    });
  }

  private async loadRecurrenceOptions() {
    const options = await firstValueFrom(this.enumSelectS.recurrence());
    this.recurrenceOptions.set(
      options.filter((item) => item.value !== ERecurrence.Eventual),
    );
  }

  private setupScheduleValidationRefresh() {
    this.form.controls.meetingDate.valueChanges.subscribe(async (value) => {
      this.selectedDate.set(this.extractDatePart(value as string | null));
      await this.loadEventsForSelectedDate();
      this.syncTimeSelection();
      this.form.updateValueAndValidity({ emitEvent: false });
    });
    this.form.controls.startTime.valueChanges.subscribe((value) => {
      this.selectedStartTime.set(value);
      this.syncTimeSelection();
      this.form.updateValueAndValidity({ emitEvent: false });
    });
    this.form.controls.recurrence.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity({ emitEvent: false });
    });
    this.form.controls.recurrenceMode.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity({ emitEvent: false });
    });
    this.form.controls.recurrenceEndDate.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity({ emitEvent: false });
    });
  }

  private setupRecurringStateRefresh() {
    this.form.controls.isRecurring.valueChanges.subscribe((isRecurring) => {
      this.applyRecurringState(isRecurring);
    });
  }

  private applyRecurringState(isRecurring: boolean, emitEvent = true) {
    const recurrenceControl = this.form.controls.recurrence;
    const recurrenceModeControl = this.form.controls.recurrenceMode;
    const recurrenceEndDateControl = this.form.controls.recurrenceEndDate;

    if (isRecurring) {
      recurrenceControl.setValidators([Validators.required]);
      recurrenceModeControl.setValidators([Validators.required]);
      recurrenceEndDateControl.setValidators([Validators.required]);

      recurrenceControl.enable({ emitEvent: false });
      recurrenceModeControl.enable({ emitEvent: false });
      recurrenceEndDateControl.enable({ emitEvent: false });

      if (!recurrenceControl.value) {
        recurrenceControl.setValue(ERecurrence.Mensual, { emitEvent: false });
      }

      if (!recurrenceModeControl.value) {
        recurrenceModeControl.setValue(
          EGoogleCalendarRecurrenceMode.OrdinalWeekday,
          {
            emitEvent: false,
          },
        );
      }

      if (!recurrenceEndDateControl.value) {
        recurrenceEndDateControl.setValue(
          this.defaultRecurrenceEndDateValue(),
          { emitEvent: false },
        );
      }
    } else {
      recurrenceControl.clearValidators();
      recurrenceModeControl.clearValidators();
      recurrenceEndDateControl.clearValidators();

      recurrenceControl.setValue(null, { emitEvent: false });
      recurrenceModeControl.setValue(null, { emitEvent: false });
      recurrenceEndDateControl.setValue(null, { emitEvent: false });

      recurrenceControl.disable({ emitEvent: false });
      recurrenceModeControl.disable({ emitEvent: false });
      recurrenceEndDateControl.disable({ emitEvent: false });
    }

    recurrenceControl.updateValueAndValidity({ emitEvent: false });
    recurrenceModeControl.updateValueAndValidity({ emitEvent: false });
    recurrenceEndDateControl.updateValueAndValidity({ emitEvent: false });

    if (!emitEvent) {
      return;
    }

    this.form.updateValueAndValidity({ emitEvent: false });
  }

  private lockRecurrenceConfiguration() {
    this.form.controls.isRecurring.disable({ emitEvent: false });
    this.form.controls.recurrence.disable({ emitEvent: false });
    this.form.controls.recurrenceMode.disable({ emitEvent: false });
    this.form.controls.recurrenceEndDate.disable({ emitEvent: false });
  }

  private defaultRecurrenceEndDateValue(): string {
    const meetingDate = this.extractDatePart(
      this.form.controls.meetingDate.value as string | null,
    );
    const baseDate = meetingDate ?? new Date();
    const suggested = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth() + 6,
      baseDate.getDate(),
    );

    return this.formatDateInputValue(suggested);
  }

  private validateScheduleRules() {
    const startAt = this.combineDateAndTime(
      this.form.controls.meetingDate.value,
      this.form.controls.startTime.value,
    );
    const endAt = this.combineDateAndTime(
      this.form.controls.meetingDate.value,
      this.getEndTimeForStart(this.form.controls.startTime.value),
    );

    if (!startAt || !endAt) {
      return null;
    }

    const errors: Record<string, unknown> = {};
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (endDate <= startDate) {
      errors["invalidDateRange"] = true;
    }

    if (!this.isSameDay(startDate, endDate)) {
      errors["sameDayRequired"] = true;
    }

    const overlaps = this.findOverlaps(startDate);
    if (overlaps.length > 0 && !this.canOverrideScheduleConflicts()) {
      errors["overlappingSchedule"] = overlaps;
    }

    if (this.form.controls.isRecurring.getRawValue()) {
      const recurrenceEndDate = this.extractDatePart(
        this.form.controls.recurrenceEndDate.value as string | null,
      );
      if (
        recurrenceEndDate &&
        recurrenceEndDate.getTime() < startDate.setHours(0, 0, 0, 0)
      ) {
        errors["invalidRecurrenceEndDate"] = true;
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  private findOverlaps(startAt: Date): string[] {
    const currentId = this.id();
    const events = this.dateEvents();

    return events
      .filter((event) => event.id !== currentId)
      .filter((event) => {
        const existingStart = new Date(event.startAt);
        const differenceMinutes =
          (startAt.getTime() - existingStart.getTime()) / (60 * 1000);

        return (
          differenceMinutes >= 0 &&
          differenceMinutes <= GoogleCalendarForm.StartTimeBlockingWindowMinutes
        );
      })
      .map(
        (event) =>
          `${event.title} (${this.extractDisplayDate(event.startAt)} - ${this.extractDisplayDate(event.endAt)})`,
      );
  }

  onStartTimeSelected(time: string) {
    const slot = this.startTimeOptions().find((item) => item.value === time);
    if (!slot || slot.disabled) {
      return;
    }

    this.form.controls.startTime.setValue(time);
  }

  getSubjectTypeDescription(): string {
    return this.getSelectedDescription(
      this.subjectTypeOptions(),
      this.form.controls.subjectType.value,
    );
  }

  getModalityDescription(): string {
    return this.getSelectedDescription(
      this.modalityOptions(),
      this.form.controls.modality.value,
    );
  }

  selectSubjectType(value: number) {
    this.form.controls.subjectType.setValue(value);
    this.form.controls.subjectType.markAsTouched();
  }

  selectModality(value: number) {
    this.form.controls.modality.setValue(value);
    this.form.controls.modality.markAsTouched();
  }

  private getSelectedDescription(
    options: IOptionShortcut[],
    value: number | null,
  ): string {
    if (value === null || value === undefined) {
      return "";
    }

    return options.find((item) => item.value === value)?.description ?? "";
  }

  private buildTimeSlotOptions() {
    const options: Array<{ label: string; value: string }> = [];

    for (let hour = 7; hour <= 21; hour++) {
      for (const minute of [0, 30]) {
        if (hour === 21 && minute > 0) {
          continue;
        }

        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push({
          label: this.toDisplayTime(time),
          value: time,
        });
      }
    }

    return options;
  }

  private syncTimeSelection() {
    const selectedDate = this.extractDatePart(
      this.form.controls.meetingDate.value as string | null,
    );
    this.selectedDate.set(selectedDate);
    this.selectedStartTime.set(this.form.controls.startTime.value);

    const startTime = this.form.controls.startTime.value;
    if (startTime) {
      const startSlot = this.startTimeOptions().find(
        (item) => item.value === startTime,
      );
      if (!startSlot || startSlot.disabled) {
        this.form.controls.startTime.setValue("", { emitEvent: false });
        this.selectedStartTime.set("");
      }
    }
  }

  private async loadEventsForSelectedDate() {
    const customerId = this.form.controls.customerId.getRawValue();
    const selectedDate = this.selectedDate();

    if (!customerId || !selectedDate) {
      this.dateEvents.set([]);
      this.form.controls.startTime.setValue("", { emitEvent: false });
      this.form.controls.startTime.disable({ emitEvent: false });
      return;
    }

    this.loadingDateAvailability.set(true);
    try {
      const events = await this.apiResponseS.onGetList<
        IGoogleCalendarEventListItem[]
      >(`google-calendar-events/customer/${customerId}`);

      const filtered = (events ?? []).filter((event) =>
        this.isSameDay(new Date(event.startAt), selectedDate),
      );

      this.dateEvents.set(filtered);
      this.form.controls.startTime.enable({ emitEvent: false });
    } finally {
      this.loadingDateAvailability.set(false);
    }
  }

  private getConflictsForSlot(startTime: string, endTime: string): string[] {
    const date = this.selectedDate();
    if (!date || !startTime || !endTime) {
      return [];
    }

    const startAt = this.combineDateAndTime(date, startTime);
    const endAt = this.combineDateAndTime(date, endTime);
    if (!startAt || !endAt) {
      return [];
    }

    return this.findOverlaps(new Date(startAt));
  }

  private getEndTimeForStart(startTime: string | null): string | null {
    if (!startTime) {
      return null;
    }

    const [hours, minutes] = startTime.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    const totalMinutes =
      hours * 60 + minutes + GoogleCalendarForm.MeetingDurationMinutes;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;

    if (endHour > 23 || (endHour === 23 && endMinute > 59)) {
      return null;
    }

    return `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;
  }

  private isSameDay(startDate: Date, endDate: Date): boolean {
    return (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate()
    );
  }

  private toDisplayTime(time: string): string {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  private extractDatePart(value: Date | string | null): Date | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day, 0, 0, 0, 0);
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private extractDateInputValue(value: string | null): string {
    if (!value) {
      return "";
    }

    const date = new Date(value);
    return this.formatDateInputValue(date);
  }

  private formatDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private extractTimePart(value: string | null): string {
    if (!value) {
      return "";
    }

    const date = new Date(value);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  private combineDateAndTime(
    dateValue: Date | string | null,
    timeValue: string | null,
  ): string | null {
    if (!dateValue || !timeValue) {
      return null;
    }

    const baseDate =
      typeof dateValue === "string"
        ? this.extractDatePart(dateValue)
        : new Date(dateValue);
    if (!baseDate || Number.isNaN(baseDate.getTime())) {
      return null;
    }

    const [hours, minutes] = timeValue.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    const combined = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hours,
      minutes,
      0,
      0,
    );

    return combined.toISOString();
  }

  private extractDisplayDate(value: string): string {
    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  private buildRecurrencePreview(): string {
    if (!this.form.controls.isRecurring.getRawValue()) {
      return "";
    }

    const recurrenceOption = this.recurrenceOptions().find(
      (item) => item.value === this.form.controls.recurrence.getRawValue(),
    );
    const recurrenceMode = this.form.controls.recurrenceMode.getRawValue();
    const recurrenceEndDate = this.extractDatePart(
      this.form.controls.recurrenceEndDate.getRawValue(),
    );
    const meetingDate = this.extractDatePart(
      this.form.controls.meetingDate.getRawValue(),
    );

    if (!recurrenceOption?.label || !recurrenceMode || !recurrenceEndDate) {
      return "";
    }

    const modeSummary =
      recurrenceMode === EGoogleCalendarRecurrenceMode.DayOfMonth
        ? `mismo dia ${meetingDate?.getDate() ?? ""}`
        : this.describeOrdinalWeekday(meetingDate);

    return `${recurrenceOption.label} | ${modeSummary} | hasta ${this.formatHumanDate(
      recurrenceEndDate,
    )}`;
  }

  private describeOrdinalWeekday(date: Date | null): string {
    if (!date) {
      return "mismo dia de la semana del mes";
    }

    const position = this.getOrdinalWeekdayPosition(date);
    const ordinal =
      position === -1
        ? "ultimo"
        : (["primer", "segundo", "tercer", "cuarto", "quinto"][position - 1] ??
          "mismo");

    const weekday = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ][date.getDay()];

    return `${ordinal} ${weekday}`;
  }

  private getOrdinalWeekdayPosition(date: Date): number {
    const position = Math.floor((date.getDate() - 1) / 7) + 1;
    const nextWeek = new Date(date);
    nextWeek.setDate(date.getDate() + 7);
    return nextWeek.getMonth() !== date.getMonth() ? -1 : position;
  }

  private formatHumanDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
