import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ETipoGasto } from "src/app/core/enums/tipo-gasto.enum";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { FormHelper } from "src/app/core/helpers/form-helper";

@Component({
  selector: "app-create-orden-compra",
  templateUrl: "./create-orden-compra.html",
  imports: [
    ReactiveFormsModule,
    CustomInputAutoComplete,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
  ],
})
export class CreateOrdenCompra implements OnInit {
  apiResponseS = inject(ApiResponseService);
  router = inject(Router);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);
  providerId = signal<number>(0);

  // Signal para ComboBox
  cb_providers = signal<ISelectItem[]>([]);

  // Control separado para el proveedor (fuera del form)
  providerControl = new FormControl(null, Validators.required);

  solicitudCompraId: string = "";
  solicitudCompra: any;
  ordenCompraId: string = "";
  posicionCotizacion: number = 0;

  form: FormGroup = new FormGroup({
    id: new FormControl(0, [Validators.required]),
    customerId: new FormControl(this.customerIdS.customerId(), [
      Validators.required,
    ]),
    folio: new FormControl(""),
    indice: new FormControl(0),
    fechaSolicitud: new FormControl("", [Validators.required]),
    solicitudCompraId: new FormControl("", { nonNullable: true }),
    folioSolicitudCompra: new FormControl(""),
    urlFile: new FormControl(""),
    equipoOInstalacion: new FormControl("", [Validators.required]),
    justificacionGasto: new FormControl("", [Validators.required]),
    notasEspeciales: new FormControl(""),
    revisadoPorResidente: new FormControl(""),
    TipoGasto: new FormControl(ETipoGasto.Variable),
    applicationUserId: new FormControl(this.authS.applicationUserId),
  });

  async ngOnInit(): Promise<void> {
    this.solicitudCompraId = this.config.data.solicitudCompraId || "";
    this.posicionCotizacion = this.config.data.posicionCotizacion ?? 0;

    // Establecer TipoGasto
    const tipoGasto = this.config.data.tipoGasto ?? ETipoGasto.Variable;
    this.form.patchValue({
      TipoGasto: tipoGasto,
      fechaSolicitud: this.dateS.getDateNow(),
      solicitudCompraId: this.solicitudCompraId,
    });

    await this.onLoadSelectItemProvider();

    if (this.solicitudCompraId) {
      await this.onLoadSolicitudCompra();
    }
  }

  async onLoadSelectItemProvider(): Promise<void> {
    const result: any = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      `providers/${this.customerIdS.customerId()}`,
    );
    this.cb_providers.set(result as ISelectItem[]);
  }

  async onLoadSolicitudCompra(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      `SolicitudCompra/${this.solicitudCompraId}`,
    );

    this.solicitudCompra = result;

    this.form.patchValue({
      equipoOInstalacion: result.equipoOInstalacion,
      justificacionGasto: result.justificacionGasto,
      folioSolicitudCompra: this.config.data.folioSolicitudCompra,
    });
  }

  saveProviderId = (item: ISelectItem) => {
    this.providerId.set(item?.value);
    this.providerControl.setValue(item?.label);
  };

  async onSubmit() {
    const isNew = !this.ordenCompraId;
    const urlApi = isNew
      ? `ordencompra/${this.providerId()}/${this.posicionCotizacion}/${this.solicitudCompraId}`
      : `OrdenCompra/${this.ordenCompraId}`;

    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: urlApi,
      method: isNew ? "POST" : "PUT",
      ref: this.ref,
      submitting: this.submitting,
      closeOnSuccess: false,
    });

    if (result) {
      this.ref.close(result.id);
      if (isNew) {
        this.router.navigateByUrl(`/purchases/orden-compra/${result.id}`);
      }
    }
  }
}









