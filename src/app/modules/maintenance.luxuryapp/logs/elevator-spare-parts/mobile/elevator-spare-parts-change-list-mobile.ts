import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

import { ButtonWeb } from "@ui/buttons/web";
@Component({
  selector: "app-elevator-spare-parts-change-list-mobile",
  templateUrl: "./elevator-spare-parts-change-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    CommonModule,
    MobileActionMenu,
    ButtonMobile,
    LuxDataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class ElevatorSparePartsChangeListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
  downloadPdf = output<void>();
}
