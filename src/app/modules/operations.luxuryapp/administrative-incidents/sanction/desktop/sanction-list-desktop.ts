import { CommonModule } from "@angular/common";
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
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { SanctionListDTO } from "../interfaces/sanction.dto";

@Component({
  selector: "app-sanction-list-desktop",
  templateUrl: "./sanction-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ApiDatePipe,
    AppTable,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    WebButtonIconItem,
  ],
})
export class SanctionListDesktop {
  data = input.required<SanctionListDTO[]>();
  globalFilterFields = input<string[]>([]);
  globalFilter = input<string>("");

  globalFilterChange = output<string>();
  changeStatus = output<SanctionListDTO>();

  private tableScrollH = inject(TableScrollHeightService);
  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollH.scrollHeight;

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
