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
import { Router } from "@angular/router";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { TipoGasto } from "src/app/core/interfaces/tipo-gasto.enum";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DateService } from "src/app/core/services/date.service";
import { ROUTES } from "src/app/routing/route-paths";

@Component({
  selector: "app-create-orden-compra",
  templateUrl: "./create-orden-compra.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    InputAutocomplete,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
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
  cb_providers = signal<SelectItemDto[]>([]);

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
    TipoGasto: new FormControl(TipoGasto.Variable),
    applicationUserId: new FormControl(this.authS.applicationUserId),
  });

  async ngOnInit(): Promise<void> {
    this.solicitudCompraId = this.config.data.solicitudCompraId || "";
    this.posicionCotizacion = this.config.data.posicionCotizacion ?? 0;

    // Establecer TipoGasto
    const tipoGasto = this.config.data.tipoGasto ?? TipoGasto.Variable;
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
    const result: any = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.providers(this.customerIdS.customerId()),
    );
    this.cb_providers.set(result as SelectItemDto[]);
  }

  async onLoadSolicitudCompra(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.PurchaseRequests.getById(this.solicitudCompraId),
    );

    this.solicitudCompra = result;

    this.form.patchValue({
      equipoOInstalacion: result.equipoOInstalacion,
      justificacionGasto: result.justificacionGasto,
      folioSolicitudCompra: this.config.data.folioSolicitudCompra,
    });
  }

  saveProviderId = (item: SelectItemDto) => {
    this.providerId.set(item?.value);
    this.providerControl.setValue(item?.label);
  };

  async onSubmit() {
    const isNew = !this.ordenCompraId;
    const urlApi = isNew
      ? Endpoints.PurchaseOrders.create(
          this.providerId(),
          this.posicionCotizacion,
          this.solicitudCompraId,
        )
      : Endpoints.PurchaseOrders.update(this.ordenCompraId);

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
        this.router.navigate(ROUTES.COMPRAS.ORDEN_COMPRA(result.id));
      }
    }
  }
}
