import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-presupuesto-edit-partida",
  templateUrl: "./presupuesto-edit-partida.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomButtonSave,
  ],
})
export class PresupuestoEditPartida implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);

  id: string = "";

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>(""),
    cuentaId: new FormControl<number>(0),
    cedulaPresupuestalId: new FormControl<string>(""),
    descripcion: new FormControl<string>(""),
    presupuestoMensual: new FormControl<number>(0, Validators.required),
    presupuestoEjercido: new FormControl<number>(0),
    applicationUserId: new FormControl<string>(this.authS.applicationUserId),
  });

  ngOnInit() {
    this.id = this.config.data.id;
    // Actualizamos el ID en el form
    this.form.patchValue({ id: this.id });
    this.onLoadData();
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    this.form.patchValue({
      applicationUserId: this.authS.applicationUserId,
    });
    if (!this.id) {
      this.apiResponseS
        .onPost(`CedulaPresupuestalDetalles`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`CedulaPresupuestalDetalles/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`CedulaPresupuestalDetalles/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
        this.form.patchValue({
          descripcion: result.cuenta.descripcion,
        });
      });
  }
}
