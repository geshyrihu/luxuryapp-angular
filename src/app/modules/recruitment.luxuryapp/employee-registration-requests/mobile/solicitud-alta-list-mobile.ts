import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { DateService } from "@core/services/date.service";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import type { SolicitudAltaListItem } from "../solicitud-alta-list";

import { ButtonMobile } from "@ui/buttons/mobile";
@Component({
  selector: "app-solicitud-alta-list-mobile",
  templateUrl: "./solicitud-alta-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    LuxDataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class SolicitudAltaListMobile {
  private readonly dateS = inject(DateService);

  data = input.required<SolicitudAltaListItem[]>();
  globalFilterFields = input<string[]>([]);

  sendHiringDocs = output<SolicitudAltaListItem>();
  completeAlta = output<SolicitudAltaListItem>();
  abortHiring = output<SolicitudAltaListItem>();
  goToEmployeeFile = output<SolicitudAltaListItem>();
  concludeHiring = output<string>();
  viewRequestDetails = output<SolicitudAltaListItem>();

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
