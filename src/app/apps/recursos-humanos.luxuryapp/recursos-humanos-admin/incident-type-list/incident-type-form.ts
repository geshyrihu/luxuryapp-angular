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
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { IncidentTypeDetailDTO } from 'src/app/apps/recursos-humanos.luxuryapp/evaluaciones-de-desempeo/hr-catalog/interfaces/hr-catalog.interfaces';
import { IncidentTypeFormGroup } from "./interfaces/incident-type-form.interface";

@Component({
  selector: "app-incident-type-form",
  templateUrl: "./incident-type-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputSwitch,
    WebButtonLabelSave,
  ],
})
export class IncidentTypeForm implements OnInit {
  apiS = inject(ApiResponseService);
  enumS = inject(EnumSelectService);
  fb = inject(NonNullableFormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);

  // ? OBLIGATORIO: Cargar selects de enums desde el servicio
  cb_category = signal<SelectItemDto[]>([]);
  cb_severity = signal<SelectItemDto[]>([]);

  form!: FormGroup<IncidentTypeFormGroup>;

  ngOnInit(): void {
    // Cargar opciones de enums desde el backend
    this.enumS.incidentCategory(false).subscribe((items) => {
      this.cb_category.set(items);
    });
    this.enumS.severityLevel(false).subscribe((items) => {
      this.cb_severity.set(items);
    });

    // El data.id viene directamente del listado: { id: 'xxx', title: 'Editar' }
    this.id = this.config.data?.id || "";

    // Inicializar formulario para modo creación
    this.form = this.fb.group<IncidentTypeFormGroup>({
      name: this.fb.control(""),
      description: this.fb.control(""),
      category: this.fb.control<number>(0),
      defaultSeverity: this.fb.control<number>(0),
      isActive: this.fb.control(true),
    });

    if (this.id) this.onLoadData();
  }

  onLoadData(): void {
    // El backend retorna IncidentTypeDetailDTO con Category y DefaultSeverity como int (valor numírico del enum)
    this.apiS
      .onGetItem<IncidentTypeDetailDTO>(
        Endpoints.Settings.incidentTypeById(this.id),
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
      endpoint: Endpoints.Settings.incidentTypes,
      id: this.id || null,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  onCancel(): void {
    this.ref.close();
  }
}
