import { Component, inject } from "@angular/core";
import { InplaceBase } from "@ui/base/inplace.base";
import { MobileInplace } from "@ui/mobile/inplace/inplace";
import { AppInplace } from "@ui/web/inplace/inplace";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-inplace",

  imports: [AppInplace, MobileInplace],
  template: `
    @if (platform.isMobile()) {
      <ili-inplace [(active)]="active" [closable]="closable()">
        <ng-content />
      </ili-inplace>
    } @else {
      <app-inplace [(active)]="active" [closable]="closable()">
        <ng-content />
      </app-inplace>
    }
  `,
})
export class LxInplace extends InplaceBase {
  protected platform = inject(PlatformService);
}
