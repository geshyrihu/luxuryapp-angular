import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-legal-pendientes-minuta-mobile",
  templateUrl: "./legal-pendientes-minuta-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MobileActionMenu,
    ButtonMobile,
    DataViewMobile,
    SanitizeHtmlPipe,
    MobileListItem,
    AppIcon,
  ],
})
export class LegalPendientesMinutaMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  addTracking = output<number>();
  viewAll = output<number>();
  editMinuta = output<number>();
}
