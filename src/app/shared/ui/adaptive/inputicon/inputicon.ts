import { Component, inject } from "@angular/core";
import { InputIconBase } from "@ui/base/inputicon.base";
import { MobileInputIcon } from "@ui/mobile/inputicon/inputicon";
import { AppInputIcon } from "@ui/web/inputicon/inputicon";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-inputicon",

  imports: [AppInputIcon, MobileInputIcon],
  template: `
    @if (platform.isMobile()) {
      <ili-inputicon [styleClass]="styleClass()" />
    } @else {
      <app-inputicon [styleClass]="styleClass()" />
    }
  `,
})
export class LxInputIcon extends InputIconBase {
  protected platform = inject(PlatformService);
}
