import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";

@Component({
  selector: "app-level-three-account-list-mobile",
  templateUrl: "./level-three-account-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    DataViewMobile],
})
export class LevelThreeAccountListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
