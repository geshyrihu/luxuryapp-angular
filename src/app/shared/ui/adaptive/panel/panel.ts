import { Component, inject } from "@angular/core";
import { PanelBase } from "@ui/base/panel.base";
import { AppPanel } from "@ui/web/panel/panel";
import { IliPanel } from "@ui/mobile/panel/panel";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-panel",
  standalone: true,
  imports: [AppPanel, IliPanel],
  template: `
    @if (platform.isMobile()) {
      <ili-panel [header]="header()">
        <ng-content />
      </ili-panel>
    } @else {
      <app-panel [header]="header()">
        <ng-content />
      </app-panel>
    }
  `,
})
export class LxPanel extends PanelBase {
  protected platform = inject(PlatformService);
}
