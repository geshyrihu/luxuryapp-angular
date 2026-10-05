import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-reglamentos-list-mobile",
  templateUrl: "./reglamentos-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIcon,
    PdfViewerTrigger,
    LxTooltipDirective,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
})
export class ReglamentosListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  consult = output<string>();
}
