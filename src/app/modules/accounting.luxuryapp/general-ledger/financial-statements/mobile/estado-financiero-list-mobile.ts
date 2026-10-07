import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-estado-financiero-list-mobile",
  templateUrl: "./estado-financiero-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxTag,
    MobileActionMenu,
    ButtonMobile,
    MobileListItem,
    LuxDataViewMobile,
    LxIcon,
  ],
})
export class EstadoFinancieroListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  processingSend = input<Set<string>>(new Set());

  upload = output<{ id: string; title: string }>();
  authorize = output<string>();
  desauthorize = output<string>();
  send = output<{ id: string; title: string }>();
  viewPdf = output<{ url: string; fileName: string }>();

  isProcessingSend(id: string): boolean {
    return this.processingSend().has(id);
  }
}
