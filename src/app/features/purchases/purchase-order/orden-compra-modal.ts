import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DateService } from "src/app/core/services/date.service";

interface IModalOrdenCompra {
  id: FormControl<string | null>;
  fechaSolicitud: FormControl<Date | null>;
  equipoOInstalacion: FormControl<string>;
  justificacionGasto: FormControl<string>;
  notasEspeciales: FormControl<string>;
  urlFile: FormControl<string | null>;
  folio: FormControl<string | null>;
  indice: FormControl<string | null>;
  folioSolicitudCompra: FormControl<string | null>;
  isDevolucion: FormControl<boolean>;
  customerId: FormControl<string>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-orden-compra-modal",
  templateUrl: "./orden-compra-modal.html",
  imports: [
    ReactiveFormsModule,
    CustomInputDateSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
    ToggleSwitchModule,
  ],
})
export class ModalOrdenCompra implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private dateS = inject(DateService);
  private ref = inject(DynamicDialogRef);
  submitting = signal(false);

  ordenCompraId: string = "";

  form: FormGroup<IModalOrdenCompra> = this.formB.group({
    id: new FormControl({ value: null, disabled: true }),
    fechaSolicitud: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    equipoOInstalacion: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    justificacionGasto: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    notasEspeciales: new FormControl("", {
      nonNullable: true,
    }),
    urlFile: new FormControl(""),
    folio: new FormControl(""),
    indice: new FormControl("0"),
    folioSolicitudCompra: new FormControl(""),
    isDevolucion: new FormControl(false, { nonNullable: true }),
    customerId: new FormControl("", { nonNullable: true }),
    applicationUserId: new FormControl(this.authS.applicationUserId, {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompra?.id || "";
    if (this.ordenCompraId) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`OrdenCompra/GetForEdit/${this.ordenCompraId}`)
      .then((result: any) => {
        this.form.patchValue(result);
        if (result.fechaSolicitud) {
          const date = new Date(result.fechaSolicitud);
          // Compensamos el offset para obtener la fecha local "real" sin desfases de UTC
          const userTimezoneOffset = date.getTimezoneOffset() * 60000;
          const localDate = new Date(date.getTime() + userTimezoneOffset);
          this.form.controls.fechaSolicitud.setValue(localDate);
        }
      });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting.set(true);

    this.apiResponseS
      .onPut(`OrdenCompra/${this.ordenCompraId}`, this.form.getRawValue())
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}









