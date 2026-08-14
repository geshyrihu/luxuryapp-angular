import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { TableModule } from "@ui/web/primeng-table/primeng-table";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TarjetaProducto } from "src/app/apps/supplier.luxuryapp/product/tarjeta-producto";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PaginationStore } from "src/app/core/services/pagination-store";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { IProductData } from "./product-data.interface";

@Component({
  selector: "app-purchase-request-add-product-form",
  templateUrl: "./purchase-request-add-product-form.html",
  imports: [
    WebButtonIcon,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    WebButtonLabel,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    PrimeNgCustomTableFooter,
    AppAvatar,
  ],
  providers: [PaginationStore], // Instancia fresca del store de paginación por componente
})
export class PurchaseRequestAddProductForm implements OnInit, OnDestroy {
  // --- Inyección de Dependencias ---
  apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private config = inject(DynamicDialogConfig); // Configuración pasada al abrir el diálogo
  public ref = inject(DynamicDialogRef); // Referencia al diálogo dinámico para cerrarlo
  private store = inject<PaginationStore<IProductData>>(PaginationStore);
  private tableScrollHeightS = inject(TableScrollHeightService);

  // --- Estado del Componente ---
  /** Identificador de la solicitud de compra a la que se agregarón productos. */
  public purchaseRequestId: string = "";
  /** Lista de unidades de medida para el dropdown. */
  public cb_unidadMedida: SelectItemDto[] = [];
  /** Controlador de bósqueda ingresado por el usuario. */
  public searchControl = new FormControl<string>("");

  // Array de formularios para las filas
  public formArray = new FormArray<
    FormGroup<{
      productId: FormControl<number | null>;
      quantity: FormControl<number>;
      unitId: FormControl<number | null>;
    }>
  >([]);
  private formB = inject(FormBuilder);

  // --- Configuración de la Tabla PrimeNG ---
  /** Opciones para el número de filas por página. */
  public rowsPerPageOptions: number[] = rowsPerPageOptions();
  /** Número de filas por defecto para la tabla PrimeNG. */
  public tablePrimeNgRows: number = tablePrimeNgRows();
  /** Posición inicial de la paginación (óndice del primer registro). */
  public first: number = 0; // Se actualiza basado en el estado del servicio de paginación
  public scrollHeight = this.tableScrollHeightS.scrollHeight;

  // --- Datos para la Tabla (manejados por PaginationStore) ---
  /** Datos actuales mostrados en la tabla. */
  public dataSignal = this.store.data;
  /** Número total de registros disponibles para la paginación. */
  public totalRecords = this.store.totalRecords;
  /** Estado de carga de los datos. */
  public loading = this.store.loading;
  /** Campos utilizados para el filtro global de la tabla PrimeNG. */
  public globalFilterFields = computed(() => {
    const d = this.store.data();
    return d.length > 0 ? Object.keys(d[0]) : [];
  });

  constructor() {
    // Cargar datos iniciales que no dependen de la paginación, como dropdowns
    this.loadMeasurementUnits();

    // Reconstruir el formArray cuando cambian los datos paginados
    effect(() => {
      const items = this.store.data();
      this.formArray.clear();
      items.forEach((item) => {
        this.formArray.push(
          this.formB.group({
            productId: new FormControl(
              (item as any).productId || (item as any).productid,
            ),
            quantity: new FormControl(item.quantity || 0, {
              nonNullable: true,
              validators: [Validators.min(0)],
            }),
            unitId: new FormControl<any>(item.unitId || null),
          }),
        );
      });
    });
  }

  /**
   * Ciclo de vida OnInit.
   * Se ejecuta una vez que el componente ha sido inicializado.
   * Aqué se configuran los datos iniciales y se inicializa el servicio de paginación.
   */
  ngOnInit(): void {
    this.purchaseRequestId = this.config.data.purchaseRequestId;

    // Inicializar el servicio de paginación
    const apiUrl = Endpoints.PurchaseRequests.addProductList(
      this.purchaseRequestId,
    );
    this.store.configure(apiUrl, { recordsNumber: this.tablePrimeNgRows });

    // Cargar los datos iniciales (el effect del constructor reconstruye el formArray)
    this.store.load();
  }

  /**
   * Carga las unidades de medida desde la API.
   */
  private loadMeasurementUnits(): void {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.measurementUnits)
      .then((response: SelectItemDto[]) => {
        this.cb_unidadMedida = response;
      });
  }

  /**
   * Maneja el evento de carga perezosa (paginación, ordenamiento) de la tabla PrimeNG.
   * Delega la lígica al servicio de paginación.
   * @param event El evento de carga perezosa emitido por p-table.
   */
  public loadDataLazy(event: any): void {
    this.first = event.first; // Actualizar 'first' para la sincronización de la vista de PrimeNG
    this.store.onLazyLoad(event);
  }

  /**
   * Aplica el filtro de bósqueda ingresado por el usuario.
   * Delega la lígica al servicio de paginación.
   * El servicio resetearé la paginación a la primera página.
   */
  public applyFilter(): void {
    this.first = 0; // Resetear 'first' visualmente al aplicar filtro
    this.store.setFilter(this.searchControl.value || "");
  }

  /**
   * Maneja el envío (agregar) de un producto a la solicitud de compra.
   * @param item El producto (rowItem) de la tabla que se va a agregar.
   */
  public onSubmit(item: IProductData, index: number): void {
    const rowControl = this.formArray.at(index);
    if (!rowControl) return;

    // Preparar el payload
    const payload = {
      ...item, // Incluye productoId, etc
      quantity: rowControl.value.quantity,
      unitId: rowControl.value.unitId,
      purchaseRequestId: this.purchaseRequestId,
    };

    this.apiResponseS
      .onPost(Endpoints.PurchaseRequests.addProduct, payload)
      .then(() => {
        // Recargar los datos de la tabla para reflejar cualquier cambio (ej. si el producto ya no debe aparecer)
        this.store.refresh();
      });
  }

  /**
   * Abre un modal para mostrar la tarjeta de información detallada de un producto.
   * @param productoId El ID del producto para el cual mostrar la tarjeta.
   */
  public onModalTarjetaProducto(productoId: any): void {
    this.dialogHandlerS.openDialog(
      TarjetaProducto,
      { productoId: productoId }, // Datos a pasar al modal TarjetaProductoComponent
      "Tarjeta de Producto",
      this.dialogHandlerS.sizeLg, // Tamaño del diálogo
    );
  }

  /**
   * Ciclo de vida OnDestroy.
   * Se ejecuta justo antes de que el componente sea destruido.
   * Es importante desuscribirse de los observables para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.ref.close(true); // Cerrar con 'true' si quieres emitir un resultado.
  }
}
