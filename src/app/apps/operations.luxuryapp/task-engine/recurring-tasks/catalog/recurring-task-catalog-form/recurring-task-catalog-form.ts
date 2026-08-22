import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputDatepicker } from "@ui/inputs/web/custom-input-datepicker-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { PanelModule } from "primeng/panel";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  RecurringTaskCatalogWorkGroup,
  RecurringTaskTemplateCatalog,
  RecurringTaskTemplateCatalogAddOrEdit,
} from "src/app/core/interfaces/recurring-tasks/recurring-task-template-catalog.interface";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { RecurrenceInput } from "../../instances/recurrence-input/recurrence-input";

interface RecurringTaskCatalogFormGroup {
  workGroupId: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  recurrenceRule: FormControl<string>;
  criticality: FormControl<string | number | null>;
  expectedDeliverableName: FormControl<string>;
  requiresAttachment: FormControl<boolean>;
  startDate: FormControl<string | Date | null>;
  endDate: FormControl<string | Date | null>;
  advanceNoticeDays: FormControl<number>;
  backupUserId: FormControl<string | null>;
}

@Component({
  selector: "app-recurring-task-catalog-form",
  templateUrl: "./recurring-task-catalog-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    PanelModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputDatepicker,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    RecurrenceInput,
  ],
})
export class RecurringTaskCatalogForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private authS = inject(AuthService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  submitting = signal(false);
  templateId = signal<string | null>(null);
  workGroups = signal<SelectItemDto[]>([]);
  criticalities = signal<SelectItemDto[]>([]);
  backupUsers = signal<SelectItemDto[]>([]);

  form: FormGroup<RecurringTaskCatalogFormGroup> = this.formBuilder.group(
    {
      workGroupId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      title: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl("", { nonNullable: true }),
      recurrenceRule: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      criticality: new FormControl<string | number | null>(null, {
        validators: [Validators.required],
      }),
      expectedDeliverableName: new FormControl("", { nonNullable: true }),
      requiresAttachment: new FormControl(false, { nonNullable: true }),
      startDate: new FormControl<string | Date | null>(new Date(), {
        validators: [Validators.required],
      }),
      endDate: new FormControl<string | Date | null>(null),
      advanceNoticeDays: new FormControl(3, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0), Validators.max(30)],
      }),
      backupUserId: new FormControl<string | null>(null),
    },
    { validators: this.backupRequiredForCriticalValidator() },
  );

  ngOnInit(): void {
    const id = this.config.data?.template?.id ?? null;
    this.templateId.set(id);

    void this.loadWorkGroups();
    void this.loadCriticalities();

    if (id) {
      void this.loadTemplate(id);
    }
  }

  async loadWorkGroups(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const applicationUserId = this.authS.applicationUserId ?? "";

    if (!customerId || !applicationUserId) {
      this.workGroups.set([]);
      return;
    }

    const response = await this.apiResponseS.onGetList<
      RecurringTaskCatalogWorkGroup[]
    >(Endpoints.TaskGroups.list(customerId, true, applicationUserId));

    this.workGroups.set(
      (response ?? [])
        .filter((group) => group.visibility !== "Público")
        .map((group) => ({ label: group.nameGroup, value: group.id })),
    );
  }

  async loadCriticalities(): Promise<void> {
    const response = await this.apiResponseS.onGetEnumSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.priorityLevel,
    );

    this.criticalities.set(response ?? []);
  }

  async loadTemplate(id: string): Promise<void> {
    const template =
      (await this.apiResponseS.onGetItem<RecurringTaskTemplateCatalog>(
        Endpoints.RecurringTaskCatalog.getById(id),
      )) ?? this.config.data?.template;

    if (!template) return;

    this.form.patchValue({
      workGroupId: template.workGroupId,
      title: template.title,
      description: template.description,
      recurrenceRule: template.recurrenceRule,
      criticality: template.criticality,
      expectedDeliverableName: template.expectedDeliverableName,
      requiresAttachment: template.requiresAttachment,
      startDate: this.toDateControlValue(template.startDate),
      endDate: this.toDateControlValue(template.endDate),
      advanceNoticeDays: template.advanceNoticeDays,
      backupUserId: template.backupUserId,
    });

    await this.loadBackupUsers(template.workGroupId);
  }

  async onWorkGroupChange(workGroupId: string | null): Promise<void> {
    this.form.controls.backupUserId.setValue(null);
    await this.loadBackupUsers(workGroupId);
  }

  async loadBackupUsers(workGroupId: string | null): Promise<void> {
    if (!workGroupId) {
      this.backupUsers.set([]);
      return;
    }

    const response = await this.apiResponseS.onGetList<SelectItemDto[]>(
      Endpoints.Tasks.participants(workGroupId),
    );

    this.backupUsers.set(response ?? []);
  }

  onSubmit(): void {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.RecurringTaskCatalog.base,
      id: this.templateId(),
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.toPayload(),
    });
  }

  isBackupRequired(): boolean {
    return this.isCriticalValue(this.form.controls.criticality.value);
  }

  isCriticalValue(value: unknown): boolean {
    const normalized = this.normalize(value);

    if (normalized === "2" || normalized === "critical") return true;
    if (normalized === "critica") return true;

    const option = this.criticalities().find(
      (item) => this.normalize(item.value) === normalized,
    );

    return option ? this.normalize(option.label) === "critica" : false;
  }

  private backupRequiredForCriticalValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const criticality = control.get("criticality")?.value;
      const backupUserId = control.get("backupUserId")?.value;

      return this.isCriticalValue(criticality) && !backupUserId
        ? { backupRequiredForCritical: true }
        : null;
    };
  }

  private toPayload(): RecurringTaskTemplateCatalogAddOrEdit {
    const value = this.form.getRawValue();

    return {
      title: value.title,
      description: value.description,
      recurrenceRule: value.recurrenceRule,
      criticality: value.criticality ?? "",
      advanceNoticeDays: value.advanceNoticeDays,
      startDate: this.toDateOnly(value.startDate),
      endDate: this.toDateOnly(value.endDate),
      workGroupId: value.workGroupId,
      backupUserId: value.backupUserId || null,
      expectedDeliverableName: value.expectedDeliverableName,
      requiresAttachment: value.requiresAttachment,
    };
  }

  private toDateControlValue(value: string | Date | null): string | Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    return new Date(value);
  }

  private toDateOnly(value: string | Date | null): string | null {
    if (!value) return null;
    if (typeof value === "string") return value.slice(0, 10);

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private normalize(value: unknown): string {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }
}
