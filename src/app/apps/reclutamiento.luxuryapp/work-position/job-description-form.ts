import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { LxModal } from "@ui/adaptive/modal/modal";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AiService } from "src/app/core/services/ai.service";

@Component({
  selector: "app-job-description-form",
  templateUrl: "./job-description-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputSwitch,
    WebButtonLabel,
    WebButtonLabelSave,
    LxModal,
  ],
})
export class JobDescriptionForm implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  readonly apiS = inject(ApiResponseService);
  private aiS = inject(AiService);

  submitting = signal(false);
  generatingProposal = signal(false);
  analyzingDescription = signal(false);
  showAnalysisDialog = signal(false);
  analysisResult = signal("");
  showInstructionsDialog = signal(false);
  customInstructions = "";

  id = signal<string | null>(null);
  workPositionId = signal<string | null>(null);
  applicationRoleName = signal<string>("");

  form = this.fb.nonNullable.group({
    id: [{ value: "", disabled: true }],
    summary: ["", [Validators.required, Validators.minLength(5)]],
    responsibilities: ["", [Validators.required]],
    skills: ["", [Validators.required]],
    additionalRequirements: ["", [Validators.required]],
    workEnvironment: ["", [Validators.required]],
    requiresWeekendShift: [false as boolean],
    workPositionId: ["", [Validators.required]],
  });

  ngOnInit(): void {
    const data = this.config.data;
    if (data.id) this.id.set(data.id);
    this.workPositionId.set(data.workPositionId);
    this.applicationRoleName.set(data.applicationRoleName);

    this.form.patchValue({ workPositionId: data.workPositionId });

    if (this.id()) {
      this.onLoadData();
    }
  }

  async onLoadData() {
    const result = await this.apiS.onGetItem<any>(
      `job-descriptions/${this.id()}`,
    );
    if (result) {
      this.form.patchValue(result);
    }
  }

  openInstructionsDialog() {
    this.showInstructionsDialog.set(true);
  }

  async generateProposal() {
    this.showInstructionsDialog.set(false);
    this.generatingProposal.set(true);
    try {
      const proposal = await this.aiS.generateJobDescription(
        this.applicationRoleName(),
        this.customInstructions,
      );
      if (proposal) {
        this.form.patchValue({
          summary: proposal.summary,
          responsibilities: proposal.responsibilities,
          skills: proposal.skills,
          additionalRequirements: proposal.additionalRequirements,
          workEnvironment: proposal.workEnvironment,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.generatingProposal.set(false);
    }
  }

  async analyzeDescription() {
    const description = `
      Summary: ${this.form.controls.summary.value}
      Responsibilities: ${this.form.controls.responsibilities.value}
      Skills: ${this.form.controls.skills.value}
    `;

    if (!description.trim()) return;

    this.analyzingDescription.set(true);
    try {
      const analysis = await this.aiS.analyzeJobDescription(
        description,
        this.applicationRoleName(),
      );
      if (analysis) {
        this.analysisResult.set(analysis);
        this.showAnalysisDialog.set(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.analyzingDescription.set(false);
    }
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: "job-descriptions",
      id: this.id(),
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
