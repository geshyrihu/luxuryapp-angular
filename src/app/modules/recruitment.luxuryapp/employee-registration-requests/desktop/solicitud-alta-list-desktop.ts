import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  ViewChild,
} from "@angular/core";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { FilterRequestsService } from "@core/http/services/filter-requests.service";
import { DateService } from "@core/services/date.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import {
  requestStatusBorderColor,
  requestStatusTagSeverity,
} from "../../recruitment-shared/request-status-style";
import type { SolicitudAltaListItem } from "../solicitud-alta-list";

import { ButtonWeb } from "@ui/buttons/web";
@Component({
  selector: "app-solicitud-alta-list-desktop",
  templateUrl: "./solicitud-alta-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableFooter,
    LxTag,
    WebButtonLabel,
  ],
})
export class SolicitudAltaListDesktop {
  private readonly dateS = inject(DateService);
  private readonly filterRequestsService = inject(FilterRequestsService);
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  readonly requestStatusBorderColor = requestStatusBorderColor;
  readonly requestStatusTagSeverity = requestStatusTagSeverity;

  data = input.required<SolicitudAltaListItem[]>();
  globalFilterFields = input<string[]>([]);

  completeAlta = output<SolicitudAltaListItem>();
  concludeHiring = output<string>();
  abortHiring = output<SolicitudAltaListItem>();
  goToEmployeeFile = output<SolicitudAltaListItem>();
  sendHiringDocs = output<SolicitudAltaListItem>();
  viewRequestDetails = output<SolicitudAltaListItem>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  @ViewChild("dt") dt?: AppTable;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    effect(() => {
      const term = this.filterRequestsService.searchTerm();
      this.dt?.filterGlobal(term, "contains");
    });
  }

  documentationSentTooltip(item: SolicitudAltaListItem): string {
    if (!item.isDocumentationSent) return "Documentación pendiente de envío";

    const sentAt = item.documentationSentAt
      ? this.dateS.formatDateTime(new Date(item.documentationSentAt))
      : "";

    return sentAt
      ? `Documentación enviada el ${sentAt}`
      : "Documentación enviada";
  }

  canCompleteAlta(item: SolicitudAltaListItem): boolean {
    return item.status === "Pendiente";
  }

  canManageLinkedAlta(item: SolicitudAltaListItem): boolean {
    return item.isEmployeeLinked && item.status === "Proceso";
  }

  canOpenCompletedFile(item: SolicitudAltaListItem): boolean {
    return (
      item.status === "Concluido" &&
      !!item.employeeId &&
      !!item.applicationUserId
    );
  }

  isCancelled(item: SolicitudAltaListItem): boolean {
    return item.status === "Cancelado";
  }
}
