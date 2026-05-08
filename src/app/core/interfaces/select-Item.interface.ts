export interface ISelectItem {
  value: any;
  label?: any;
  isSelected?: boolean;
}
export interface SelectItem<T> {
  label: string;
  value: T;
  isSelected: boolean | null;
  image: string;
}









