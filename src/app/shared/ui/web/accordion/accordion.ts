import { Component, ViewEncapsulation, ChangeDetectionStrategy, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccordionModule } from "primeng/accordion";
import { AccordionBase } from "@ui/base/accordion.base";

@Component({
  selector: "app-accordion",
  standalone: true,
  imports: [CommonModule, AccordionModule],
  template: `
    <p-accordion
      [multiple]="multiple()"
      [activeIndex]="activeIndexes()"
      (onClose)="onClose($event)"
      (onOpen)="onOpen($event)"
    >
      @for (item of items(); track item.id) {
        <p-accordionTab
          [header]="item.title"
          [disabled]="item.disabled"
        >
          <ng-content [select]="'[accordion=' + item.id + ']'" />
        </p-accordionTab>
      }
    </p-accordion>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Accordion extends AccordionBase {
  activeIndexes = computed<number[]>(() =>
    this.expandedIds()
      .map((id) => this.items().findIndex((i) => i.id === id))
      .filter((i) => i >= 0)
  );

  onOpen(event: { index: number }): void {
    const item = this.items()[event.index];
    if (item) {
      this.toggle(item.id);
    }
  }

  onClose(event: { index: number }): void {
    const item = this.items()[event.index];
    if (item) {
      this.toggle(item.id);
    }
  }
}
