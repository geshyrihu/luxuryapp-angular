import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-acta-constitutiva-list-mobile",
  templateUrl: "./acta-constitutiva-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WebButtonLabelViewPdf, DataViewMobile, MobileListItem, AppIcon],
})
export class ActaConstitutivaListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
}
