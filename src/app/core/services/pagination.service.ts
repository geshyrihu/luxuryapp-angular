// src/app/core/services/pagination.service.ts
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { globalFilterFields as calculateglobalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
/**
 * Interfaz para la respuesta esperada de la API cuando se solicitan datos paginados.
 * @template T El tipo de los items en la lista.
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalRecords: number;
  // Puedes añadir más campos si tu API los devuelve y son útiles (ej.totalPages)
}

/**
 * Servicio genérico para manejar la lógica de paginación y carga de datos para tablas.
 * Se debe proveer a nivel del componente que lo utiliza para tener instancias separadas
 * si múltiples componentes con tablas lo usan simultáneamente.
 * @template T El tipo de dato que manejará la tabla.
 */
@Injectable() // No uses providedIn: 'root' si necesitas instancias separadas por componente.
// Proporciona este servicio en el array 'providers' del componente.
export class PaginationService<T> {
  apiResponseS = inject(ApiResponseService);

  // --- State Subjects ---
  private readonly _data = new BehaviorSubject<T[]>([]);
  private readonly _totalRecords = new BehaviorSubject<number>(0);
  private readonly _loading = new BehaviorSubject<boolean>(false);
  private readonly _globalFilterFields = new BehaviorSubject<string[]>([]);

  // --- Observables para el Componente ---
  /** Observable para los datos de la página actual. */
  public readonly data$: Observable<T[]> = this._data.asObservable();
  /** Observable para el número total de registros disponibles. */
  public readonly totalRecords$: Observable<number> =
    this._totalRecords.asObservable();
  /** Observable para el estado de carga. */
  public readonly loading$: Observable<boolean> = this._loading.asObservable();
  /** Observable para los campos de filtro global calculados. */
  public readonly globalFilterFields$: Observable<string[]> =
    this._globalFilterFields.asObservable();

  // --- Configuración y Estado Interno ---
  private apiUrl: string = "";
  private currentPage: number = 1;
  private currentPageSize: number = 30;
  private currentFilter: string = "";

  /**
   * Inicializa el servicio de paginación con la URL base de la API y configuraciones iniciales.
   * @param apiUrl La URL base para obtener los datos paginados.
   * @param initialPageSize El tamaño de página inicial. Por defecto es 10.
   * @param initialPage La página inicial. Por defecto es 1.
   */
  public initialize(
    apiUrl: string,
    initialPageSize: number = 10,
    initialPage: number = 1,
  ): void {
    this.apiUrl = apiUrl;
    this.currentPageSize = initialPageSize;
    this.currentPage = initialPage;
    this.currentFilter = ""; // Resetear filtro al inicializar
  }

  /**
   * Carga los datos desde la API utilizando los parámetros de paginación y filtro actuales o proporcionados.
   * @param page El número de página a cargar. Usa el valor actual si no se provee.
   * @param pageSize El tamaño de la página. Usa el valor actual si no se provee.
   * @param filter El término de búsqueda/filtro. Usa el valor actual si no se provee.
   */
  public loadData(
    page: number = this.currentPage,
    pageSize: number = this.currentPageSize,
    filter: string = this.currentFilter,
  ): void {
    this.currentPage = page;
    this.currentPageSize = pageSize;
    this.currentFilter = filter;

    this._loading.next(true);

    // Construir httpParams dinámicamente
    const paramsForApi: { page: number; pageSize: number; filter?: string } = {
      page: this.currentPage,
      pageSize: this.currentPageSize,
    };

    // Solo agregar el parámetro 'filter' si tiene un valor no vacío
    if (this.currentFilter && this.currentFilter.trim() !== "") {
      paramsForApi.filter = this.currentFilter.trim();
    }
    // Nota: La forma en que ApiRequestService construye la URL final a partir de paramsForApi
    // determinará si un parámetro 'filter' ausente aquí realmente se omite de la URL.
    // Si usa URLSearchParams o HttpParams de Angular, generalmente omitirá los parámetros undefined.

    this.apiResponseS
      .onGetListNotLoading(this.apiUrl, paramsForApi)
      .then((response: PaginatedResponse<T> | null) => {
        // Permitir que response sea null temporalmente
        if (response && response.items) {
          // Comprobación más robusta
          this._data.next(response.items);
          this._totalRecords.next(response.totalRecords || 0);
          // Asegúrate que calculateglobalFilterFields esté disponible y funcione correctamente
          if (
            typeof calculateglobalFilterFields === "function" &&
            response.items.length > 0
          ) {
            this._globalFilterFields.next(
              calculateglobalFilterFields(response.items),
            );
          } else if (response.items.length === 0) {
            this._globalFilterFields.next([]);
          }
          // Si calculateglobalFilterFields no es una función o no está importada, remueve o ajusta esta línea.
        } else {
          // Esto se ejecutará si response es null o response.items es undefined/null
          // lo cual puede suceder si el backend devuelve un error 500 y ApiRequestService devuelve null.
          console.warn(
            `Received null/invalid response from ${this.apiUrl} with params:`,
            paramsForApi,
            "Response:",
            response,
          );
          this._data.next([]);
          this._totalRecords.next(0);
          this._globalFilterFields.next([]);
        }
      })
      .catch((error) => {
        // Este bloque se ejecutará si onGetListNotLoading RECHAZA la promesa
        console.error(
          `Error loading data from ${this.apiUrl} via catch block:`,
          error,
        );
        this._data.next([]);
        this._totalRecords.next(0);
        this._globalFilterFields.next([]);
      })
      .finally(() => {
        this._loading.next(false);
      });
  }
  /**
   * Maneja el evento 'onLazyLoad' de las tablas PrimeNG.
   * @param event El evento de carga perezosa de PrimeNG.
   */
  public handleLazyLoad(event: any): void {
    const page = event.first / event.rows + 1;
    const pageSize = event.rows;
    // El filtro (searchTerm) se maneja a través de applyFilter o se pasa directamente a loadData
    this.loadData(page, pageSize, this.currentFilter);
  }

  /**
   * Aplica un nuevo filtro y recarga los datos desde la primera página.
   * @param filter El nuevo término de búsqueda/filtro.
   */
  public applyFilter(filter: string): void {
    this.currentFilter = filter;
    this.loadData(1, this.currentPageSize, this.currentFilter); // Reset a la página 1
  }

  /**
   * Recarga los datos con los parámetros de paginación y filtro actuales.
   * Útil después de operaciones como agregar o eliminar un ítem.
   */
  public refreshData(): void {
    this.loadData(this.currentPage, this.currentPageSize, this.currentFilter);
  }

  /**
   * Obtiene el valor actual del filtro.
   * @returns El término de filtro actual.
   */
  public getCurrentFilter(): string {
    return this.currentFilter;
  }

  /**
   * Obtiene la página actual.
   * @returns El número de la página actual.
   */
  public getCurrentPage(): number {
    return this.currentPage;
  }

  /**
   * Obtiene el tamaño de página actual.
   * @returns El tamaño de la página actual.
   */
  public getCurrentPageSize(): number {
    return this.currentPageSize;
  }
}
