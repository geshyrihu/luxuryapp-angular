import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { ButtonWeb } from "@ui/buttons/web";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import type { AppIconName } from "@ui/primitives/app-icon/app-icon.catalog";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";

import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-ordenes-servicio-list-desktop",
  templateUrl: "./ordenes-servicio-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    CommonModule,
    RouterModule,
    CustomInputTextSignal,
    WebButtonIcon,
    WebButtonIconItem,
    WebButtonIconDelete,
    WebButtonLabel,
    LuxTableCaption,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTag,
    LxTooltipDirective,
  ],
})
export class OrdenesServicioListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  fechaControl = input.required<FormControl<string | null>>();
  filtroEquiposValue = input<any>();
  filtroId = input<any>();
  filtroEquipos = input<{ icon: AppIconName; id: any | string; nombre: string }[]>(
    [],
  );

  reloadOrdenes = output<{ id: any; value: any }>();
  edit = output<{
    id: any;
    title: string;
    machineryId: any;
    providerId: any;
  }>();
  delete = output<string>();
  help = output<void>();
  report = output<void>();
  reportTabla = output<void>();
  reportPorEquipo = output<void>();
  photos = output<string>();
  providerReport = output<string>();
  uploadImg = output<string>();
  uploadDoc = output<string>();
  followUp = output<string>();
  resume = output<string>();
  suspend = output<any>();
  navigateMessage = output<{ id: any; status: number; nameGroup: string }>();

  getStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return "Pendiente";
      case 1:
        return "Concluido";
      case 2:
        return "No Autorizado";
      case 3:
        return "Proceso";
      case 4:
        return "Cancelado";
      default:
        return "Sin estatus";
    }
  }

  getBadgeSeverity(status: number): string {
    switch (status) {
      case 0:
        return "danger";
      case 1:
        return "success";
      case 2:
        return "secondary";
      case 3:
        return "info";
      case 4:
        return "secondary";
      default:
        return "secondary";
    }
  }
}
