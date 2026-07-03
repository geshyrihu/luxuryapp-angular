import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputMultiselectSignal } from "src/app/core/components/inputs/web/custom-input-multiselect-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";

interface ITaskTemplateForm {
  name: FormControl<string>;
  description: FormControl<string>;
  roleId: FormControl<string>;
  isActive: FormControl<boolean>;
  customerIds: FormControl<string[]>;
}

@Component({
  selector: "app-task-template-form",
  templateUrl: "./task-template-form.html",
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputMultiselectSignal,
  ],
})
export class TaskTemplateForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);

  submitting = signal(false);
  roles = signal<ISelectItem[]>([]);
  availableCustomers = signal<ISelectItem[]>([]);
  templateId = signal<string | null>(null);

  form: FormGroup<ITaskTemplateForm> = this.formBuilder.group({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl("", { nonNullable: true }),
    roleId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isActive: new FormControl(true, { nonNullable: true }),
    customerIds: new FormControl<string[]>([], { nonNullable: true }),
  });

  ngOnInit(): void {
    const id = this.config.data?.template?.id;
    this.templateId.set(id);

    this.loadRoles();
    this.loadAvailableCustomers();

    if (this.templateId()) {
      const template = this.config.data.template;
      this.form.patchValue(template);
      if (template.customerIds) {
        this.form.controls.customerIds.setValue(template.customerIds);
      }
    }
  }

  loadRoles() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>("ApplicationRoles")
      .then((response) => {
        this.roles.set(response || []);
      });
  }

  loadAvailableCustomers() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>("customers-active")
      .then((response) => {
        this.availableCustomers.set(response || []);
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "recurring-tasks/templates",
      id: this.templateId(),
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }
}
