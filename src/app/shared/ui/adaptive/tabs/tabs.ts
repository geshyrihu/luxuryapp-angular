import {
  Component,
  ElementRef,
  effect,
  inject,
  viewChild,
} from "@angular/core";
import { TabsBase } from "@ui/base/tabs.base";
import { MobileTabs } from "@ui/mobile/tabs/tabs";
import { Tabs } from "@ui/web/tabs/tabs";
import { PlatformService } from "@core/services/platform.service";

/**
 * `lx-tabs` — capa adaptativa. La navegacion la aporta `app-tabs` (web) o
 * `ili-tabs` (mobile) en modo `navOnly`, y los paneles se proyectan UNA sola vez
 * en un contenedor propio para no perder el contenido al alternar de stack.
 */
@Component({
  selector: "lx-tabs",

  imports: [Tabs, MobileTabs],
  template: `
    @if (platform.isMobile()) {
      <ili-tabs
        [tabs]="tabs()"
        [(activeId)]="activeId"
        (tabChange)="tabChange.emit($event)"
        [navOnly]="true"
      />
    } @else {
      <app-tabs
        [tabs]="tabs()"
        [(activeId)]="activeId"
        (tabChange)="tabChange.emit($event)"
        [navOnly]="true"
      />
    }
    <div class="lx-tabs-panels" #panels>
      <ng-content />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
      .lx-tabs-panels {
        display: block;
        min-width: 0;
      }
    `,
  ],
})
export class LxTabs extends TabsBase {
  protected platform = inject(PlatformService);

  private panelsRef = viewChild<ElementRef<HTMLElement>>("panels");

  constructor() {
    super();
    // Muestra solo el panel `[tab=<id>]` activo. Si no hay paneles proyectados
    // (uso como selector + @switch del feature) no hace nada.
    effect(() => {
      const active = this.activeId();
      const host = this.panelsRef()?.nativeElement;
      if (!host) return;
      host.querySelectorAll<HTMLElement>(":scope > [tab]").forEach((p) => {
        p.hidden = p.getAttribute("tab") !== active;
      });
    });
  }
}
