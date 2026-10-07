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

@Component({
  selector: "app-minuta-pendientes-list-mobile",
  templateUrl: "./minuta-pendientes-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    CommonModule,
    LxIcon,
    MobileListItem,
    LuxDataViewMobile,
    MobileActionMenu,
  ],
})
export class MinutaPendientesListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  verDetalle = output<{ id: string; title: string }>();
}
