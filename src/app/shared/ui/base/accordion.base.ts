import { Directive, input, model } from "@angular/core";

export interface AccordionItem {
  id: string;
  title: string;
  icon?: string;
  disabled?: boolean;
}

@Directive()
export abstract class AccordionBase {
  items = input<AccordionItem[]>([]);
  multiple = input<boolean>(false);

  /** IDs de las secciones expandidas */
  expandedIds = model<string[]>([]);

  toggle(id: string): void {
    if (this.multiple()) {
      const current = this.expandedIds();
      if (current.includes(id)) {
        this.expandedIds.set(current.filter((i) => i !== id));
      } else {
        this.expandedIds.set([...current, id]);
      }
    } else {
      if (this.expandedIds().includes(id)) {
        this.expandedIds.set([]);
      } else {
        this.expandedIds.set([id]);
      }
    }
  }
}
