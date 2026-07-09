import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppPanelmenu } from "@ui/web/panelmenu/panelmenu";
import { MobilePanelmenu } from "@ui/mobile/panelmenu/panelmenu";
import { PanelmenuBase } from "@ui/base/panelmenu.base";

@Component({
  selector: "lx-panelmenu",
  standalone: true,
  imports: [AppPanelmenu, MobilePanelmenu],
  template: `
    @if (platform.isMobile()) {
      <ili-panelmenu [model]="model()" [styleClass]="styleClass()"><ng-content/></ili-panelmenu>
    } @else {
      <app-panelmenu [model]="model()" [styleClass]="styleClass()"><ng-content/></app-panelmenu>
    }
  `,
})
export class LxPanelmenu extends PanelmenuBase {
  protected platform = inject(PlatformService);
}
