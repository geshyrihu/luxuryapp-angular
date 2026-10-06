import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ButtonMobile } from "@ui/buttons/mobile";
import { TagSeverity } from "@ui/core/tag.base";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { NIVEL_PRIORIDAD_TAG_OPTIONS } from "../nivel-prioridad-tag-options";
import { TIPO_SOLICITUD_TAG_OPTIONS } from "../tipo-solicitud-tag-options";

@Component({
  selector: "app-solicitud-compra-list-mobile",
  templateUrl: "./solicitud-compra-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    ApiDatePipe,
    WebButtonLabel,
    MobileActionMenu,
    DataViewMobile,
    LxIcon,
    MobileListItem,
    LxTag,
  ],
})
export class SolicitudCompraListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isPendingView = input<boolean>(false);
  isAuthorizedView = input<boolean>(false);
  selectedSolicitudIds = input<string[]>([]);

  add = output<void>();
  toggleSelection = output<{ id: string; checked: boolean }>();
  edit = output<string>();
  authorizationDetail = output<any>();
  desauthorize = output<any>();
  delete = output<string>();
  presentationMode = output<void>();

  isInPresentation(id: string): boolean {
    return this.data().some(
      (item) => item.id === id && item.selectedForPresentation,
    );
  }

  getTipoSolicitudLabel(value: number): string {
    return (
      TIPO_SOLICITUD_TAG_OPTIONS.find((item) => item.value === value)?.label ??
      "N/D"
    );
  }

  getTipoSolicitudSeverity(value: number): TagSeverity {
    return (
      TIPO_SOLICITUD_TAG_OPTIONS.find((item) => item.value === value)
        ?.severity ?? "secondary"
    );
  }

  getPrioridadLabel(value: number): string {
    return (
      NIVEL_PRIORIDAD_TAG_OPTIONS.find((item) => item.value === value)?.label ??
      "N/D"
    );
  }

  getPrioridadSeverity(value: number): TagSeverity {
    return (
      NIVEL_PRIORIDAD_TAG_OPTIONS.find((item) => item.value === value)
        ?.severity ?? "secondary"
    );
  }
}
