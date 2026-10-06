import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { IncidentListDTO } from "../interfaces/incident.interfaces";

@Component({
  selector: "app-incident-list-desktop",
  templateUrl: "./incident-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    WebButtonIconViewPdf,
    LxTooltipDirective,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    LuxTableCaption,
    TableFooter,
  ],
})
export class IncidentListDesktop {
  data = input.required<IncidentListDTO[]>();
  globalFilterFields = input<string[]>([]);
  employeeId = input<string>();

  add = output<{ id: string; title: string }>();
  edit = output<IncidentListDTO>();
  resolve = output<IncidentListDTO>();
  cancel = output<IncidentListDTO>();
  delete = output<string>();
  generateAct = output<IncidentListDTO>();
  uploadSignedAct = output<IncidentListDTO>();

  private tableScrollHeightS = inject(TableScrollHeightService);
  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;

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
