import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  effect,
  viewChild,
} from "@angular/core";
import { TabsBase } from "@ui/base/tabs.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TabsModule } from "primeng/tabs";

/**
 * AppTabs — Wrapper sobre p-tabs (PrimeNG 22, API por `value`). Usa PrimeNG solo
 * para la BARRA de tabs (p-tabs/p-tablist/p-tab); el contenido se proyecta en un
 * contenedor propio y se conmuta por `activeId` ocultando los `[tab=<id>]` que no
 * coinciden. Esto evita el `<ng-content [select]>` dinamico (no soportado de forma
 * fiable) y funciona igual que la pata movil `ili-tabs`.
 * Slots: `<div tab="<id>">...</div>` por panel. Si no hay paneles proyectados,
 * `lx-tabs` funciona como selector puro (el feature conmuta con `@switch`).
 */
@Component({
  selector: "app-tabs",

  imports: [TabsModule, AppIcon],
  template: `
    <p-tabs [value]="activeId()" (valueChange)="onValueChange($event)">
      <p-tablist>
        @for (tab of tabs(); track tab.id) {
          <p-tab [value]="tab.id" [disabled]="tab.disabled ?? false">
            @if (tab.icon) {
              <app-icon [icon]="tab.icon" class="mr-2" />
            }
            {{ tab.label }}
          </p-tab>
        }
      </p-tablist>
    </p-tabs>
    <div class="app-tabs-panels" #panels>
      <ng-content />
    </div>
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
export class Tabs extends TabsBase {
  private panelsRef = viewChild<ElementRef<HTMLElement>>("panels");

  constructor() {
    super();
    // Conmuta la visibilidad de los paneles proyectados `[tab=<id>]` segun la
    // tab activa. Si no hay paneles proyectados no hace nada (uso como selector).
    effect(() => {
      const active = this.activeId();
      const host = this.panelsRef()?.nativeElement;
      if (!host) return;
      const panels = host.querySelectorAll<HTMLElement>(":scope > [tab]");
      panels.forEach((p) => {
        p.hidden = p.getAttribute("tab") !== active;
      });
    });
  }

  onValueChange(value: string | number): void {
    const tab = this.tabs().find((t) => t.id === value);
    if (tab) {
      this.select(tab);
    }
  }
}
