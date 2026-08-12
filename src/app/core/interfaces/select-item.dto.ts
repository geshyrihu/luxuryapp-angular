export interface SelectItemDto<T = any> {
  value: T;
  label?: any;
  isSelected?: boolean | null;
  group?: string;
  sortOrder?: number;
  image?: string;
}
