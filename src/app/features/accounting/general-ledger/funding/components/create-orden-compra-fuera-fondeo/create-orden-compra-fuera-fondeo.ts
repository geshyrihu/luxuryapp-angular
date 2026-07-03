import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ETipoGasto } from "src/app/core/enums/tipo-gasto.enum";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

const tipoGastoLabels: { [key: number]: string } = {
  [ETipoGasto.Fijo]: "Gastos Fijos",
  [ETipoGasto.Variable]: "Gastos Variables",
  [ETipoGasto.CajaChica]: "Caja Chica",
  [ETipoGasto.Extraordinario]: "Gastos Extraordinarios",
  [ETipoGasto.Devoluciones]: "Devoluciones",
  [ETipoGasto.TarjetaDebito]: "Tarjeta de Dóbito",
  [ETipoGasto.Proyectos]: "Gastos de Proyectos",
  [ETipoGasto.Nomina]: "Nómina",
  [ETipoGasto.Impuestos]: "Impuestos y Contribuciones",
};

@Component({
  selector: "app-create-orden-compra-fuera-fondeo",
  templateUrl: "./create-orden-compra-fuera-fondeo.html",
  imports: [
    ReactiveFormsModule,
    CustomInputAutoComplete,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class CreateOrdenCompraFueraFondeo implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private router = inject(Router);
  private config = inject(DynamicDialogConfig);
  private customerIdS = inject(CustomerIdService);
  private ref = inject(DynamicDialogRef);

  submitting = signal(false);
  providerId = signal<string>("");

  cb_providers = signal<ISelectItem[]>([]);
  providerControl = new FormControl<ISelectItem | null>(
    null,
    Validators.required,
  );

  tiposDeGasto: ISelectItem[] = Object.keys(ETipoGasto)
    .filter((key) => !isNaN(Number(ETipoGasto[key])))
    .map((key) => ({
      value: ETipoGasto[key] as number,
      label: tipoGastoLabels[ETipoGasto[key] as number] || key,
    }));

  form = new FormGroup({
    customerId: new FormControl("", Validators.required),
    fundingId: new FormControl("", Validators.required),
    providerId: new FormControl("", Validators.required),
    tipoGasto: new FormControl<number | null>(null, Validators.required),
    equipoOInstalacion: new FormControl("", Validators.required),
    justificacionGasto: new FormControl("", Validators.required),
    notasEspeciales: new FormControl(""),
  });

  async ngOnInit(): Promise<void> {
    const fundingId: string = this.config.data?.fundingId ?? "";
    this.form.patchValue({
      customerId: this.customerIdS.customerId(),
      fundingId,
    });

    const result: any = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      `providers/${this.customerIdS.customerId()}`,
    );
    this.cb_providers.set(result as ISelectItem[]);
  }

  saveProviderId = (item: ISelectItem) => {
    this.providerId.set(String(item?.value ?? ""));
    this.providerControl.setValue(item);
    this.form.patchValue({ providerId: String(item?.value ?? "") });
  };

  onSubmit(): void {
    if (!this.apiResponseS.validateForm(this.form) || !this.providerId())
      return;

    this.submitting.set(true);

    this.apiResponseS
      .onPost("OrdenCompra/fuera-fondeo", this.form.value)
      .then((result: any) => {
        if (result) {
          this.ref.close(true);
          this.router.navigate(ROUTES.COMPRAS.ORDEN_COMPRA(result.id));
        } else {
          this.submitting.set(false);
        }
      });
  }
}
