import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PdfViewerTriggerMobile } from "@ui/mobile/pdf-viewer-trigger-mobile/pdf-viewer-trigger-mobile";

@Component({
  selector: "app-contracts-policies-mobile",
  templateUrl: "./contracts-policies-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PdfViewerTriggerMobile,
    LuxDataViewMobile,
    MobileListItem,
    MobileActionMenu,
  ],
})
export class ContractsPoliciesMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
}
