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
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { AsambleaChecklistTemplateAddOrEditDto } from "./interfaces/asamblea-checklist-template-add-or-edit.dto";
import { AsambleaChecklistTemplateFormGroup } from "./interfaces/asamblea-checklist-template-form.interface";

@Component({
  selector: "app-asamblea-checklist-template-form",
  templateUrl: "./asamblea-checklist-template-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    CustomInputSwitch,
    WebButtonLabelSave,
  ],
})
export class AsambleaChecklistTemplateForm implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly submitting = signal(false);
  readonly roleOptions = signal<SelectItemDto[]>(this.buildRoleOptions());
  id = "";

  form = new FormGroup<AsambleaChecklistTemplateFormGroup>({
    id: new FormControl<string | null>({ value: "", disabled: true }),
    code: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    title: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(250)],
    }),
    category: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.maxLength(1000)],
    }),
    offsetDaysFromMeeting: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    defaultResponsibleRole: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isMandatory: new FormControl(true, { nonNullable: true }),
    isActive: new FormControl(true, { nonNullable: true }),
    sortOrder: new FormControl(10, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data?.id || "";
    if (this.id) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<AsambleaChecklistTemplateAddOrEditDto>(
        Endpoints.AsambleaChecklistTemplate.getById(this.id),
      )
      .then((result) => {
        if (result) {
          this.form.patchValue(result);
        }
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.AsambleaChecklistTemplate.create,
      id: this.id || null,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (value: AsambleaChecklistTemplateAddOrEditDto) => ({
        ...value,
        code: value.code?.trim().toUpperCase(),
        title: value.title?.trim(),
        category: value.category?.trim(),
        description: value.description?.trim(),
      }),
    });
  }

  private buildRoleOptions(): SelectItemDto[] {
    return Object.values(ApplicationRole).map((role) => ({
      label: this.formatRole(role),
      value: role,
    }));
  }

  private formatRole(role: string): string {
    return role.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ");
  }
}
