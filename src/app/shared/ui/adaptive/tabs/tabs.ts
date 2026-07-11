import { NgTemplateOutlet } from "@angular/common";
import { Component, inject } from "@angular/core";
import { TabsBase } from "@ui/base/tabs.base";
import { MobileTabs } from "@ui/mobile/tabs/tabs";
import { Tabs } from "@ui/web/tabs/tabs";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-tabs",

  imports: [NgTemplateOutlet, Tabs, MobileTabs],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <ili-tabs
        [tabs]="tabs()"
        [(activeId)]="activeId"
        (tabChange)="tabChange.emit($event)"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </ili-tabs>
    } @else {
      <app-tabs
        [tabs]="tabs()"
        [(activeId)]="activeId"
        (tabChange)="tabChange.emit($event)"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </app-tabs>
    }
  `,
})
export class LxTabs extends TabsBase {
  protected platform = inject(PlatformService);
}
