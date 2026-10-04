import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-minuta-pendientes-list-mobile",
  templateUrl: "./minuta-pendientes-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AppIcon,
    MobileListItem,
    DataViewMobile,
    MobileActionMenu,
    MobileButtonLabelEdit,
  ],
})
export class MinutaPendientesListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  verDetalle = output<{ id: string; title: string }>();
}
