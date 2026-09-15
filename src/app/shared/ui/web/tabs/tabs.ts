import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  effect,
  viewChild,
} from "@angular/core";
import { TabsBase } from "@ui/base/tabs.base";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

/**
 * AppTabs — Wrapper con navegación Bootstrap. El contenido se proyecta en un
 * contenedor propio y se conmuta por `activeId` ocultando los `[tab=<id>]` que no
 * coinciden. Esto evita el `<ng-content [select]>` dinamico (no soportado de forma
 * fiable) y funciona igual que la pata movil `ili-tabs`.
 * Slots: `<div tab="<id>">...</div>` por panel. Si no hay paneles proyectados,
 * `lx-tabs` funciona como selector puro (el feature conmuta con `@switch`).
 */
@Component({
  selector: "app-tabs",

  imports: [NgbNavModule, AppIcon],
  template: `
    <ul ngbNav #nav="ngbNav" [activeId]="activeId()" (activeIdChange)="onValueChange($event)" class="nav nav-tabs">
      @for (tab of tabs(); track tab.id) {
        <li [ngbNavItem]="tab.id" [disabled]="tab.disabled ?? false">
          <button ngbNavLink type="button">
            @if (tab.icon) {
              <app-icon [icon]="tab.icon" class="me-2" />
            }
            {{ tab.label }}
          </button>
        </li>
      }
    </ul>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

