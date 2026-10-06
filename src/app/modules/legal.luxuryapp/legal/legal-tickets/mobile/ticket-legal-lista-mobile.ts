import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-ticket-legal-lista-mobile",
  templateUrl: "./ticket-legal-lista-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MobileActionMenu,
    ButtonMobile,
    FormsModule,
    DataViewMobile,
    MobileListItem,
    LxIcon],
})
export class TicketLegalListaMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  canChangeCustomer = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  updateStatus = output<{ id: string }>();
  seguimiento = output<any>();
  reasignarCliente = output<any>();
}
