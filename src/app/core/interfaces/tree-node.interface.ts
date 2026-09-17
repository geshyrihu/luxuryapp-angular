export interface TreeNode<T = unknown> {
  label?: string;
  data?: T;
  icon?: string;
  children?: TreeNode<T>[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  key?: string;
  styleClass?: string;
  selectable?: boolean;
}
