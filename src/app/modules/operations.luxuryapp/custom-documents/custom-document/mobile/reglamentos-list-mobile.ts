import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";

@Component({
  selector: "app-reglamentos-list-mobile",
  templateUrl: "./reglamentos-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    PdfViewerTrigger,
    LxTooltipDirective,
    LuxDataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class ReglamentosListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  consult = output<string>();
}
