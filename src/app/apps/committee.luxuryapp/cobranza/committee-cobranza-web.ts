import { CommonModule, CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import type { TagSeverity } from "@ui/base/tag.base";
import { LxTag } from "@ui/adaptive/tag/tag";
import { AppStatCard } from "@ui/shared/stat-card/stat-card";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { AppProgressBar } from "@ui/web/progress-bar/progress-bar";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CommitteeMorosoItemDto } from "../interfaces/committee-cobranza.dto";
import { CommitteeCobranzaBaseService } from "./committee-cobranza-base.service";
import { CommitteeCobranzaDetailModal } from "./committee-cobranza-detail-modal";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-committee-cobranza-web",
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CurrencyPipe,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    TagModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    AppStatCard,
    AppProgressBar,
    LxTag,
    AppIcon,
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
