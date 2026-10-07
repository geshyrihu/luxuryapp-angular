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
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields as getGlobalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";

import { LuxInputDecimal } from "@ui/inputs/web/lux-input-decimal-signal";
import { LuxInputNumberSignal } from "@ui/inputs/web/lux-input-number-signal";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-gasto-fijo-servicios",
  templateUrl: "./gasto-fijo-servicios.html",
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    CommonModule,
    FormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxAvatar,
    LuxInputNumberSignal,
    LuxInputDecimal,
    LuxInputSelectSignal,
    LuxTableCaption,
    TableFooter,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GastoFijoServicios implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  cdr = inject(ChangeDetectorRef); // Inject ChangeDetectorRef
  confirmS = inject(ConfirmService);
  catalogoGastosFijosId: string = "";

  productos = signal<any[]>([]);
  productosAgregados = signal<any[]>([]);
  selectedProducts = signal<any[]>([]);

  globalFilterFields = computed(() => getGlobalFilterFields(this.productos()));
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  mensajeError = false;
  catalogoGastosFijosDetalles: any;
  id: any;
  cb_unidadMedida: any[] = [];

  ngOnInit(): void {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.measurementUnits)
      .then((response: any) => {
        this.cb_unidadMedida = response;
        this.cdr.detectChanges(); // Call detectChanges after updating the data
      });

    this.catalogoGastosFijosId = this.config.data.catalogoGastosFijosId;
    this.onLoadProducts();
    this.onLoadProductsAgregados();
  }
  onLoadProductsAgregados() {
    const urlApi = Endpoints.CatalogoGastosFijosDetalles.purchaseOrderDetails(
      this.catalogoGastosFijosId,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.productosAgregados.set(result);
      this.cdr.detectChanges(); // Call detectChanges after updating the data
    });
  }

  async deleteProductoAgregado(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.CatalogoGastosFijosDetalles.delete(id))
      .then(() => {
        this.onLoadProductsAgregados();
      });
  }
  onLoadProducts() {
    const urlApi = Endpoints.CatalogoGastosFijosDetalles.products(
      this.catalogoGastosFijosId,
    );
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
      .onPut(Endpoints.CatalogoGastosFijosDetalles.update(item.id), item)
      .then(() => {
        this.mensajeError = false;
        this.onLoadProducts();
        this.onLoadProductsAgregados();
        this.cdr.detectChanges(); // Update view after successful update
      });
  }
}
