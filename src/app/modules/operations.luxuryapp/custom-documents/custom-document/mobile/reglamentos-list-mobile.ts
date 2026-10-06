import { ButtonWeb } from "@ui/buttons/web";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-reglamentos-list-mobile",
  templateUrl: "./reglamentos-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonWeb,
    PdfViewerTrigger,
    LxTooltipDirective,
    DataViewMobile,
    MobileListItem,
    LxIcon],
})
export class ReglamentosListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  consult = output<string>();
}
