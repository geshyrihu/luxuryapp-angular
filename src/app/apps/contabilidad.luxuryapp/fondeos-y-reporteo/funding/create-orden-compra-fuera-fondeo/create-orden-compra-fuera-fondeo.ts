import { Endpoints } from "src/app/core/constants/endpoints";
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
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { TipoGasto } from "src/app/core/interfaces/tipo-gasto.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { ROUTES } from "src/app/routing/route-paths";

const tipoGastoLabels: { [key: number]: string } = {
  [TipoGasto.Fijo]: "Gastos Fijos",
  [TipoGasto.Variable]: "Gastos Variables",
  [TipoGasto.CajaChica]: "Caja Chica",
  [TipoGasto.Extraordinario]: "Gastos Extraordinarios",
  [TipoGasto.Devoluciones]: "Devoluciones",
  [TipoGasto.TarjetaDebito]: "Tarjeta de Dóbito",
  [TipoGasto.Proyectos]: "Gastos de Proyectos",
  [TipoGasto.Nomina]: "Nómina",
  [TipoGasto.Impuestos]: "Impuestos y Contribuciones",
};

@Component({
  selector: "app-create-orden-compra-fuera-fondeo",
  templateUrl: "./create-orden-compra-fuera-fondeo.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    InputAutocomplete,
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

  cb_providers = signal<SelectItemDto[]>([]);
  providerControl = new FormControl<SelectItemDto | null>(
    null,
    Validators.required,
  );

  tiposDeGasto: SelectItemDto[] = Object.keys(TipoGasto)
    .filter((key) => !isNaN(Number(TipoGasto[key])))
    .map((key) => ({
      value: TipoGasto[key] as number,
      label: tipoGastoLabels[TipoGasto[key] as number] || key,
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

    const result: any = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      `providers/${this.customerIdS.customerId()}`,
    );
    this.cb_providers.set(result as SelectItemDto[]);
  }

  saveProviderId = (item: SelectItemDto) => {
    this.providerId.set(String(item?.value ?? ""));
    this.providerControl.setValue(item);
    this.form.patchValue({ providerId: String(item?.value ?? "") });
  };

  onSubmit(): void {
    if (!this.apiResponseS.validateForm(this.form) || !this.providerId())
      return;

    this.submitting.set(true);

    this.apiResponseS
      .onPost(Endpoints.RefactorContabilidad.ordenCompraFueraFondeo, this.form.value)
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
