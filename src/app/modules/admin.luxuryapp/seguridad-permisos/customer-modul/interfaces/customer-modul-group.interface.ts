import { CustomerModulListItem } from "./customer-modul-list-item.interface";

export interface CustomerModulGroup {
  groupTitle: string;
  items: CustomerModulListItem[];
}
