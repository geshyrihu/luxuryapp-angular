import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  AddendumTemplateAddOrEditDTO,
  AddendumTemplateListDTO,
  EAddendumType,
} from './interfaces/addendum-template.dto';

interface IAddendumTemplateForm {
  name: import("@angular/forms").FormControl<string>;
  description: import("@angular/forms").FormControl<string>;
  addendumType: import("@angular/forms").FormControl<EAddendumType>;
  templateContent: import("@angular/forms").FormControl<string>;
  version: import("@angular/forms").FormControl<string>;
  isActive: import("@angular/forms").FormControl<boolean>;
}

@Component({
  selector: "app-addendum-template-form",
  templateUrl: "./addendum-template-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputSwitch,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    WebButtonLabel,
  ],
})
export class AddendumTemplateFormComponent {
  apiS = inject(ApiResponseService);
  fb = inject(NonNullableFormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  item = signal<AddendumTemplateListDTO | null>(null);
  isEdit = signal(false);
  submitting = signal(false);
  form!: FormGroup<IAddendumTemplateForm>;

  cb_addendumType: SelectItemDto[] = [
    { value: "ModificacionSalario", label: "Modificación de Salario" },
    { value: "CambioPuesto", label: "Cambio de Puesto" },
    { value: "CambioDepartamento", label: "Cambio de Departamento" },
    { value: "CambioUbicacion", label: "Cambio de Ubicación" },
    { value: "ExtensionContrato", label: "Extensión de Contrato" },
    { value: "ModificacionJornada", label: "Modificación de Jornada" },
    { value: "ClausulaAdicional", label: "Clóusula Adicional" },
    { value: "OtrasCondiciones", label: "Otra Condición" },
  ];

  placeholderText =
    "Usa {{ADENDA_NUMERO}}, {{VALOR_ANTERIOR}}, {{VALOR_NUEVO}}, {{FECHA_EFECTIVA}} como variables dinámicas";

  ngOnInit(): void {
    const data = this.config.data?.item as AddendumTemplateListDTO | null;
    this.item.set(data);
    this.isEdit.set(!!data);

    if (data) {
      this.form.patchValue(data);
    } else {
      this.form = this.fb.group<IAddendumTemplateForm>({
        name: this.fb.control(""),
        description: this.fb.control(""),
        addendumType: this.fb.control("ModificacionSalario" as EAddendumType),
        templateContent: this.fb.control(""),
        version: this.fb.control("1.0"),
        isActive: this.fb.control(true),
      });
    }
  }

  onSubmit(): void {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: "hr/addendum-templates",
      id: this.item()?.id ?? null,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (value) => {
        const dto: AddendumTemplateAddOrEditDTO = {
          name: value.name,
          description: value.description || undefined,
          addendumType: value.addendumType,
          templateContent: value.templateContent,
          version: value.version,
          isActive: value.isActive,
        };
        return dto;
      },
    });
  }

  onCancel(): void {
    this.ref.close();
  }
}
