import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { Tabs } from "@ui/web/tabs/tabs";
import { MobileTabs } from "@ui/mobile/tabs/tabs";
import { TabsBase } from "@ui/base/tabs.base";

@Component({
  selector: "lx-tabs",
  standalone: true,
  imports: [Tabs, MobileTabs],
  template: `
    @if (platform.isMobile()) {
      <ili-tabs [tabs]="tabs()" [(activeId)]="activeId" (tabChange)="tabChange.emit($event)">
        <ng-content />
      </ili-tabs>
    } @else {
      <app-tabs [tabs]="tabs()" [(activeId)]="activeId" (tabChange)="tabChange.emit($event)">
        <ng-content />
      </app-tabs>
    }
  `,
})
export class LxTabs extends TabsBase {
  protected platform = inject(PlatformService);
}
