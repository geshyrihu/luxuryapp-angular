import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";

@Component({
  selector: "app-asambleas-list-mobile",
  templateUrl: "./asambleas-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PdfViewerTrigger, LuxDataViewMobile, MobileListItem, LxIcon],
})
export class AsambleasListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
}
