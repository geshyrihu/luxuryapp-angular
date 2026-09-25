import { CommonModule, CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import type { TagSeverity } from "@ui/base/tag.base";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonProgressBar,
} from "@ionic/angular";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { DialogSize } from "@core/enums/dialog-size.enum";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { CommitteeMorosoItemDto } from "../interfaces/committee-cobranza.dto";
import { CommitteeCobranzaBaseService } from "./committee-cobranza-base.service";
import { CommitteeCobranzaDetailModal } from "./committee-cobranza-detail-modal";

@Component({
  selector: "app-committee-cobranza-mobile",

  imports: [
    CurrencyPipe,
    CommonModule,
    AppIcon,
    LxTag,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
    IonProgressBar,
  ],
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

