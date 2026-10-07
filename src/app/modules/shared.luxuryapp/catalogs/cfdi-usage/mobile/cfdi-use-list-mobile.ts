import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { CfdiUseDto } from "../interfaces/cfdi-use.dto";

@Component({
  selector: "app-cfdi-use-list-mobile",
  templateUrl: "./cfdi-use-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileActionMenu, ButtonMobile, MobileListItem, LuxDataViewMobile],
})
export class CfdiUseListMobile {
  data = input.required<CfdiUseDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
