import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PaginationService } from "src/app/core/services/pagination.service"; // Importar el nuevo servicio
import { TarjetaProducto } from "src/app/features/operations/inventarios-y-almacn/product/tarjeta-producto";
import { IProductData } from "./product-data.interface";
/**
 * Componente modal para agregar productos a una solicitud de compra.
 * Utiliza una tabla paginada para mostrar los productos disponibles y permite
 * al usuario seleccionar la cantidad y unidad de medida antes de agregarlos.
 */

interface IAddProductRow {
  productoId: FormControl<number | null>;
  marca: FormControl<string | null>;
  producto: FormControl<string | null>;
  urlImagen: FormControl<string | null>;
  cantidad: FormControl<number | null>;
  unidadMedidaId: FormControl<number | null>;
}

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-product-modal-add",
  templateUrl: "./product-modal-add.html",
  imports: [
    WebButtonIcon,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    AppAvatar,
    PrimeNgCustomTableFooter,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [PaginationService], // Proveer una instancia fresca de PaginationService para este componente
})
export class ProductModalAdd implements OnInit, OnDestroy {
  // --- Inyección de Dependencias ---
  apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private config = inject(DynamicDialogConfig); // Configuración pasada al abrir el diólogo
  public ref = inject(DynamicDialogRef); // Referencia al diólogo dinámico para cerrarlo
  private authS = inject(AuthService);
  formB = inject(FormBuilder);
  public paginationService =
    inject<PaginationService<IProductData>>(PaginationService); // Inyectar el servicio de paginación genórico

  // --- Estado del Componente ---
  /** Identificador de la solicitud de compra a la que se agregarón productos. */
  public solicitudCompraId: string = "";
  /** Lista de unidades de medida para el dropdown. */
  public cb_unidadMedida: ISelectItem[] = [];
  /** Indica si se debe mostrar un mensaje de error de validación. */
  public mensajeError: boolean = false;
  /** Control para la bósqueda para reemplazar ngModel */
  public searchControl = new FormControl<string>("");

  formArray = new FormArray<FormGroup<IAddProductRow>>([]);

  // --- Configuración de la Tabla PrimeNG ---
  /** Opciones para el número de filas por página. */
  public rowsPerPageOptions: number[] = rowsPerPageOptions();
  /** Número de filas por defecto para la tabla PrimeNG. */
  public tablePrimeNgRows: number = tablePrimeNgRows();
  /** Posición inicial de la paginación (óndice del primer registro). */
  public first: number = 0; // Se actualiza basado en el estado del servicio de paginación

  // --- Datos para la Tabla (manejados por PaginationService) ---
  /** Datos actuales mostrados en la tabla. */
  dataSignal = toSignal(this.paginationService.data$, { initialValue: [] });
  /** Número total de registros disponibles para la paginación. */
  totalRecordsSignal = toSignal(this.paginationService.totalRecords$, {
    initialValue: 0,
  });
  /** Estado de carga de los datos. */
  loading = toSignal(this.paginationService.loading$, { initialValue: true });
  /** Campos utilizados para el filtro global de la tabla PrimeNG. */
  public globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((k) => `value.${k}`);
  });

  constructor() {
    this.loadMeasurementUnits();

    effect(() => {
      const data = this.dataSignal();
      this.formArray.clear();
      data.forEach((item: any) => {
        this.formArray.push(
          this.formB.group({
            productoId: new FormControl(item.productoId),
            marca: new FormControl(item.marca),
            producto: new FormControl(item.producto),
            urlImagen: new FormControl(item.urlImagen),
            cantidad: new FormControl(item.cantidad || 0, {
              validators: [Validators.min(0.01)],
            }),
            unidadMedidaId: new FormControl(item.unidadMedidaId, {
              validators: [Validators.required],
            }),
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
    // Obtener datos pasados al modal
    this.solicitudCompraId = this.config.data.solicitudCompraId;

    // Inicializar el servicio de paginación
    const apiUrl = Endpoints.PurchaseRequestDetails.addProductList(
      this.solicitudCompraId,
    );
    this.paginationService.initialize(apiUrl, this.tablePrimeNgRows);

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
      })
      .catch((error) => {
        console.error("Error loading measurement units:", error);
        this.cb_unidadMedida = []; // Asegurar que sea un array vacóo en caso de error
      });
  }

  /**
   * Maneja el evento de carga perezosa (paginación, ordenamiento) de la tabla PrimeNG.
   * Delega la lígica al servicio de paginación.
   * @param event El evento de carga perezosa emitido por p-table.
   */
  public loadDataLazy(event: any): void {
    this.first = event.first; // Actualizar 'first' para la sincronización de la vista de PrimeNG
    this.paginationService.handleLazyLoad(event);
  }

  /**
   * Aplica el filtro de bósqueda ingresado por el usuario.
   * Delega la lígica al servicio de paginación.
   * El servicio resetearé la paginación a la primera página.
   */
  public applyFilter(): void {
    this.first = 0; // Resetear 'first' visualmente al aplicar filtro
    this.paginationService.applyFilter(this.searchControl.value || "");
  }

  /**
   * Maneja el envío (agregar) de un producto a la solicitud de compra.
   * @param row El FormGroup correspondiente al rowItem de la tabla.
   */
  public onSubmit(row: FormGroup<IAddProductRow>): void {
    const value = row.getRawValue();

    // Validación simple
    if (
      !value.unidadMedidaId ||
      (value.productoId || 0) === 0 ||
      (value.cantidad || 0) <= 0
    ) {
      this.mensajeError = true;
      return;
    }
    this.mensajeError = false;

    // Preparar el payload
    const payload = {
      ...value, // Incluye productoId, cantidad, unidadMedidaId
      solicitudCompraId: this.solicitudCompraId,
      applicationUserId: this.authS.userToken.infoUserAuthDTO.applicationUserId,
    };

    this.apiResponseS
      .onPost(Endpoints.PurchaseRequestDetails.create, payload)
      .then(() => {
        // Recargar los datos de la tabla para reflejar cualquier cambio (ej. si el producto ya no debe aparecer)
        this.paginationService.refreshData();
      })
      .catch((error) => {
        console.error("Error submitting product:", error);
        // Manejar el error, mostrar mensaje al usuario, etc.
      });
  }

  /**
   * Abre un modal para mostrar la tarjeta de información detallada de un producto.
   * @param productoId El ID del producto para el cual mostrar la tarjeta.
   */
  public onModalTarjetaProducto(productoId: any): void {
    if (!productoId) return;

    this.dialogHandlerS.openDialog(
      TarjetaProducto,
      { productoId: productoId }, // Datos a pasar al modal TarjetaProductoComponent
      "Tarjeta de Producto",
      this.dialogHandlerS.sizeLg, // TamAóo del diólogo
    );
  }

  /**
   * Ciclo de vida OnDestroy.
   */
  ngOnDestroy(): void {
    this.ref.close(true); // Cerrar con 'true' si quieres emitir un resultado.
  }
}
