import { Component, inject } from "@angular/core";
import { InputGroupBase } from "@ui/base/input-group.base";
import { MobileInputGroup } from "@ui/mobile/input-group/input-group";
import { AppInputGroup } from "@ui/web/input-group/input-group";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-input-group",

  imports: [AppInputGroup, MobileInputGroup],
  template: `
    @if (platform.isMobile()) {
      <ili-input-group
        [addonBefore]="addonBefore()"
        [addonAfter]="addonAfter()"
      >
        <ng-content />
      </ili-input-group>
    } @else {
      <app-input-group
        [addonBefore]="addonBefore()"
        [addonAfter]="addonAfter()"
      >
        <ng-content />
      </app-input-group>
    }
  `,
})
export class LxInputGroup extends InputGroupBase {
  protected platform = inject(PlatformService);
}
