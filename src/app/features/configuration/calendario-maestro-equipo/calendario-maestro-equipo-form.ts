import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";

@Component({
  selector: "app-calendario-maestro-equipo-form",
  templateUrl: "./calendario-maestro-equipo-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
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
    const url = `CalendarioMaestroEquipo/${id}`;
    this.apiResponseS.onGetItem(url).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    if (!this.id) {
      this.apiResponseS
        .onPost(`CalendarioMaestroEquipo`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`CalendarioMaestroEquipo/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }

  onLoadEquipoClasificacion() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>("EquipoClasificacion")
      .then((result: ISelectItem[]) => {
        this.cb_equipoClasificacion.set(result);
      });
  }
}
