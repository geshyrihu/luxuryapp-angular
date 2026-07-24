import { TableLazyLoadEvent } from "primeng/table";

/**
 * Contrato de request de paginación — espejo de `PaginationCommonDTO` (backend).
 * Los nombres deben coincidir con las propiedades del DTO para que el binding
 * `[AsParameters] PaginationCommonDTO` (case-insensitive) funcione.
 */
export interface PaginationRequest {
  /** Página, base 1. */
  page: number;
  /** Tamaño de página. Tope backend: `PAGINATION_MAX_RECORDS`. */
  recordsNumber: number;
  /** Búsqueda global (se omite del query si está vacía). */
  filter?: string;
  /** Campo de ordenamiento (se omite del query si está vacío). */
  sortField?: string;
  /** 1 = ascendente, -1 = descendente. */
  sortOrder?: number;
}

/** Tope de registros por página aceptado por el backend (`MaxRecordsNumber`). */
export const PAGINATION_MAX_RECORDS = 200;
/** Tamaño de página por defecto (coincide con el default del DTO). */
export const PAGINATION_DEFAULT_SIZE = 30;

/** Request inicial (página 1, tamaño por defecto, orden ascendente). */
export function defaultPaginationRequest(
  recordsNumber: number = PAGINATION_DEFAULT_SIZE,
): PaginationRequest {
  return {
    page: 1,
    recordsNumber: Math.min(recordsNumber, PAGINATION_MAX_RECORDS),
    filter: "",
    sortField: "",
    sortOrder: 1,
  };
}

/**
 * Mapea el evento `onLazyLoad` de una p-table al contrato canónico. Centraliza
 * el cálculo `page = first / rows + 1` que hoy cada componente reinventa.
 */
export function lazyLoadToPaginationRequest(
  event: TableLazyLoadEvent,
  fallbackSize: number = PAGINATION_DEFAULT_SIZE,
): PaginationRequest {
  const rows = event.rows ?? fallbackSize;
  const first = event.first ?? 0;
  const sortField = Array.isArray(event.sortField)
    ? event.sortField[0]
    : event.sortField;
  return {
    page: Math.floor(first / rows) + 1,
    recordsNumber: Math.min(rows, PAGINATION_MAX_RECORDS),
    filter: (event.globalFilter as string) ?? "",
    sortField: sortField ?? "",
    sortOrder: event.sortOrder ?? 1,
  };
}

/**
 * Convierte el request a los query params HTTP con los nombres del DTO.
 * Omite `filter`/`sortField` vacíos (y `sortOrder` si no hay `sortField`).
 */
export function paginationToQueryParams(
  req: PaginationRequest,
): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page: req.page,
    recordsNumber: req.recordsNumber,
  };
  if (req.filter && req.filter.trim() !== "") {
    params.filter = req.filter.trim();
  }
  if (req.sortField && req.sortField.trim() !== "") {
    params.sortField = req.sortField;
    params.sortOrder = req.sortOrder ?? 1;
  }
  return params;
}
