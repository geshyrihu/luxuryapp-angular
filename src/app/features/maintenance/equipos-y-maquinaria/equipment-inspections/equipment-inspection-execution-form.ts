import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit, signal } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import {
  EquipmentInspectionExecutionCompleteDTO,
  EquipmentInspectionExecutionDetailDTO,
} from "./equipment-inspection.models";
import { EquipmentInspectionService } from "./equipment-inspection.service";

interface ExecutionItemFormGroup {
  equipmentInspectionCriterionId: FormControl<string>;
  criterionTitle: FormControl<string>;
  criterionDescription: FormControl<string>;
  isCompliant: FormControl<boolean>;
  observation: FormControl<string>;
}

interface ExecutionFormGroup {
  severity: FormControl<number>;
  observations: FormControl<string>;
  items: FormArray<FormGroup<ExecutionItemFormGroup>>;
}

@Component({
  selector: "app-equipment-inspection-execution-form",
  templateUrl: "./equipment-inspection-execution-form.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
  ],
})
export class EquipmentInspectionExecutionForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private equipmentInspectionS = inject(EquipmentInspectionService);

  public ref = inject(DynamicDialogRef, { optional: true });
  public config = inject(DynamicDialogConfig, { optional: true });

  executionIdInput = input<string | null>(null);
  definitionIdInput = input<string | null>(null);
  qrCodeInput = input<string | null>(null);
  suggestedDefinitionIdInput = input<string | null>(null);

  submitting = signal(false);
  loading = signal(true);
  detail = signal<EquipmentInspectionExecutionDetailDTO | null>(null);

  severityOptions = this.equipmentInspectionS.severityOptions;

  form: FormGroup<ExecutionFormGroup> = this.formBuilder.group({
    severity: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    observations: new FormControl("", { nonNullable: true }),
    items: this.formBuilder.array<FormGroup<ExecutionItemFormGroup>>([]),
  });

  ngOnInit(): void {
    this.bootstrapExecution();
  }

  get items(): FormArray<FormGroup<ExecutionItemFormGroup>> {
    return this.form.controls.items;
  }

  async bootstrapExecution(): Promise<void> {
    this.loading.set(true);
    try {
      let detail: EquipmentInspectionExecutionDetailDTO | null = null;
      const executionId =
        this.executionIdInput() || this.config?.data?.executionId || null;
      const definitionId =
        this.definitionIdInput() || this.config?.data?.definitionId || null;
      const qrCode = this.qrCodeInput() || this.config?.data?.qrCode || null;
      const suggestedDefinitionId =
        this.suggestedDefinitionIdInput() ||
        this.config?.data?.suggestedDefinitionId ||
        null;

      if (executionId) {
        detail = await this.equipmentInspectionS.getExecutionById(executionId);
      } else if (qrCode) {
        const started = await this.equipmentInspectionS.startFromQrExecution(
          qrCode,
          suggestedDefinitionId,
        );
        detail = started === false ? null : started;
      } else if (definitionId) {
        const started =
          await this.equipmentInspectionS.startManualExecution(definitionId);
        detail = started === false ? null : started;
      }

      if (detail) {
        this.detail.set(detail);
        this.patchForm(detail);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.apiResponseS.validateForm(this.form)) {
      return;
    }

    const detail = this.detail();
    if (!detail) {
      return;
    }

    this.submitting.set(true);
    try {
      const payload = this.buildPayload();
      const result = await this.equipmentInspectionS.completeExecution(
        detail.id,
        payload,
      );

      if (result !== false) {
        this.equipmentInspectionS.notifyExecutionChanged();
        this.ref?.close(true);
      }
    } finally {
      this.submitting.set(false);
    }
  }

  private buildPayload(): EquipmentInspectionExecutionCompleteDTO {
    const value = this.form.getRawValue();
    return {
      severity: value.severity as 1 | 2 | 3,
      observations: value.observations || null,
      items: value.items.map((item) => ({
        equipmentInspectionCriterionId: item.equipmentInspectionCriterionId,
        isCompliant: item.isCompliant,
        observation: item.observation || null,
      })),
      images: [],
    };
  }

  private patchForm(detail: EquipmentInspectionExecutionDetailDTO): void {
    this.form.patchValue({
      severity: detail.severity || 1,
      observations: detail.observations || "",
    });

    this.items.clear();
    detail.items
      .sort((a, b) => a.position - b.position)
      .forEach((item) => {
        this.items.push(
          this.formBuilder.group({
            equipmentInspectionCriterionId: new FormControl(
              item.equipmentInspectionCriterionId,
              {
                nonNullable: true,
              },
            ),
            criterionTitle: new FormControl(item.criterionTitle, {
              nonNullable: true,
            }),
            criterionDescription: new FormControl(
              item.criterionDescription || "",
              { nonNullable: true },
            ),
            isCompliant: new FormControl(item.isCompliant, {
              nonNullable: true,
            }),
            observation: new FormControl(item.observation || "", {
              nonNullable: true,
            }),
          }),
        );
      });
  }
}
