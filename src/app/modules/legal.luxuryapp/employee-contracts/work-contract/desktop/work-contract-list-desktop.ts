import { CurrencyPipe } from "@angular/common";
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
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { EmployeeWorkContractListDTO } from "../interfaces/work-contract.dto";

@Component({
  selector: "app-work-contract-list-desktop",
  templateUrl: "./work-contract-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    WebButtonIconItem,
    ButtonWeb,
    WebButtonIconDelete,
    WebButtonIconViewPdf,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    LuxTableCaption,
    TableFooter,
  ],
})
export class WorkContractListDesktop {
  private tableScrollH = inject(TableScrollHeightService);

  data = input.required<EmployeeWorkContractListDTO[]>();
  globalFilterFields = input<string[]>([]);
  showAdd = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<EmployeeWorkContractListDTO>();
  viewDetail = output<EmployeeWorkContractListDTO>();
  delete = output<string>();
  terminate = output<EmployeeWorkContractListDTO>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollH.scrollHeight;

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
