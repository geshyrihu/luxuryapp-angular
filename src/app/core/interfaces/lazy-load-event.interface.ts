export interface LazyLoadEvent {
  first?: number | null;
  rows?: number | null;
  sortField?: string | string[] | null;
  sortOrder?: number | null;
  globalFilter?: string | string[] | null;
  last?: number | null;
}
