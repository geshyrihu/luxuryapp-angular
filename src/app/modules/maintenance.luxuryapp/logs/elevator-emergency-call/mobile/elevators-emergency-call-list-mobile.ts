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
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

import { ButtonWeb } from "@ui/buttons/web";
@Component({
  selector: "app-elevators-emergency-call-list-mobile",
  templateUrl: "./elevators-emergency-call-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    MobileActionMenu,
    ButtonMobile,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
})
export class ElevatorsEmergencyCallListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
  downloadPdf = output<void>();
}
