import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { SanctionListDTO } from "../interfaces/sanction.dto";
import { ButtonMobile } from "@ui/buttons/mobile";

@Component({
  selector: "app-sanction-list-mobile",
  templateUrl: "./sanction-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    CommonModule,
    ApiDatePipe,
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    DataViewMobile,
  ],
})
export class SanctionListMobile {
  data = input.required<SanctionListDTO[]>();

  changeStatus = output<SanctionListDTO>();

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      Activa: "bg-green-100 text-green-700 border-green-200",
      Apelada: "bg-amber-100 text-amber-700 border-amber-200",
      Suspendida: "bg-amber-100 text-amber-700 border-amber-200",
      Cumplida: "bg-slate-100 text-slate-700 border-slate-200",
      Revocada: "bg-red-100 text-red-700 border-red-200",
    };
    return map[status] ?? "bg-slate-100 text-slate-700 border-slate-200";
  }
}
