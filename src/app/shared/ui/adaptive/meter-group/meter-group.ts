import { Component, inject } from "@angular/core";
import { MeterGroupBase } from "@ui/base/meter-group.base";
import { MobileMeterGroup } from "@ui/mobile/meter-group/meter-group";
import { AppMeterGroup } from "@ui/web/meter-group/meter-group";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-meter-group",

  imports: [AppMeterGroup, MobileMeterGroup],
  template: `
    @if (platform.isMobile()) {
      <ili-meter-group [value]="value()" [min]="min()" [max]="max()" />
    } @else {
      <app-meter-group [value]="value()" [min]="min()" [max]="max()" />
    }
  `,
})
export class LxMeterGroup extends MeterGroupBase {
  protected platform = inject(PlatformService);
}
