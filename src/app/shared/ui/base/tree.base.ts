import { Directive, input, model } from "@angular/core";

export interface TreeNode {
  label: string;
  data?: any;
  icon?: string;
  expandedIcon?: string;
  collapsedIcon?: string;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  selectable?: boolean;
  key?: string;
  type?: string;
  parent?: TreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
}

@Directive()
export abstract class TreeBase {
  value = input<TreeNode[]>([]);
  selection = model<any>(null);
  selectionMode = input<"single" | "multiple" | "checkbox">("single");
  scrollHeight = input<string | undefined>(undefined);
  metaKeySelection = input<boolean>(true);
}
