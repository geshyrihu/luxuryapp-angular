import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";

interface ICuadroComparativoAddProveedor {
  solicitudCompraId: FormControl<string>;
  nameProvider: FormControl<string>;
  fechaCotizacion: FormControl<string>;
  numeroCotizacion: FormControl<number | null>;
  garantia: FormControl<string>;
  entrega: FormControl<string>;
  politicaPago: FormControl<string>;
  file: FormControl<File | null>;
}

@Component({
  selector: "app-cuadro-comparativo-add-proveedor",
  templateUrl: "./cuadro-comparativo-add-proveedor.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputNumberSignal,
    WebButtonLabelSave,
    CustomInputFile,
  ],
})
export class CuadroComparativoAddProveedor implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  dateS = inject(DateService);
  submitting = signal(false);

  form: FormGroup<ICuadroComparativoAddProveedor> = this.formB.group({
    solicitudCompraId: new FormControl(this.config.data.solicitudCompraId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    nameProvider: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fechaCotizacion: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    numeroCotizacion: new FormControl<number | null>(null),
    garantia: new FormControl("", { nonNullable: true }),
    entrega: new FormControl("", { nonNullable: true }),
    politicaPago: new FormControl("", { nonNullable: true }),
    file: new FormControl<File | null>(null),
  });

  ngOnInit(): void {}
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.submitting.set(true);

    const formData = new FormData();
    formData.append(
      "SolicitudCompraId",
      String(this.form.controls.solicitudCompraId.value),
    );
    formData.append("NameProvider", this.form.controls.nameProvider.value);

    let fecha = this.form.controls.fechaCotizacion.value;
    if (fecha) {
      fecha = this.dateS.getDateFormat(fecha) ?? "";
      formData.append("FechaCotizacion", fecha);
    }

    if (this.form.controls.numeroCotizacion.value) {
      formData.append(
        "NumeroCotizacion",
        String(this.form.controls.numeroCotizacion.value),
      );
    }

    formData.append("Garantia", this.form.controls.garantia.value);
    formData.append("Entrega", this.form.controls.entrega.value);
    formData.append("PoliticaPago", this.form.controls.politicaPago.value);

    const file = this.form.controls.file.value;
    if (file) {
      formData.append("File", file);
    }

    this.apiResponseS
      .onPostFile(Endpoints.RefactorSupplier.cotizacionproveedor, formData)
      .then((result: any) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
