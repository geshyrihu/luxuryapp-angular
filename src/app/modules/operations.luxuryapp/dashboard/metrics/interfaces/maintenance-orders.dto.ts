export interface MaintenanceOrdersCategoryItemDto {
  categoryId: number;
  category: string;
  total: number;
  pending: number;
  completed: number;
  pastPending: number;
}

export interface MaintenanceOrdersByCategoryDto {
  month: number;
  year: number;
  monthName: string;
  items: MaintenanceOrdersCategoryItemDto[];
}
