import { CommonModule, CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import type { TagSeverity } from "@ui/base/tag.base";
import { AppProgressBar } from "@ui/web/progress-bar/progress-bar";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { CommitteeMorosoItemDto } from "../interfaces/committee-cobranza.dto";
import { CommitteeCobranzaBaseService } from "./committee-cobranza-base.service";
import { CommitteeCobranzaDetailModal } from "./committee-cobranza-detail-modal";

@Component({
  selector: "app-committee-cobranza-mobile",
  standalone: true,
  imports: [CurrencyPipe, CommonModule, AppIcon, AppProgressBar, LxTag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./committee-cobranza-mobile.html",
})
export class CommitteeCobranzaMobile {
  baseService = inject(CommitteeCobranzaBaseService);
  private dialogS = inject(DialogHandlerService);
  private customerIdS = inject(CustomerIdService);

  openDetailModal(item: CommitteeMorosoItemDto) {
    const customerId = this.customerIdS.customerId();
    this.dialogS.openDialogCustom(CommitteeCobranzaDetailModal, {
      title: `Detalle de Movimientos - ${item.departamento}`,
      size: DialogSize.full,
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
}
