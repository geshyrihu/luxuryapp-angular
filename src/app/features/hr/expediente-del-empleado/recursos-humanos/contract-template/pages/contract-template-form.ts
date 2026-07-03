import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import {
  ContractTemplateListDTO,
  EContractType,
} from "../models/contract-template.dto";

interface IContractTemplateForm {
  name: import("@angular/forms").FormControl<string>;
  description: import("@angular/forms").FormControl<string>;
  contractType: import("@angular/forms").FormControl<EContractType>;
  templateContent: import("@angular/forms").FormControl<string>;
  version: import("@angular/forms").FormControl<string>;
  isActive: import("@angular/forms").FormControl<boolean>;
}

@Component({
  selector: "app-contract-template-form",
  templateUrl: "./contract-template-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputSwitch,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class ContractTemplateFormComponent implements OnInit {
  apiS = inject(ApiResponseService);
  fb = inject(NonNullableFormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  item = signal<ContractTemplateListDTO | null>(null);
  isEdit = signal(false);
  submitting = signal(false);
  placeholderText =
    "Usa {{EMPLEADO_NOMBRE}}, {{SALARIO}}, {{FECHA_INICIO}} como variables dinámicas";

  form: FormGroup<IContractTemplateForm> = this.fb.group<IContractTemplateForm>(
    {
      name: this.fb.control(""),
      description: this.fb.control(""),
      contractType: this.fb.control<EContractType>("Indeterminado"),
      templateContent: this.fb.control(""),
      version: this.fb.control("1.0"),
      isActive: this.fb.control(true),
    },
  );

  cb_contractType: ISelectItem[] = [
    { value: "Indeterminado", label: "Indeterminado" },
    { value: "Determinado", label: "Determinado" },
    { value: "Temporal", label: "Temporal / Estacional" },
    { value: "ObraDeterminada", label: "Por Obra Determinada" },
    { value: "Practicas", label: "Prácticas Profesionales" },
    { value: "Outsourcing", label: "Outsourcing" },
    { value: "Honorarios", label: "Honorarios" },
  ];

  ngOnInit(): void {
    const data = this.config.data?.item as ContractTemplateListDTO | null;
    if (data) {
      this.item.set(data);
      this.isEdit.set(true);
      this.form.patchValue(data);
      this.apiS
        .onGetItem<{
          templateContent: string;
        }>(Endpoints.HR.ContractTemplate.getById(data.id))
        .then((resp) => {
          if (resp?.templateContent) {
            this.form.controls.templateContent.setValue(resp.templateContent);
          }
        });
    }
  }

  onSubmit(): void {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: "hr/contract-templates",
      id: this.item()?.id ?? null,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  onCancel(): void {
    this.ref.close();
  }
}
