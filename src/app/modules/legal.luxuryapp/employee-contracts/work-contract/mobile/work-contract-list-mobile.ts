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
import { EmployeeWorkContractListDTO } from "../interfaces/work-contract.dto";

@Component({
  selector: "app-work-contract-list-mobile",
  templateUrl: "./work-contract-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    DataViewMobile,
    ApiDatePipe],
})
export class WorkContractListMobile {
  data = input.required<EmployeeWorkContractListDTO[]>();
  globalFilterFields = input<string[]>([]);
  showAdd = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<EmployeeWorkContractListDTO>();
  viewDetail = output<EmployeeWorkContractListDTO>();

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      Activo: "badge-success",
      Borrador: "badge-neutral",
      Expirado: "badge-warning",
      Terminado: "badge-danger",
      Cancelado: "badge-danger",
      Suspendido: "badge-warning",
      PendienteFirma: "badge-info",
      Firmado: "badge-success",
    };
    return map[status] ?? "badge-neutral";
  }
}
