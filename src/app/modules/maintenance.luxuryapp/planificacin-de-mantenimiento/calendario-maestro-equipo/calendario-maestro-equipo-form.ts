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
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

@Component({
  selector: "app-calendario-maestro-equipo-form",
  templateUrl: "./calendario-maestro-equipo-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class CalendarioMaestroEquipoForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  cb_equipoClasificacion = signal<SelectItemDto[]>([]);
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
      .onGetSelectItem<SelectItemDto[]>(
        Endpoints.MachineryClassification.getAll,
      )
      .then((result: SelectItemDto[]) => {
        this.cb_equipoClasificacion.set(result);
      });
  }
}
