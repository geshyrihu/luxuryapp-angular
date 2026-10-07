import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { IncidentListDTO } from "../interfaces/incident.interfaces";

@Component({
  selector: "app-incident-list-mobile",
  templateUrl: "./incident-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    ApiDatePipe,
    LuxDataViewMobile,
  ],
})
export class IncidentListMobile {
  data = input.required<IncidentListDTO[]>();
  globalFilterFields = input<string[]>([]);
  employeeId = input<string>();

  add = output<{ id: string; title: string }>();
  edit = output<IncidentListDTO>();
  resolve = output<IncidentListDTO>();

  getSeverityBadge(severity: string): string {
    const map: Record<string, string> = {
      Low: "bg-sky-100 text-sky-700 border-sky-200",
      Moderate: "bg-amber-100 text-amber-700 border-amber-200",
      Medium: "bg-red-100 text-red-700 border-red-200",
      High: "bg-red-100 text-red-700 border-red-200",
    };
    return map[severity] ?? "bg-slate-100 text-slate-700 border-slate-200";
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      Reportado: "bg-amber-100 text-amber-700 border-amber-200",
      EnInvestigacion: "bg-sky-100 text-sky-700 border-sky-200",
      ResueltoSinSancion: "bg-green-100 text-green-700 border-green-200",
      ResueltoConSancion: "bg-red-100 text-red-700 border-red-200",
      Archivado: "bg-slate-100 text-slate-700 border-slate-200",
      Cancelado: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return map[status] ?? "bg-slate-100 text-slate-700 border-slate-200";
  }
}
