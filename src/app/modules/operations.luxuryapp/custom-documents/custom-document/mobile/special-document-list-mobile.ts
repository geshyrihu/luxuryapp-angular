import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";

@Component({
  selector: "app-special-document-list-mobile",
  templateUrl: "./special-document-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PdfViewerTrigger, LuxDataViewMobile, MobileListItem, LxIcon],
})
export class SpecialDocumentListMobile {
  data = input.required<any[]>();
}
