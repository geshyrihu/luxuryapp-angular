import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  Directive,
  input,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { AccordionBase } from "@ui/base/accordion.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

/**
 * Marca el contenido de un panel del accordion. Se proyecta como
 * `<ng-template accordionPanel="<id>">...</ng-template>` dentro de
 * `<app-accordion>`, con el mismo `id` que su `AccordionItem`.
 * [Fase 3 migración Bootstrap, 2026-09-13] Reemplaza el `<ng-content
 * [select]>` dinámico de la versión anterior — ese binding no es válido
 * en Angular (`select` de `ng-content` solo admite un string estático en
 * compilación, nunca funcionó como se documentaba). Sin consumidores
 * reales que migrar (0 usos confirmados de `<app-accordion>`).
 */
@Directive({
  selector: "ng-template[accordionPanel]",
})
export class AccordionPanel {
  accordionPanel = input.required<string>();
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: "app-accordion",
  imports: [AppIcon, NgTemplateOutlet],
  template: `
    <div class="accordion">
      @for (item of items(); track item.id) {
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              [class.collapsed]="!isExpanded(item.id)"
              type="button"
              [disabled]="item.disabled ?? false"
              (click)="toggle(item.id)"
            >
              @if (item.icon) {
                <app-icon [icon]="item.icon" class="me-2" />
              }
              {{ item.title }}
            </button>
          </h2>
          <div
            class="accordion-collapse collapse"
            [class.show]="isExpanded(item.id)"
          >
            <div class="accordion-body">
              <ng-container [ngTemplateOutlet]="panelTemplate(item.id)" />
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Accordion extends AccordionBase {
  private panels = contentChildren(AccordionPanel);

  protected isExpanded(id: string): boolean {
    return this.expandedIds().includes(id);
  }

  protected panelTemplate(id: string): TemplateRef<unknown> | null {
    return (
      this.panels().find((p) => p.accordionPanel() === id)?.templateRef ??
      null
    );
  }
}
