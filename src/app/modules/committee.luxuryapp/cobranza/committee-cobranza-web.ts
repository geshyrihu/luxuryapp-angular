import { CommonModule, CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import type { TagSeverity } from "@ui/base/tag.base";
import { AppStatCard } from "@ui/shared/stat-card/stat-card";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppProgressBar } from "@ui/web/progress-bar/progress-bar";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { DialogSize } from "@core/enums/dialog-size.enum";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { CommitteeMorosoItemDto } from "../interfaces/committee-cobranza.dto";
import { CommitteeCobranzaBaseService } from "./committee-cobranza-base.service";
import { CommitteeCobranzaDetailModal } from "./committee-cobranza-detail-modal";

@Component({
  selector: "app-committee-cobranza-web",

  imports: [
    CommonModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    CurrencyPipe,
    TableCaption,
    TableEmptyMessage,
    WebButtonIcon,
    LxTooltipDirective,
    AppStatCard,
    AppProgressBar,
    LxTag,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./committee-cobranza-web.html",
})
export class CommitteeCobranzaWeb {
  baseService = inject(CommitteeCobranzaBaseService);
  private dialogS = inject(DialogHandlerService);
  private customerIdS = inject(CustomerIdService);

  openDetailModal(item: CommitteeMorosoItemDto) {
    const customerId = this.customerIdS.customerId();
    this.dialogS.openDialogCustom(CommitteeCobranzaDetailModal, {
      title: `Detalle de Movimientos - ${item.departamento}`,
      size: DialogSize.md,
      data: {
        row: item,
        customerId: customerId,
      },
    });
  }

  /** Color de la etiqueta de situación. Ver docs/aspel/ASPEL_API_GUIDE.md. */
  clasificacionSeverity(clasificacion: string): TagSeverity {
    switch (clasificacion) {
      case "COBRANZA JUDICIAL":
        return "danger";
      case "MOROSOS":
        return "warn";
      case "DEUDA CORRIENTE":
        return "info";
      default:
        return "secondary";
    }
  }

  getBalanceClass(amount: number): string {
    if (amount > 0) return "text-orange-600";
    if (amount < 0) return "text-green-600";
    return "text-500";
  }

  getConceptSeverity(
    concepto: string,
  ): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" {
    const normal = concepto.toLowerCase();
    if (normal.includes("mantenimiento")) return "info";
    if (normal.includes("sancion") || normal.includes("multa")) return "danger";
    if (normal.includes("gas")) return "warning";
    if (normal.includes("agua")) return "success";
    return "secondary";
  }
}
