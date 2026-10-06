import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-tool-list-mobile",
  templateUrl: "./tool-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    ButtonMobile,
    DataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class ToolListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isSuperUsuario = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
}
