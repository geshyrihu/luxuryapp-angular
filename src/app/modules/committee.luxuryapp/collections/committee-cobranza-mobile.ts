import { CommonModule, CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
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
import { LxTag } from "@ui/adaptive/tag/tag";
import type { TagSeverity } from "@ui/core/tag.base";
import { CommitteeMorosoItemDto } from "../interfaces/committee-cobranza.dto";
import { CommitteeCobranzaBaseService } from "./committee-cobranza-base.service";
import { CommitteeCobranzaDetailModal } from "./committee-cobranza-detail-modal";

@Component({
  selector: "app-committee-cobranza-mobile",
  imports: [
    CurrencyPipe,
    CommonModule,
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
    IonProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./committee-cobranza-mobile.html",
})
export class CommitteeCobranzaMobile {
  baseService = inject(CommitteeCobranzaBaseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private customerIdS = inject(CustomerIdService);

  openDetailModal(item: CommitteeMorosoItemDto) {
    const customerId = this.customerIdS.customerId();
    this.dialogHandlerS.openDialogCustom(CommitteeCobranzaDetailModal, {
      title: `Detalle de Movimientos - ${item.departamento}`,
      size: this.dialogHandlerS.sizeFull,
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
