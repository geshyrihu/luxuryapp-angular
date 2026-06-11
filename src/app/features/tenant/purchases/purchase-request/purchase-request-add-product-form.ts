import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";

import { AvatarModule } from "primeng/avatar";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PaginationService } from "src/app/core/services/pagination.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TarjetaProducto } from "src/app/features/tenant/product/tarjeta-producto";
import { Endpoints } from "src/app/core/constants/endpoints";
import { IProductData } from "./product-data.interface";
@Component({
  selector: "app-purchase-request-add-product-form",
  templateUrl: "./purchase-request-add-product-form.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    CustomButton,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    PrimeNgCustomTableFooter,
    AvatarModule,
  ],
  providers: [PaginationService], // Proveer una instancia fresca de PaginationService para este componente
})
export class PurchaseRequestAddProductForm implements OnInit, OnDestroy {
  // --- Inyección de Dependencias ---
  apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private config = inject(DynamicDialogConfig); // Configuración pasada al abrir el diálogo
  public ref = inject(DynamicDialogRef); // Referencia al diálogo dinámico para cerrarlo
  public paginationService =
    inject<PaginationService<IProductData>>(PaginationService); // Inyectar el servicio de paginación genérico
  private tableScrollHeightS = inject(TableScrollHeightService);

  // --- Estado del Componente ---
  /** Identificador de la solicitud de compra a la que se agregarán productos. */
  public purchaseRequestId: string = "";
  /** Lista de unidades de medida para el dropdown. */
  public cb_unidadMedida: ISelectItem[] = [];
  /** Controlador de búsqueda ingresado por el usuario. */
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
  /** Posición inicial de la paginación (índice del primer registro). */
  public first: number = 0; // Se actualiza basado en el estado del servicio de paginación
  public scrollHeight = this.tableScrollHeightS.scrollHeight;

  // --- Datos para la Tabla (manejados por PaginationService) ---
  /** Datos actuales mostrados en la tabla. */
  public dataSignal = signal<IProductData[]>([]);
  /** Número total de registros disponibles para la paginación. */
  public totalRecords = signal(0);
  /** Estado de carga de los datos. */
  public loading = signal(true);
  /** Campos utilizados para el filtro global de la tabla PrimeNG. */
  public globalFilterFieldsSignal = signal<string[]>([]);
  public globalFilterFields = computed(() => this.globalFilterFieldsSignal());

  // --- Suscripciones ---
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Cargar datos iniciales que no dependen de la paginación, como dropdowns
    this.loadMeasurementUnits();
  }

  /**
   * Ciclo de vida OnInit.
   * Se ejecuta una vez que el componente ha sido inicializado.
   * Aquí se configuran los datos iniciales y se inicializa el servicio de paginación.
   */
  ngOnInit(): void {
    this.purchaseRequestId = this.config.data.purchaseRequestId;

    // Inicializar el servicio de paginación
    const apiUrl = Endpoints.PurchaseRequests.addProductList(this.purchaseRequestId);
    this.paginationService.initialize(apiUrl, this.tablePrimeNgRows);

    // Suscribirse a los observables del servicio de paginación
    this.paginationService.data$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.dataSignal.set(items);
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
    this.paginationService.totalRecords$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((count) => this.totalRecords.set(count));
    this.paginationService.loading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isLoading) => this.loading.set(isLoading));
    this.paginationService.globalFilterFields$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((fields) => this.globalFilterFieldsSignal.set(fields));

    // Cargar los datos iniciales
    this.paginationService.loadData();
  }

  /**
   * Carga las unidades de medida desde la API.
   */
  private loadMeasurementUnits(): void {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.measurementUnits)
      .then((response: ISelectItem[]) => {
        this.cb_unidadMedida = response;
      });
  }

  /**
   * Maneja el evento de carga perezosa (paginación, ordenamiento) de la tabla PrimeNG.
   * Delega la lógica al servicio de paginación.
   * @param event El evento de carga perezosa emitido por p-table.
   */
  public loadDataLazy(event: any): void {
    this.first = event.first; // Actualizar 'first' para la sincronización de la vista de PrimeNG
    this.paginationService.handleLazyLoad(event);
  }

  /**
   * Aplica el filtro de búsqueda ingresado por el usuario.
   * Delega la lógica al servicio de paginación.
   * El servicio reseteará la paginación a la primera página.
   */
  public applyFilter(): void {
    this.first = 0; // Resetear 'first' visualmente al aplicar filtro
    this.paginationService.applyFilter(this.searchControl.value || "");
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
        this.paginationService.refreshData();
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

