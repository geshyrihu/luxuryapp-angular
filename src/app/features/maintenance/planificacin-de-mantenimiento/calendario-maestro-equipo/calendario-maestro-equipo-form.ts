import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";

@Component({
  selector: "app-calendario-maestro-equipo-form",
  templateUrl: "./calendario-maestro-equipo-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
    CardModule,
  ],
})
export class CalendarioMaestroEquipoForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  cb_equipoClasificacion = signal<ISelectItem[]>([]);
  id: string = "";
  submitting = signal(false);

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    nombreEquipo: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    equipoClasificacionId: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.onLoadEquipoClasificacion();
    this.id = this.config.data.id;
    if (this.id) {
      this.form.patchValue({ id: this.id });
      this.onLoadData(this.id);
    }
  }

  onLoadData(id: string) {
    this.apiResponseS
      .onGetItem(Endpoints.CalendarioMaestroEquipo.getById(id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.CalendarioMaestroEquipo.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }

  onLoadEquipoClasificacion() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.MachineryClassification.getAll)
      .then((result: ISelectItem[]) => {
        this.cb_equipoClasificacion.set(result);
      });
  }
}
