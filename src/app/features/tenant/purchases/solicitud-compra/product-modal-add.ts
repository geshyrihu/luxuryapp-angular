import {
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
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
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
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PaginationService } from "src/app/core/services/pagination.service"; // Importar el nuevo servicio
import { TarjetaProducto } from "src/app/features/tenant/product/tarjeta-producto";
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

@Component({
  selector: "app-product-modal-add",
  templateUrl: "./product-modal-add.html",
  imports: [
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    CustomButton,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    AvatarModule,
    PrimeNgCustomTableFooter,
  ],
  providers: [PaginationService], // Proveer una instancia fresca de PaginationService para este componente
})
export class ProductModalAdd implements OnInit, OnDestroy {
  // --- InyecciÃ³n de Dependencias ---
  apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private config = inject(DynamicDialogConfig); // ConfiguraciÃ³n pasada al abrir el diÃ¡logo
  public ref = inject(DynamicDialogRef); // Referencia al diÃ¡logo dinÃ³mico para cerrarlo
  private authS = inject(AuthService);
  formB = inject(FormBuilder);
  public paginationService =
    inject<PaginationService<IProductData>>(PaginationService); // Inyectar el servicio de paginaciÃ³n genÃ³rico

  // --- Estado del Componente ---
  /** Identificador de la solicitud de compra a la que se agregarÃ³n productos. */
  public solicitudCompraId: string = "";
  /** Lista de unidades de medida para el dropdown. */
  public cb_unidadMedida: ISelectItem[] = [];
  /** Indica si se debe mostrar un mensaje de error de validaciÃ³n. */
  public mensajeError: boolean = false;
  /** Control para la bÃ³squeda para reemplazar ngModel */
  public searchControl = new FormControl<string>("");

  formArray = new FormArray<FormGroup<IAddProductRow>>([]);

  // --- ConfiguraciÃ³n de la Tabla PrimeNG ---
  /** Opciones para el nÃ³mero de filas por pÃ³gina. */
  public rowsPerPageOptions: number[] = rowsPerPageOptions();
  /** NÃ³mero de filas por defecto para la tabla PrimeNG. */
  public tablePrimeNgRows: number = tablePrimeNgRows();
  /** PosiciÃ³n inicial de la paginaciÃ³n (Ã³ndice del primer registro). */
  public first: number = 0; // Se actualiza basado en el estado del servicio de paginaciÃ³n

  // --- Datos para la Tabla (manejados por PaginationService) ---
  /** Datos actuales mostrados en la tabla. */
  dataSignal = toSignal(this.paginationService.data$, { initialValue: [] });
  /** NÃ³mero total de registros disponibles para la paginaciÃ³n. */
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
   * AquÃ³ se configuran los datos iniciales y se inicializa el servicio de paginaciÃ³n.
   */
  ngOnInit(): void {
    // Obtener datos pasados al modal
    this.solicitudCompraId = this.config.data.solicitudCompraId;

    // Inicializar el servicio de paginaciÃ³n
    const apiUrl = `SolicitudCompraDetalle/AddProduct/${this.solicitudCompraId}`;
    this.paginationService.initialize(apiUrl, this.tablePrimeNgRows);

    // Cargar los datos iniciales
    this.paginationService.loadData();
  }

  /**
   * Carga las unidades de medida desde la API.
   */
  private loadMeasurementUnits(): void {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>("GetMeasurementUnits")
      .then((response: ISelectItem[]) => {
        this.cb_unidadMedida = response;
      })
      .catch((error) => {
        console.error("Error loading measurement units:", error);
        this.cb_unidadMedida = []; // Asegurar que sea un array vacÃ³o en caso de error
      });
  }

  /**
   * Maneja el evento de carga perezosa (paginaciÃ³n, ordenamiento) de la tabla PrimeNG.
   * Delega la lÃ³gica al servicio de paginaciÃ³n.
   * @param event El evento de carga perezosa emitido por p-table.
   */
  public loadDataLazy(event: any): void {
    this.first = event.first; // Actualizar 'first' para la sincronizaciÃ³n de la vista de PrimeNG
    this.paginationService.handleLazyLoad(event);
  }

  /**
   * Aplica el filtro de bÃ³squeda ingresado por el usuario.
   * Delega la lÃ³gica al servicio de paginaciÃ³n.
   * El servicio resetearÃ³ la paginaciÃ³n a la primera pÃ³gina.
   */
  public applyFilter(): void {
    this.first = 0; // Resetear 'first' visualmente al aplicar filtro
    this.paginationService.applyFilter(this.searchControl.value || "");
  }

  /**
   * Maneja el envÃ­o (agregar) de un producto a la solicitud de compra.
   * @param row El FormGroup correspondiente al rowItem de la tabla.
   */
  public onSubmit(row: FormGroup<IAddProductRow>): void {
    const value = row.getRawValue();

    // ValidaciÃ³n simple
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
      .onPost(`solicitudcompradetalle/`, payload)
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
   * Abre un modal para mostrar la tarjeta de informaciÃ³n detallada de un producto.
   * @param productoId El ID del producto para el cual mostrar la tarjeta.
   */
  public onModalTarjetaProducto(productoId: any): void {
    if (!productoId) return;

    this.dialogHandlerS.openDialog(
      TarjetaProducto,
      { productoId: productoId }, // Datos a pasar al modal TarjetaProductoComponent
      "Tarjeta de Producto",
      this.dialogHandlerS.sizeLg, // TamAÃ±o del diÃ¡logo
    );
  }

  /**
   * Ciclo de vida OnDestroy.
   */
  ngOnDestroy(): void {
    this.ref.close(true); // Cerrar con 'true' si quieres emitir un resultado.
  }
}

