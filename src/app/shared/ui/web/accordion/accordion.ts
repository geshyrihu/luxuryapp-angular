import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from "@angular/core";
import { AccordionBase } from "@ui/base/accordion.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { AccordionModule } from "primeng/accordion";

/**
 * AppAccordion — Wrapper sobre p-accordion. PrimeNG 22 reemplazo la API por
 * indice (`[activeIndex]`, `p-accordionTab`, onOpen/onClose) por la API por
 * `value` (p-accordion / p-accordion-panel / p-accordion-header /
 * p-accordion-content). Se conserva el selector `app-accordion`, la API de
 * AccordionBase (`items`, `multiple`, `expandedIds`) y los slots `[accordion=<id>]`.
 */
@Component({
  selector: "app-accordion",

  imports: [AccordionModule, AppIcon],
  template: `
    <p-accordion
      [value]="accordionValue()"
      [multiple]="multiple()"
      (valueChange)="onValueChange($event)"
    >
      @for (item of items(); track item.id) {
        <p-accordion-panel
          [value]="item.id"
          [disabled]="item.disabled ?? false"
        >
          <p-accordion-header>
            @if (item.icon) {
              <app-icon [icon]="item.icon" class="mr-2" />
            }
            {{ item.title }}
          </p-accordion-header>
          <p-accordion-content>
            <ng-content [select]="'[accordion=' + item.id + ']'" />
          </p-accordion-content>
        </p-accordion-panel>
      }
    </p-accordion>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Accordion extends AccordionBase {
  /** Valor activo para p-accordion: array si multiple, escalar si no. */
  accordionValue = computed<string | string[] | null>(() =>
    this.multiple() ? this.expandedIds() : (this.expandedIds()[0] ?? null),
  );

  onValueChange(
    value: string | number | (string | number)[] | null | undefined,
  ): void {
    if (Array.isArray(value)) {
      this.expandedIds.set(value.map(String));
    } else if (value === null || value === undefined) {
      this.expandedIds.set([]);
    } else {
      this.expandedIds.set([String(value)]);
    }
  }
}
