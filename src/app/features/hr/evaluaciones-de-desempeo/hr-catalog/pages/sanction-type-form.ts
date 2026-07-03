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
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { SanctionTypeDetailDTO } from "../models/hr-catalog.interfaces";

interface ISanctionTypeForm {
  name: import("@angular/forms").FormControl<string>;
  description: import("@angular/forms").FormControl<string>;
  severityLevel: import("@angular/forms").FormControl<number>;
  isTermination: import("@angular/forms").FormControl<boolean>;
  requiresHRApproval: import("@angular/forms").FormControl<boolean>;
  isActive: import("@angular/forms").FormControl<boolean>;
}

@Component({
  selector: "app-sanction-type-form",
  templateUrl: "./sanction-type-form.html",
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
  cb_severity = signal<ISelectItem[]>([]);

  form!: FormGroup<ISanctionTypeForm>;

  ngOnInit(): void {
    // Cargar opciones de enums desde el backend
    this.enumS.severityLevel(false).subscribe((items) => {
      this.cb_severity.set(items);
    });

    // El data.id viene directamente del listado: { id: 'xxx', title: 'Editar' }
    this.id = this.config.data?.id || "";

    // Inicializar formulario para modo creación
    this.form = this.fb.group<ISanctionTypeForm>({
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
