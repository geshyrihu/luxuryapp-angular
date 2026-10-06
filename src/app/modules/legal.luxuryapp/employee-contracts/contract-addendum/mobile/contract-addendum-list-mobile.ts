import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ContractAddendumListDTO } from "../interfaces/contract-addendum.dto";

@Component({
  selector: "app-contract-addendum-list-mobile",
  templateUrl: "./contract-addendum-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    DataViewMobile,
    ApiDatePipe],
})
export class ContractAddendumListMobile {
  data = input.required<ContractAddendumListDTO[]>();
  globalFilterFields = input<string[]>([]);
  showAdd = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<ContractAddendumListDTO>();

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      Borrador: "badge-neutral",
      Pendiente: "badge-warning",
      Firmado: "badge-success",
      Cancelado: "badge-danger",
    };
    return map[status] ?? "badge-neutral";
  }
}
