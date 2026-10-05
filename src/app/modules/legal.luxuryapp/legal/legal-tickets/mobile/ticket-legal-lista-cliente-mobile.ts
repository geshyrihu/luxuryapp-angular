import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxBadge } from "@ui/adaptive/badge/badge";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-ticket-legal-lista-cliente-mobile",
  templateUrl: "./ticket-legal-lista-cliente-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LxBadge,
    LxTag,
    MobileButtonLabelItem,
    MobileActionMenu,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
})
export class TicketLegalListaClienteMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  updateStatus = output<{ id: string }>();
  seguimientoCliente = output<any>();
  viewDetail = output<{ id: string }>();
}
