export interface PaginationCommonDTO {
  filter: string;
  sort: string;
  page: number;
  recordsNumber: number;
}

export interface PagedResultDTO<T> {
  items: T[];
  totalRecords: number;
}









