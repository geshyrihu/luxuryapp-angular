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
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { ContractAddendumListDTO } from "../interfaces/contract-addendum.dto";

@Component({
  selector: "app-contract-addendum-list-desktop",
  templateUrl: "./contract-addendum-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIconItem,
    ButtonWeb,
    WebButtonIconDelete,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    LuxTableCaption,
    TableFooter,
  ],
})
export class ContractAddendumListDesktop {
  private tableScrollH = inject(TableScrollHeightService);

  data = input.required<ContractAddendumListDTO[]>();
  globalFilterFields = input<string[]>([]);
  showAdd = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<ContractAddendumListDTO>();
  sign = output<ContractAddendumListDTO>();
  cancel = output<ContractAddendumListDTO>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollH.scrollHeight;

  getAddendumTypeBadge(type: string): string {
    const map: Record<string, string> = {
      ModificacionSalario: "badge-warning",
      CambioPuesto: "badge-info",
      CambioDepartamento: "badge-info",
      CambioUbicacion: "badge-info",
      ExtensionContrato: "badge-primary",
      ModificacionJornada: "badge-info",
      ClausulaAdicional: "badge-neutral",
      OtrasCondiciones: "badge-neutral",
    };
    return map[type] ?? "badge-neutral";
  }

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
