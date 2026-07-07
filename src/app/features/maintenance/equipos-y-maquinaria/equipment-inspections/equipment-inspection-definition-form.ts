import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputMultiselectSignal } from "@ui/inputs/web/custom-input-multiselect-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  EquipmentInspectionDefinitionAddOrEditDTO,
  EquipmentInspectionDefinitionDTO,
} from "./equipment-inspection.models";
import { EquipmentInspectionService } from "./equipment-inspection.service";

interface CriterionFormGroup {
  title: FormControl<string>;
  description: FormControl<string>;
  isRequired: FormControl<boolean>;
  isActive: FormControl<boolean>;
}

interface DefinitionFormGroup {
  name: FormControl<string>;
  description: FormControl<string>;
  isActive: FormControl<boolean>;
  recurrenceUnit: FormControl<number>;
  recurrenceInterval: FormControl<number>;
  dayOfMonth: FormControl<number | null>;
  estimatedDurationMinutes: FormControl<number | null>;
  assigneeIds: FormControl<string[]>;
  primaryAssigneeId: FormControl<string | null>;
  weekDays: FormControl<number[]>;
  criteria: FormArray<FormGroup<CriterionFormGroup>>;
}

@Component({
  selector: "app-equipment-inspection-definition-form",
  templateUrl: "./equipment-inspection-definition-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    WebButtonLabel,
    WebButtonLabelItem,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputMultiselectSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
  ],
})
export class EquipmentInspectionDefinitionForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private customerIdS = inject(CustomerIdService);
  private equipmentInspectionS = inject(EquipmentInspectionService);

  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  submitting = signal(false);
  definitionId = signal<string | null>(null);
  userOptions = signal<ISelectItem[]>([]);

  recurrenceOptions = this.equipmentInspectionS.recurrenceOptions;
  weekDayOptions = this.equipmentInspectionS.weekDayOptions;

  form: FormGroup<DefinitionFormGroup> = this.formBuilder.group({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl("", { nonNullable: true }),
    isActive: new FormControl(true, { nonNullable: true }),
    recurrenceUnit: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    recurrenceInterval: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    dayOfMonth: new FormControl<number | null>(null),
    estimatedDurationMinutes: new FormControl<number | null>(null),
    assigneeIds: new FormControl<string[]>([], { nonNullable: true }),
    primaryAssigneeId: new FormControl<string | null>(null),
    weekDays: new FormControl<number[]>([], { nonNullable: true }),
    criteria: this.formBuilder.array<FormGroup<CriterionFormGroup>>([]),
  });

  criteria = computed(() => this.form.controls.criteria.controls);
  isWeekly = computed(() => this.form.controls.recurrenceUnit.value === 2);
  isMonthly = computed(() => this.form.controls.recurrenceUnit.value === 3);
  primaryAssigneeOptions = computed(() =>
    this.userOptions().filter((item) =>
      this.form.controls.assigneeIds.value.includes(item.value),
    ),
  );

  async ngOnInit(): Promise<void> {
    this.definitionId.set(this.config.data?.id || null);
    this.userOptions.set(
      await this.equipmentInspectionS.getUserOptionsByCustomer(),
    );

    this.form.controls.assigneeIds.valueChanges.subscribe((assigneeIds) => {
      const primary = this.form.controls.primaryAssigneeId.value;
      if (!primary || !assigneeIds.includes(primary)) {
        this.form.controls.primaryAssigneeId.setValue(assigneeIds[0] || null);
      }
    });

    if (this.definitionId()) {
      const detail = await this.equipmentInspectionS.getDefinitionById(
        this.definitionId()!,
      );
      if (detail) {
        this.patchForm(detail);
      }
      return;
    }

    this.addCriterion();
  }

  onRecurrenceChange(): void {
    if (!this.isWeekly()) {
      this.form.controls.weekDays.setValue([]);
      this.form.controls.weekDays.setErrors(null);
    }

    if (!this.isMonthly()) {
      this.form.controls.dayOfMonth.setValue(null);
    }
  }

  addCriterion(): void {
    this.form.controls.criteria.push(this.createCriterionGroup());
  }

  removeCriterion(index: number): void {
    this.form.controls.criteria.removeAt(index);
  }

  async saveDefinition(): Promise<void> {
    if (!this.validateBeforeSubmit()) {
      return;
    }

    this.submitting.set(true);
    try {
      const payload = this.buildPayload();
      const result = this.definitionId()
        ? await this.equipmentInspectionS.updateDefinition(
            this.definitionId()!,
            payload,
          )
        : await this.equipmentInspectionS.createDefinition(payload);

      if (result !== false) {
        this.ref.close(true);
      }
    } finally {
      this.submitting.set(false);
    }
  }

  private validateBeforeSubmit(): boolean {
    if (this.form.controls.criteria.length === 0) {
      this.addCriterion();
    }

    if (this.isWeekly() && this.form.controls.weekDays.value.length === 0) {
      this.form.controls.weekDays.setErrors({ required: true });
      this.form.controls.weekDays.markAsTouched();
    }

    return this.apiResponseS.validateForm(this.form);
  }

  private buildPayload(): EquipmentInspectionDefinitionAddOrEditDTO {
    const value = this.form.getRawValue();

    return {
      customerId: this.customerIdS.customerId(),
      machineryId: this.config.data.machineryId,
      name: value.name,
      description: value.description || null,
      isActive: value.isActive,
      recurrenceUnit: value.recurrenceUnit as 1 | 2 | 3,
      recurrenceInterval: value.recurrenceInterval,
      dayOfMonth: value.recurrenceUnit === 3 ? value.dayOfMonth : null,
      estimatedDurationMinutes: value.estimatedDurationMinutes,
      createdByUserId: this.authS.applicationUserId || "",
      assignees: value.assigneeIds.map((applicationUserId) => ({
        applicationUserId,
        isPrimary: value.primaryAssigneeId === applicationUserId,
      })),
      weekDays: value.recurrenceUnit === 2 ? value.weekDays : [],
      criteria: value.criteria.map((criterion, index) => ({
        title: criterion.title,
        description: criterion.description || null,
        position: index + 1,
        isRequired: criterion.isRequired,
        isActive: criterion.isActive,
      })),
    };
  }

  private patchForm(definition: EquipmentInspectionDefinitionDTO): void {
    this.form.patchValue({
      name: definition.name,
      description: definition.description || "",
      isActive: definition.isActive,
      recurrenceUnit: definition.recurrenceUnit,
      recurrenceInterval: definition.recurrenceInterval,
      dayOfMonth: definition.dayOfMonth,
      estimatedDurationMinutes: definition.estimatedDurationMinutes,
      assigneeIds: definition.assignees.map((item) => item.applicationUserId),
      primaryAssigneeId:
        definition.assignees.find((item) => item.isPrimary)
          ?.applicationUserId || null,
      weekDays: definition.weekDays || [],
    });

    this.form.controls.criteria.clear();
    definition.criteria
      .sort((a, b) => a.position - b.position)
      .forEach((criterion) => {
        this.form.controls.criteria.push(
          this.createCriterionGroup({
            title: criterion.title,
            description: criterion.description || "",
            isRequired: criterion.isRequired,
            isActive: criterion.isActive,
          }),
        );
      });

    if (this.form.controls.criteria.length === 0) {
      this.addCriterion();
    }
  }

  private createCriterionGroup(
    value?: Partial<{
      title: string;
      description: string;
      isRequired: boolean;
      isActive: boolean;
    }>,
  ): FormGroup<CriterionFormGroup> {
    return this.formBuilder.group({
      title: new FormControl(value?.title || "", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl(value?.description || "", {
        nonNullable: true,
      }),
      isRequired: new FormControl(value?.isRequired ?? true, {
        nonNullable: true,
      }),
      isActive: new FormControl(value?.isActive ?? true, {
        nonNullable: true,
      }),
    });
  }
}
