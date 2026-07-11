import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { CustomInputDecimal } from "@ui/inputs/web/custom-input-decimal-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields as getGlobalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

@Component({
  selector: "app-gasto-fijo-servicios",
  templateUrl: "./gasto-fijo-servicios.html",
  imports: [
    WebButtonIconItem,
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    FormsModule,
    TableModule,
    LxAvatar,
    CustomInputNumberSignal,
    CustomInputDecimal,
    CustomInputSelectSignal,
    WebButtonLabelItem,
    WebButtonLabelDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GastoFijoServicios implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  cdr = inject(ChangeDetectorRef); // Inject ChangeDetectorRef
  catalogoGastosFijosId: string = "";

  productos = signal<any[]>([]);
  productosAgregados = signal<any[]>([]);
  selectedProducts = signal<any[]>([]);

  globalFilterFields = computed(() => getGlobalFilterFields(this.productos()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  mensajeError = false;
  catalogoGastosFijosDetalles: any;
  id: any;
  cb_unidadMedida: any[] = [];

  ngOnInit(): void {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>("getMeasurementUnits")
      .then((response: any) => {
        this.cb_unidadMedida = response;
        this.cdr.detectChanges(); // Call detectChanges after updating the data
      });

    this.catalogoGastosFijosId = this.config.data.catalogoGastosFijosId;
    this.onLoadProducts();
    this.onLoadProductsAgregados();
  }
  onLoadProductsAgregados() {
    const urlApi = `CatalogoGastosFijosDetalles/DetallesOrdenCompraFijos/${this.catalogoGastosFijosId}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.productosAgregados.set(result);
      this.cdr.detectChanges(); // Call detectChanges after updating the data
    });
  }

  deleteProductoAgregado(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.CatalogoGastosFijosDetalles.delete(id))
      .then(() => {
        this.onLoadProductsAgregados();
      });
  }
  onLoadProducts() {
    const urlApi =
      "CatalogoGastosFijosDetalles/products/" + this.catalogoGastosFijosId;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.productos.set(result);
      this.cdr.detectChanges(); // Call detectChanges after updating the data
    });
  }

  onSubmit(item: any) {
    if (item.unidadMedidaId === 0 || item.cantidad === 0) {
      this.mensajeError = true;
      this.cdr.detectChanges(); // Update view for error message
      return;
    }

    item.catalogoGastosFijosId = this.catalogoGastosFijosId;

    this.apiResponseS
      .onPost(Endpoints.CatalogoGastosFijosDetalles.base, item)
      .then(() => {
        this.mensajeError = false;
        this.onLoadProducts();
        this.onLoadProductsAgregados();
        this.cdr.detectChanges(); // Update view after successful submission
      });
  }

  onUpdateProductoAgregado(item: any) {
    this.apiResponseS
      .onPut(`CatalogoGastosFijosDetalles/${item.id}`, item)
      .then(() => {
        this.mensajeError = false;
        this.onLoadProducts();
        this.onLoadProductsAgregados();
        this.cdr.detectChanges(); // Update view after successful update
      });
  }
}
