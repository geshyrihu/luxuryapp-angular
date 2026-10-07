import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-comites-list-mobile",
  templateUrl: "./comites-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDataViewMobile, MobileListItem, LxIcon],
})
export class ComitesListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
}
