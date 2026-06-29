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
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/web/inputs/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/web/inputs/custom-input-switch-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/web/inputs/custom-input-textarea-signal";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ERecurrence } from "src/app/core/enums/e-recurrence.enum";
import { EGoogleCalendarRecurrenceMode } from "src/app/core/enums/google-calendar-recurrence-mode.enum";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { FormHelper } from "src/app/core/helpers/form-helper";

interface IGoogleCalendarGuestForm {
  id: FormControl<string | null>;
  name: FormControl<string>;
  email: FormControl<string>;
  isImplicit: FormControl<boolean>;
}

interface IGoogleCalendarAssemblyInviteeForm {
  id: FormControl<string | null>;
  name: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  organization: FormControl<string>;
  position: FormControl<string>;
  isInternal: FormControl<boolean>;
  notes: FormControl<string>;
  isImplicit: FormControl<boolean>;
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
  juntaMensualSessionId?: string | null;
  hasAssemblyChecklist?: boolean;
  guests: Array<{ id?: string; name?: string; email?: string }>;
  assembly?: {
    id?: string;
    copyLegal: boolean;
    requiresPaddles: boolean;
    paddlesQuantity?: number | null;
    requiresAudioVisual: boolean;
    audioVisualNotes: string;
    operationalNotes: string;
    specialInstructions: string;
    invitees: Array<{
      id?: string;
      name?: string;
      email?: string;
      phone?: string;
      organization?: string;
      position?: string;
      isInternal?: boolean;
      notes?: string;
    }>;
  } | null;
}

interface IGoogleCalendarInviteeSuggestion {
  id: string;
  email: string;
  nameEmployee: string;
  applicationRoleName: string;
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
  assemblyCopyLegal: FormControl<boolean>;
  assemblyRequiresPaddles: FormControl<boolean>;
  assemblyPaddlesQuantity: FormControl<number | null>;
  assemblyRequiresAudioVisual: FormControl<boolean>;
  assemblyAudioVisualNotes: FormControl<string>;
  assemblyOperationalNotes: FormControl<string>;
  assemblySpecialInstructions: FormControl<string>;
  assemblyInvitees: FormArray<FormGroup<IGoogleCalendarAssemblyInviteeForm>>;
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
    AppIcon,
  ],
})
export class GoogleCalendarForm implements OnInit {
  private static readonly MeetingDurationMinutes = 90;
  private static readonly StartTimeBlockingWindowMinutes = 60;

  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly aspRoleS = inject(AspRoleService);
  private readonly dateS = inject(DateService);
  private readonly enumSelectS = inject(EnumSelectService);

  readonly submitting = signal(false);
  readonly submittingSeries = signal(false);
  readonly deletingSeries = signal(false);
  readonly id = signal<string | null>(null);
  readonly originalEventDetail = signal<IGoogleCalendarEventDetail | null>(
    null,
  );
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
  readonly subjectType = signal<number | null>(null);
  readonly modality = signal<number | null>(null);
  readonly isRecurring = signal<boolean>(false);
  readonly recurrence = signal<number | null>(null);
  readonly recurrenceMode = signal<number | null>(null);
  readonly recurrenceEndDate = signal<Date | string | null>(null);
  readonly meetingDate = signal<Date | string | null>(null);

  readonly isAssemblySelected = computed(
    () => Number(this.subjectType()) === 1,
  );
  readonly isPresentialSelected = computed(() => Number(this.modality()) === 1);
  readonly assemblyRequiresPaddles = signal<boolean>(false);
  readonly assemblyRequiresAudioVisual = signal<boolean>(false);

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
  readonly loadingSuggestedInvitees = signal(false);
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
    location: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    guests: new FormArray<FormGroup<IGoogleCalendarGuestForm>>([]),
    assemblyCopyLegal: new FormControl(true, { nonNullable: true }),
    assemblyRequiresPaddles: new FormControl(false, { nonNullable: true }),
    assemblyPaddlesQuantity: new FormControl<number | null>(null),
    assemblyRequiresAudioVisual: new FormControl(false, { nonNullable: true }),
    assemblyAudioVisualNotes: new FormControl("", { nonNullable: true }),
    assemblyOperationalNotes: new FormControl("", { nonNullable: true }),
    assemblySpecialInstructions: new FormControl("", { nonNullable: true }),
    assemblyInvitees: new FormArray<
      FormGroup<IGoogleCalendarAssemblyInviteeForm>
    >([]),
  });

  get guestsArray(): FormArray<FormGroup<IGoogleCalendarGuestForm>> {
    return this.form.controls.guests;
  }

  get overlapConflicts(): string[] {
    return this.form.errors?.["overlappingSchedule"] ?? [];
  }

  get assemblyInviteesArray(): FormArray<
    FormGroup<IGoogleCalendarAssemblyInviteeForm>
  > {
    return this.form.controls.assemblyInvitees;
  }

  async ngOnInit() {
    this.id.set(this.config.data.id ?? null);
    this.form.addValidators(() => this.validateScheduleRules());

    await this.loadRecurrenceOptions();
    this.setupScheduleValidationRefresh();
    this.setupRecurringStateRefresh();
    this.setupAssemblyStateRefresh();
    this.setupModalityStateRefresh();
    this.setupSuggestedInviteesRefresh();

    if (this.id()) {
      await this.onLoadData();
    } else {
      const isRecurring = this.form.controls.isRecurring.getRawValue();
      const subjectType = this.form.controls.subjectType.getRawValue();
      const modality = this.form.controls.modality.getRawValue();
      const meetingDate = this.form.controls.meetingDate.getRawValue();
      const recurrence = this.form.controls.recurrence.getRawValue();
      const recurrenceMode = this.form.controls.recurrenceMode.getRawValue();
      const recurrenceEndDate =
        this.form.controls.recurrenceEndDate.getRawValue();

      this.isRecurring.set(isRecurring);
      this.subjectType.set(subjectType);
      this.modality.set(modality);
      this.meetingDate.set(meetingDate);
      this.recurrence.set(recurrence);
      this.recurrenceMode.set(recurrenceMode);
      this.recurrenceEndDate.set(recurrenceEndDate);

      this.applyRecurringState(isRecurring, false);
      this.applyAssemblyState(subjectType === 1, false);
      this.applyModalityState(modality === 1, false);
      await this.loadSuggestedInvitees();
    }
  }

  async onLoadData() {
    const result = (await this.apiResponseS.onGetItem(
      `google-calendar-events/${this.id()}`,
    )) as IGoogleCalendarEventDetail | null;

    if (!result) {
      return;
    }

    this.originalEventDetail.set(result);

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
      assemblyCopyLegal: result.assembly?.copyLegal ?? true,
      assemblyRequiresPaddles: result.assembly?.requiresPaddles ?? false,
      assemblyPaddlesQuantity: result.assembly?.paddlesQuantity ?? null,
      assemblyRequiresAudioVisual:
        result.assembly?.requiresAudioVisual ?? false,
      assemblyAudioVisualNotes: result.assembly?.audioVisualNotes ?? "",
      assemblyOperationalNotes: result.assembly?.operationalNotes ?? "",
      assemblySpecialInstructions: result.assembly?.specialInstructions ?? "",
    });

    this.isRecurring.set(result.isRecurring);
    this.subjectType.set(result.subjectType);
    this.modality.set(result.modality);
    this.assemblyRequiresPaddles.set(result.assembly?.requiresPaddles ?? false);
    this.assemblyRequiresAudioVisual.set(
      result.assembly?.requiresAudioVisual ?? false,
    );
    this.meetingDate.set(this.extractDateInputValue(result.startAt));
    this.recurrence.set(result.recurrence);
    this.recurrenceMode.set(result.recurrenceMode);
    this.recurrenceEndDate.set(
      this.extractDateInputValue(result.recurrenceEndDate),
    );

    this.applyRecurringState(result.isRecurring, false);
    this.applyAssemblyState(result.subjectType === 1, false);
    this.applyModalityState(result.modality === 1, false);
    await this.loadEventsForSelectedDate();

    this.guestsArray.clear();
    const guests = Array.isArray(result.guests) ? result.guests : [];
    if (guests.length) {
      guests.forEach((guest) => this.addGuest(guest));
    }

    this.assemblyInviteesArray.clear();
    const assemblyInvitees = Array.isArray(result.assembly?.invitees)
      ? (result.assembly?.invitees ?? [])
      : [];
    if (assemblyInvitees.length) {
      assemblyInvitees.forEach((invitee) => this.addAssemblyInvitee(invitee));
    }

    this.form.updateValueAndValidity();
  }

  addGuest(guest?: {
    id?: string;
    name?: string;
    email?: string;
    isImplicit?: boolean;
  }) {
    this.guestsArray.push(
      new FormGroup<IGoogleCalendarGuestForm>({
        id: new FormControl(guest?.id ?? null),
        name: new FormControl(
          { value: guest?.name ?? "", disabled: guest?.isImplicit ?? false },
          { nonNullable: true },
        ),
        email: new FormControl(
          { value: guest?.email ?? "", disabled: guest?.isImplicit ?? false },
          {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
          },
        ),
        isImplicit: new FormControl(guest?.isImplicit ?? false, {
          nonNullable: true,
        }),
      }),
    );
  }

  removeGuest(index: number) {
    this.guestsArray.removeAt(index);
  }

  addAssemblyInvitee(
    invitee?: Partial<{
      id: string;
      name: string;
      email: string;
      phone: string;
      organization: string;
      position: string;
      isInternal: boolean;
      notes: string;
      isImplicit: boolean;
    }>,
  ) {
    this.assemblyInviteesArray.push(
      new FormGroup<IGoogleCalendarAssemblyInviteeForm>({
        id: new FormControl(invitee?.id ?? null),
        name: new FormControl(
          {
            value: invitee?.name ?? "",
            disabled: invitee?.isImplicit ?? false,
          },
          { nonNullable: true },
        ),
        email: new FormControl(
          {
            value: invitee?.email ?? "",
            disabled: invitee?.isImplicit ?? false,
          },
          {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
          },
        ),
        phone: new FormControl(invitee?.phone ?? "", { nonNullable: true }),
        organization: new FormControl(invitee?.organization ?? "", {
          nonNullable: true,
        }),
        position: new FormControl(invitee?.position ?? "", {
          nonNullable: true,
        }),
        isInternal: new FormControl(invitee?.isInternal ?? false, {
          nonNullable: true,
        }),
        notes: new FormControl(invitee?.notes ?? "", { nonNullable: true }),
        isImplicit: new FormControl(invitee?.isImplicit ?? false, {
          nonNullable: true,
        }),
      }),
    );
  }

  removeAssemblyInvitee(index: number) {
    this.assemblyInviteesArray.removeAt(index);
  }

  async onSubmit() {
    const result: any = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "google-calendar-events",
      id: this.id() || null,
      ref: this.ref,
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: () => this.buildPayload(false),
    });

    if (!result) return;
    if (
      this.form.controls.subjectType.getRawValue() === 1 &&
      result.juntaMensualSessionId
    ) {
      this.ref.close({
        refresh: true,
        openAssemblyChecklist: true,
        sessionId: result.juntaMensualSessionId,
      });
    } else {
      this.ref.close(true);
    }
  }

  async onSubmitSeries() {
    if (!this.id()) return;
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.GoogleCalendarEvents.updateSeries(this.id()),
      method: "PUT",
      id: null,
      ref: this.ref,
      submitting: this.submittingSeries,
      transformPayload: () => this.buildPayload(true),
    });
  }

  async onDeleteSeries() {
    if (!this.id()) {
      return;
    }

    const confirmed = window.confirm(
      "Se eliminaran todas las ocurrencias de esta serie. Deseas continuar?",
    );
    if (!confirmed) {
      return;
    }

    this.deletingSeries.set(true);
    try {
      const result = await this.apiResponseS.onDelete(
        `google-calendar-events/${this.id()}/series`,
      );

      if (result) {
        this.ref.close(true);
      }
    } finally {
      this.deletingSeries.set(false);
    }
  }

  private async loadRecurrenceOptions() {
    const options = await firstValueFrom(this.enumSelectS.recurrence());
    this.recurrenceOptions.set(
      options.filter((item) => item.value !== ERecurrence.Eventual),
    );
  }

  private setupScheduleValidationRefresh() {
    this.form.controls.meetingDate.valueChanges.subscribe(async (value) => {
      this.meetingDate.set(value);
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
    this.form.controls.recurrence.valueChanges.subscribe((value) => {
      this.recurrence.set(value);
      this.form.updateValueAndValidity({ emitEvent: false });
    });
    this.form.controls.recurrenceMode.valueChanges.subscribe((value) => {
      this.recurrenceMode.set(value);
      this.form.updateValueAndValidity({ emitEvent: false });
    });
    this.form.controls.recurrenceEndDate.valueChanges.subscribe((value) => {
      this.recurrenceEndDate.set(value);
      this.form.updateValueAndValidity({ emitEvent: false });
    });
  }

  private setupRecurringStateRefresh() {
    this.form.controls.isRecurring.valueChanges.subscribe((isRecurring) => {
      setTimeout(() => {
        this.isRecurring.set(isRecurring);
        this.applyRecurringState(isRecurring);
      });
    });
  }

  private setupAssemblyStateRefresh() {
    this.form.controls.subjectType.valueChanges.subscribe(
      async (subjectType) => {
        setTimeout(async () => {
          this.subjectType.set(subjectType);
          this.applyAssemblyState(subjectType === 1);
          await this.loadSuggestedInvitees();
        });
      },
    );

    this.form.controls.assemblyRequiresPaddles.valueChanges.subscribe(
      async (requiresPaddles) => {
        this.assemblyRequiresPaddles.set(requiresPaddles);
        const paddlesControl = this.form.controls.assemblyPaddlesQuantity;
        if (requiresPaddles) {
          paddlesControl.setValidators([
            Validators.required,
            Validators.min(1),
          ]);
        } else {
          paddlesControl.clearValidators();
          paddlesControl.setValue(null, { emitEvent: false });
        }

        paddlesControl.updateValueAndValidity({ emitEvent: false });
        await this.loadSuggestedInvitees();
      },
    );

    this.form.controls.assemblyRequiresAudioVisual.valueChanges.subscribe(
      async (requiresAV) => {
        this.assemblyRequiresAudioVisual.set(requiresAV);
        await this.loadSuggestedInvitees();
      },
    );
  }

  private setupSuggestedInviteesRefresh() {
    this.form.controls.customerId.valueChanges.subscribe(async () => {
      await this.loadSuggestedInvitees();
    });
  }

  private setupModalityStateRefresh() {
    this.form.controls.modality.valueChanges.subscribe((modality) => {
      setTimeout(() => {
        this.modality.set(modality);
        this.applyModalityState(modality === 1);
      });
    });
  }

  private async loadSuggestedInvitees() {
    if (this.isEditMode()) {
      return;
    }

    const customerId = this.form.controls.customerId.getRawValue();
    const subjectType = this.form.controls.subjectType.getRawValue();

    if (!customerId || subjectType === null || subjectType === undefined) {
      return;
    }

    this.loadingSuggestedInvitees.set(true);
    try {
      const includeSystems =
        subjectType === 1 &&
        (this.form.controls.assemblyRequiresPaddles.getRawValue() ||
          this.form.controls.assemblyRequiresAudioVisual.getRawValue());

      const result = await this.apiResponseS.onGetList<
        IGoogleCalendarInviteeSuggestion[]
      >(
        `responsables-cliente/sugeridos-agenda?customerId=${customerId}&subjectType=${subjectType}&includeSystems=${includeSystems}`,
      );

      const suggestions = Array.isArray(result) ? result : [];
      if (subjectType === 1) {
        this.mergeAssemblyInviteeSuggestions(suggestions);
        return;
      }

      this.mergeGuestSuggestions(suggestions);
    } finally {
      this.loadingSuggestedInvitees.set(false);
    }
  }

  private mergeGuestSuggestions(
    suggestions: IGoogleCalendarInviteeSuggestion[],
  ) {
    const existingControlsByEmail = new Map<
      string,
      FormGroup<IGoogleCalendarGuestForm>
    >();
    this.guestsArray.controls.forEach((control) => {
      const email = control.controls.email.getRawValue().trim().toLowerCase();
      if (email) existingControlsByEmail.set(email, control);
    });

    suggestions.forEach((suggestion) => {
      const email = suggestion.email?.trim().toLowerCase();
      if (!email) return;

      if (existingControlsByEmail.has(email)) {
        const control = existingControlsByEmail.get(email)!;
        control.controls.isImplicit.setValue(true, { emitEvent: false });
        control.controls.name.disable({ emitEvent: false });
        control.controls.email.disable({ emitEvent: false });
      } else {
        this.guestsArray.push(
          new FormGroup<IGoogleCalendarGuestForm>({
            id: new FormControl(suggestion.id ?? null),
            name: new FormControl(
              { value: suggestion.nameEmployee ?? "", disabled: true },
              { nonNullable: true },
            ),
            email: new FormControl(
              { value: suggestion.email ?? "", disabled: true },
              {
                nonNullable: true,
                validators: [Validators.required, Validators.email],
              },
            ),
            isImplicit: new FormControl(true, { nonNullable: true }),
          }),
          { emitEvent: false },
        );
      }
    });

    const sortedControls = [...this.guestsArray.controls].sort((a, b) => {
      const emailA = a.controls.email.getRawValue().trim().toLowerCase();
      const emailB = b.controls.email.getRawValue().trim().toLowerCase();
      const idxA = suggestions.findIndex(
        (s) => s.email?.trim().toLowerCase() === emailA,
      );
      const idxB = suggestions.findIndex(
        (s) => s.email?.trim().toLowerCase() === emailB,
      );
      return (idxA === -1 ? 9999 : idxA) - (idxB === -1 ? 9999 : idxB);
    });

    this.guestsArray.clear({ emitEvent: false });
    sortedControls.forEach((c) =>
      this.guestsArray.push(c, { emitEvent: false }),
    );
    this.guestsArray.updateValueAndValidity({ emitEvent: false });
  }

  private mergeAssemblyInviteeSuggestions(
    suggestions: IGoogleCalendarInviteeSuggestion[],
  ) {
    const existingControlsByEmail = new Map<
      string,
      FormGroup<IGoogleCalendarAssemblyInviteeForm>
    >();
    this.assemblyInviteesArray.controls.forEach((control) => {
      const email = control.controls.email.getRawValue().trim().toLowerCase();
      if (email) existingControlsByEmail.set(email, control);
    });

    suggestions.forEach((suggestion) => {
      const email = suggestion.email?.trim().toLowerCase();
      if (!email) return;

      if (existingControlsByEmail.has(email)) {
        const control = existingControlsByEmail.get(email)!;
        control.controls.isImplicit.setValue(true, { emitEvent: false });
        control.controls.name.disable({ emitEvent: false });
        control.controls.email.disable({ emitEvent: false });
      } else {
        this.assemblyInviteesArray.push(
          new FormGroup<IGoogleCalendarAssemblyInviteeForm>({
            id: new FormControl(suggestion.id ?? null),
            name: new FormControl(
              { value: suggestion.nameEmployee ?? "", disabled: true },
              { nonNullable: true },
            ),
            email: new FormControl(
              { value: suggestion.email ?? "", disabled: true },
              {
                nonNullable: true,
                validators: [Validators.required, Validators.email],
              },
            ),
            phone: new FormControl("", { nonNullable: true }),
            organization: new FormControl("", { nonNullable: true }),
            position: new FormControl(suggestion.applicationRoleName ?? "", {
              nonNullable: true,
            }),
            isInternal: new FormControl(true, { nonNullable: true }),
            notes: new FormControl("", { nonNullable: true }),
            isImplicit: new FormControl(true, { nonNullable: true }),
          }),
          { emitEvent: false },
        );
      }
    });

    const sortedControls = [...this.assemblyInviteesArray.controls].sort(
      (a, b) => {
        const emailA = a.controls.email.getRawValue().trim().toLowerCase();
        const emailB = b.controls.email.getRawValue().trim().toLowerCase();
        const idxA = suggestions.findIndex(
          (s) => s.email?.trim().toLowerCase() === emailA,
        );
        const idxB = suggestions.findIndex(
          (s) => s.email?.trim().toLowerCase() === emailB,
        );
        return (idxA === -1 ? 9999 : idxA) - (idxB === -1 ? 9999 : idxB);
      },
    );

    this.assemblyInviteesArray.clear({ emitEvent: false });
    sortedControls.forEach((c) =>
      this.assemblyInviteesArray.push(c, { emitEvent: false }),
    );
    this.assemblyInviteesArray.updateValueAndValidity({ emitEvent: false });
  }

  private applyRecurringState(isRecurring: boolean, emitEvent = true) {
    const recurrenceControl = this.form.controls.recurrence;
    const recurrenceModeControl = this.form.controls.recurrenceMode;
    const recurrenceEndDateControl = this.form.controls.recurrenceEndDate;

    if (isRecurring) {
      recurrenceControl.setValidators([Validators.required]);
      recurrenceModeControl.setValidators([Validators.required]);
      recurrenceEndDateControl.setValidators([Validators.required]);

      setTimeout(() => {
        recurrenceControl.enable({ emitEvent: false });
        recurrenceModeControl.enable({ emitEvent: false });
        recurrenceEndDateControl.enable({ emitEvent: false });
      });

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

      setTimeout(() => {
        recurrenceControl.disable({ emitEvent: false });
        recurrenceModeControl.disable({ emitEvent: false });
        recurrenceEndDateControl.disable({ emitEvent: false });
      });
    }

    recurrenceControl.updateValueAndValidity({ emitEvent: false });
    recurrenceModeControl.updateValueAndValidity({ emitEvent: false });
    recurrenceEndDateControl.updateValueAndValidity({ emitEvent: false });

    if (!emitEvent) {
      return;
    }

    this.form.updateValueAndValidity({ emitEvent: false });
  }

  private applyAssemblyState(isAssembly: boolean, emitEvent = true) {
    const paddlesControl = this.form.controls.assemblyPaddlesQuantity;
    const audioNotesControl = this.form.controls.assemblyAudioVisualNotes;
    const operationalNotesControl = this.form.controls.assemblyOperationalNotes;
    const specialInstructionsControl =
      this.form.controls.assemblySpecialInstructions;

    if (isAssembly) {
      if (this.form.controls.assemblyRequiresPaddles.getRawValue()) {
        paddlesControl.setValidators([Validators.required, Validators.min(1)]);
      }
      setTimeout(() => {
        audioNotesControl.enable({ emitEvent: false });
        operationalNotesControl.enable({ emitEvent: false });
        specialInstructionsControl.enable({ emitEvent: false });
      });
    } else {
      paddlesControl.clearValidators();
      paddlesControl.setValue(null, { emitEvent: false });
      this.form.controls.assemblyRequiresPaddles.setValue(false, {
        emitEvent: false,
      });
      this.form.controls.assemblyRequiresAudioVisual.setValue(false, {
        emitEvent: false,
      });
      this.form.controls.assemblyAudioVisualNotes.setValue("", {
        emitEvent: false,
      });
      this.form.controls.assemblyOperationalNotes.setValue("", {
        emitEvent: false,
      });
      this.form.controls.assemblySpecialInstructions.setValue("", {
        emitEvent: false,
      });
      this.assemblyInviteesArray.clear({ emitEvent: false });
    }

    paddlesControl.updateValueAndValidity({ emitEvent: false });

    if (emitEvent) {
      this.form.updateValueAndValidity({ emitEvent: false });
    }
  }

  private applyModalityState(isPresential: boolean, emitEvent = true) {
    const locationControl = this.form.controls.location;

    if (isPresential) {
      locationControl.setValidators([Validators.required]);
    } else {
      locationControl.clearValidators();
    }

    locationControl.updateValueAndValidity({ emitEvent: false });

    if (emitEvent) {
      this.form.updateValueAndValidity({ emitEvent: false });
    }
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
        const existingStart =
          this.parseBusinessDateTime(event.startAt) ?? new Date(event.startAt);
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
        this.isSameDay(
          this.parseBusinessDateTime(event.startAt) ?? new Date(event.startAt),
          selectedDate,
        ),
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

    const date = this.parseBusinessDateTime(value) ?? new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private extractDateInputValue(value: string | null): string {
    if (!value) {
      return "";
    }

    const date = this.parseBusinessDateTime(value) ?? new Date(value);
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

    const date = this.parseBusinessDateTime(value) ?? new Date(value);
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

    return `${baseDate.getFullYear()}-${(baseDate.getMonth() + 1)
      .toString()
      .padStart(
        2,
        "0",
      )}-${baseDate.getDate().toString().padStart(2, "0")}T${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  }

  private extractDisplayDate(value: string): string {
    const date = this.parseBusinessDateTime(value) ?? new Date(value);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  private parseBusinessDateTime(value: string | Date | null | undefined) {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
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

    return this.dateS.parseDate(normalized) ?? null;
  }

  private buildPayload(forSeries: boolean) {
    const isRecurring = this.form.controls.isRecurring.getRawValue();
    const original = this.originalEventDetail();
    const effectiveIsRecurring =
      forSeries || !original ? isRecurring : original.isRecurring;
    const isAssembly = this.form.controls.subjectType.getRawValue() === 1;

    return {
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
      isRecurring: effectiveIsRecurring,
      recurrence: effectiveIsRecurring
        ? forSeries || !original
          ? this.form.controls.recurrence.getRawValue()
          : original.recurrence
        : null,
      recurrenceMode: effectiveIsRecurring
        ? forSeries || !original
          ? this.form.controls.recurrenceMode.getRawValue()
          : original.recurrenceMode
        : null,
      recurrenceEndDate: effectiveIsRecurring
        ? forSeries || !original
          ? this.form.controls.recurrenceEndDate.getRawValue()
          : original.recurrenceEndDate
        : null,
      description: this.form.controls.description.getRawValue(),
      location: this.form.controls.location.getRawValue(),
      guests: isAssembly
        ? []
        : this.guestsArray.getRawValue().filter((guest) => guest.email),
      assembly: isAssembly
        ? {
            copyLegal: true,
            requiresPaddles:
              this.form.controls.assemblyRequiresPaddles.getRawValue(),
            paddlesQuantity:
              this.form.controls.assemblyRequiresPaddles.getRawValue()
                ? this.form.controls.assemblyPaddlesQuantity.getRawValue()
                : null,
            requiresAudioVisual:
              this.form.controls.assemblyRequiresAudioVisual.getRawValue(),
            audioVisualNotes:
              this.form.controls.assemblyRequiresAudioVisual.getRawValue()
                ? this.form.controls.assemblyAudioVisualNotes.getRawValue()
                : "",
            operationalNotes:
              this.form.controls.assemblyOperationalNotes.getRawValue(),
            specialInstructions:
              this.form.controls.assemblySpecialInstructions.getRawValue(),
            invitees: this.assemblyInviteesArray
              .getRawValue()
              .filter((invitee) => invitee.email),
          }
        : null,
    };
  }

  private buildRecurrencePreview(): string {
    if (!this.isRecurring()) {
      return "";
    }

    const recurrenceOption = this.recurrenceOptions().find(
      (item) => item.value === this.recurrence(),
    );
    const recurrenceMode = this.recurrenceMode();
    const recurrenceEndDate = this.extractDatePart(this.recurrenceEndDate());
    const meetingDate = this.extractDatePart(this.meetingDate());

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
        : ["primer", "segundo", "tercer", "cuarto", "quinto"][position - 1] ||
          "mismo";

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

