import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { InputIconBase } from "@ui/base/inputicon.base";
import { AppInputIcon } from "@ui/web/inputicon/inputicon";
import { MobileInputIcon } from "@ui/mobile/inputicon/inputicon";

@Component({
  selector: "lx-inputicon",
  standalone: true,
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
