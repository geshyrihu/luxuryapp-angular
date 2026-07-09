import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { IconFieldBase } from "@ui/base/iconfield.base";
import { AppIconField } from "@ui/web/iconfield/iconfield";
import { MobileIconField } from "@ui/mobile/iconfield/iconfield";

@Component({
  selector: "lx-iconfield",
  standalone: true,
  imports: [AppIconField, MobileIconField],
  template: `
    @if (platform.isMobile()) {
      <ili-iconfield [iconPosition]="iconPosition()"><ng-content /></ili-iconfield>
    } @else {
      <app-iconfield [iconPosition]="iconPosition()"><ng-content /></app-iconfield>
    }
  `,
})
export class LxIconField extends IconFieldBase {
  protected platform = inject(PlatformService);
}
