import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CommitteeCobranzaBaseService } from "./committee-cobranza-base.service";
import { CommitteeMorosoItemDto } from "../interfaces/committee-cobranza.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { AspelCobranzaHausDebtDetailModal } from "../../cobranza.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus-debt-detail-modal";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";

@Component({
  selector: "app-committee-cobranza-mobile",
  standalone: true,
  imports: [CurrencyPipe, AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./committee-cobranza-mobile.html",
})
export class CommitteeCobranzaMobile {
  baseService = inject(CommitteeCobranzaBaseService);
  private dialogS = inject(DialogHandlerService);
  private customerIdS = inject(CustomerIdService);

  openDetailModal(item: CommitteeMorosoItemDto) {
    const customerId = this.customerIdS.customerId();
    this.dialogS.openDialogCustom(AspelCobranzaHausDebtDetailModal, {
      title: `Detalle de Deuda - ${item.departamento}`,
      size: DialogSize.full,
      data: {
        row: item,
        customerId: customerId,
        fechaFin: this.baseService.morososData()?.fechaCorte,
        isCommitteeMode: true,
      },
    });
  }
}
