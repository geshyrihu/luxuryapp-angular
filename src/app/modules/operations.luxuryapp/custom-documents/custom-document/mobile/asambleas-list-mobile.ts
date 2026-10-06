import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-asambleas-list-mobile",
  templateUrl: "./asambleas-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PdfViewerTrigger, DataViewMobile, MobileListItem, LxIcon],
})
export class AsambleasListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
}
