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
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { SanctionTypeDetailDTO } from "src/app/apps/recursos-humanos.luxuryapp/evaluaciones-de-desempeo/hr-catalog/interfaces/hr-catalog.interfaces";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { SanctionTypeFormGroup } from "./interfaces/sanction-type-form.interface";

@Component({
  selector: "app-sanction-type-form",
  templateUrl: "./sanction-type-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputSwitch,
    WebButtonLabelSave,
  ],
})
export class SanctionTypeForm implements OnInit {
  apiS = inject(ApiResponseService);
  enumS = inject(EnumSelectService);
  fb = inject(NonNullableFormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);

  // ? OBLIGATORIO: Cargar selects de enums desde el servicio
  cb_severity = signal<SelectItemDto[]>([]);

  form!: FormGroup<SanctionTypeFormGroup>;

  ngOnInit(): void {
    // Cargar opciones de enums desde el backend
    this.enumS.severityLevel(false).subscribe((items) => {
      this.cb_severity.set(items);
    });

    // El data.id viene directamente del listado: { id: 'xxx', title: 'Editar' }
    this.id = this.config.data?.id || "";

    // Inicializar formulario para modo creación
    this.form = this.fb.group<SanctionTypeFormGroup>({
      name: this.fb.control(""),
      description: this.fb.control(""),
      severityLevel: this.fb.control<number>(0),
      isTermination: this.fb.control(false),
      requiresHRApproval: this.fb.control(false),
      isActive: this.fb.control(true),
    });

    if (this.id) this.onLoadData();
  }

  onLoadData(): void {
    // El backend retorna SanctionTypeDetailDTO con SeverityLevel como int (valor numírico del enum)
    this.apiS
      .onGetItem<SanctionTypeDetailDTO>(
        Endpoints.Settings.sanctionTypeById(this.id),
      )
      .then((result) => {
        if (result) {
          // ? No se necesita conversión - el backend ya retorna el valor numírico correcto
          this.form.patchValue(result);
        }
      });
  }

  onSubmit(): void {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: Endpoints.Settings.sanctionTypes,
      id: this.id || null,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  onCancel(): void {
    this.ref.close();
  }
}
