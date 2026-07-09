import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppToolbar } from "@ui/web/toolbar/toolbar";
import { MobileToolbar } from "@ui/mobile/toolbar/toolbar";
import { ToolbarBase } from "@ui/base/toolbar.base";

@Component({
  selector: "lx-toolbar",
  standalone: true,
  imports: [AppToolbar, MobileToolbar],
  template: `
    @if (platform.isMobile()) {
      <ili-toolbar  [styleClass]="styleClass()"><ng-content/></ili-toolbar>
    } @else {
      <app-toolbar  [styleClass]="styleClass()"><ng-content/></app-toolbar>
    }
  `,
})
export class LxToolbar extends ToolbarBase {
  protected platform = inject(PlatformService);
}
