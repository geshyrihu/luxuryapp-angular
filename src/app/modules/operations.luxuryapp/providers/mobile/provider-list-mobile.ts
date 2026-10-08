import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxButton } from "@ui/adaptive/button/button";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-provider-list-mobile",
  templateUrl: "./provider-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxButton,
    ButtonMobile,
    MobileActionMenu,
    MobileListItem,
    LxIcon,
    LuxDataViewMobile,
  ],
})
export class ProviderListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<any>();
}
