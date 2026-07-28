import { Component, inject } from "@angular/core";
import { TabsBase } from "@ui/base/tabs.base";
import { MobileTabs } from "@ui/mobile/tabs/tabs";
import { Tabs } from "@ui/web/tabs/tabs";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-tabs",

  imports: [Tabs, MobileTabs],
  template: `
    @if (platform.isMobile()) {
      <ili-tabs
        [tabs]="tabs()"
        [(activeId)]="activeId"
        (tabChange)="tabChange.emit($event)"
      >
        <ng-content />
      </ili-tabs>
    } @else {
      <app-tabs
        [tabs]="tabs()"
        [(activeId)]="activeId"
        (tabChange)="tabChange.emit($event)"
      >
        <ng-content />
      </app-tabs>
    }
  `,
})
export class LxTabs extends TabsBase {
  protected platform = inject(PlatformService);
}
