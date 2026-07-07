import { Directive, input, model, output } from "@angular/core";

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
  disabled?: boolean;
}

@Directive()
export abstract class TabsBase {
  tabs = input<TabItem[]>([]);
  activeId = model<string>("");

  tabChange = output<TabItem>();

  select(tab: TabItem): void {
    if (tab.disabled) return;
    this.activeId.set(tab.id);
    this.tabChange.emit(tab);
  }
}
