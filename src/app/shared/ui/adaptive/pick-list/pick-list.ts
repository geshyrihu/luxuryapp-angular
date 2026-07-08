import { Component, inject } from "@angular/core";
import { PickListBase } from "@ui/base/pick-list.base";
import { MobilePickList } from "@ui/mobile/pick-list/pick-list";
import { PickList } from "@ui/web/pick-list/pick-list";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-pick-list",

  imports: [PickList, MobilePickList],
  template: `
    @if (platform.isMobile()) {
      <ili-pick-list [(source)]="source" [(target)]="target" />
    } @else {
      <app-pick-list [(source)]="source" [(target)]="target" />
    }
  `,
})
export class LxPickList extends PickListBase {
  protected platform = inject(PlatformService);
}
