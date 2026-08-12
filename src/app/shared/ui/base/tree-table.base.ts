import { Directive, input, model, output } from "@angular/core";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";

export interface TreeTableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  minWidth?: string;
  styleClass?: string;
  icon?: AppIconName;
}

export interface TreeNodeBase {
  data?: any;
  children?: TreeNodeBase[];
  expanded?: boolean;
  leaf?: boolean;
  icon?: string;
  styleClass?: string;
  key?: string;
  label?: string;
  selectable?: boolean;
}

@Directive()
export abstract class TreeTableBase {
  nodes = input.required<TreeNodeBase[]>();
  columns = input.required<TreeTableColumn[]>();
  dataKey = input<string>("key");
  selectionMode = input<"single" | "multiple" | "checkbox" | undefined>(undefined);
  selection = model<any>(undefined);
  loading = input<boolean>(false);
  emptyMessage = input<string>("Sin datos");
  headerTitle = input<string>("");

  nodeSelect = output<any>();
  nodeUnselect = output<any>();
  nodeExpand = output<any>();
  nodeCollapse = output<any>();
}
