import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  ContractTemplateListDTO,
  EContractType,
} from "./interfaces/contract-template.dto";

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
  changeDetection: ChangeDetectionStrategy.Eager,
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

  cb_contractType: SelectItemDto[] = [
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
