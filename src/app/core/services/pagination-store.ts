import { Injectable, inject, signal } from "@angular/core";
import { TableLazyLoadEvent } from "primeng/table";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { PagedResultDto } from "src/app/core/interfaces/paged-result.dto";
import {
  PaginationRequest,
  PAGINATION_DEFAULT_SIZE,
  defaultPaginationRequest,
  lazyLoadToPaginationRequest,
  paginationToQueryParams,
} from "src/app/core/interfaces/pagination-request.dto";

/**
 * Store de paginación server-side basado en signals. Contrato único de la app:
 *  - Request  ≙ `PaginationCommonDTO` (page/recordsNumber/filter/sortField/sortOrder).
 *  - Response ≙ `ApiResponseDTO<PagedResultDTO<T>>` → `data.items` / `data.totalRecords`.
 *
 * Proveer a nivel de componente (no `providedIn: 'root'`) para tener una instancia
 * por tabla:
 *
 * ```ts
 * @Component({ providers: [PaginationStore] })
 * export class MiLista {
 *   store = inject<PaginationStore<MiFila>>(PaginationStore);
 *   ngOnInit() { this.store.configure(Endpoints.X.list, { extraParams: { customerId } }); }
 * }
 * ```
 * ```html
 * <p-table [lazy]="true" (onLazyLoad)="store.onLazyLoad($event)"
 *          [value]="store.data()" [totalRecords]="store.totalRecords()"
 *          [loading]="store.loading()" [rows]="store.request().recordsNumber">
 * ```
 */
@Injectable()
export class PaginationStore<T> {
  private readonly api = inject(ApiResponseService);

  /** Filas de la página actual. */
  readonly data = signal<T[]>([]);
  /** Total de registros (para el paginador). */
  readonly totalRecords = signal(0);
  /** Estado de carga. */
  readonly loading = signal(false);
  /** Request vigente (page/recordsNumber/filter/sortField/sortOrder). */
  readonly request = signal<PaginationRequest>(defaultPaginationRequest());

  private url = "";
  private extraParams: Record<string, unknown> = {};

  /** Configura la URL base y (opcional) el tamaño de página y params fijos (customerId, etc.). */
  configure(
    url: string,
    opts?: { recordsNumber?: number; extraParams?: Record<string, unknown> },
  ): this {
    this.url = url;
    this.extraParams = opts?.extraParams ?? {};
    this.request.set(
      defaultPaginationRequest(opts?.recordsNumber ?? PAGINATION_DEFAULT_SIZE),
    );
    return this;
  }

  /** Reemplaza los params fijos (p.ej. al cambiar de cliente o filtro externo). */
  setExtraParams(params: Record<string, unknown>): void {
    this.extraParams = params;
  }

  /** Handler directo para `(onLazyLoad)` de p-table. Conserva el filtro actual si el evento no lo trae. */
  onLazyLoad(event: TableLazyLoadEvent): void {
    const req = lazyLoadToPaginationRequest(event, this.request().recordsNumber);
    if (!req.filter) req.filter = this.request().filter ?? "";
    void this.load(req);
  }

  /** Aplica un filtro y vuelve a la página 1. */
  setFilter(filter: string): void {
    void this.load({ ...this.request(), page: 1, filter });
  }

  /** Recarga con el request vigente (tras crear/editar/eliminar). */
  refresh(): void {
    void this.load(this.request());
  }

  /** Carga una página. Usa el request dado o el vigente. */
  async load(request: PaginationRequest = this.request()): Promise<void> {
    if (!this.url) return;
    this.request.set(request);
    this.loading.set(true);
    try {
      const params = { ...this.extraParams, ...paginationToQueryParams(request) };
      const res = await this.api.onGetPaged<PagedResultDto<T>>(this.url, params);
      if (res?.data) {
        this.data.set(res.data.items ?? []);
        this.totalRecords.set(res.data.totalRecords ?? 0);
      } else {
        this.data.set([]);
        this.totalRecords.set(0);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
