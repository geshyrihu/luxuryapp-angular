import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  IonAccordion,
  IonAccordionGroup,
  IonAvatar,
  IonButton,
  IonItem,
  IonLabel,
} from "@ionic/angular";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonMobile } from "@ui/buttons/mobile";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { LxIcon } from "@ui/adaptive/icon/icon";
import type { AppIconName } from "@ui/primitives/app-icon/app-icon.catalog";

@Component({
  selector: "app-ordenes-servicio-list-mobile",
  templateUrl: "./ordenes-servicio-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    CommonModule,
    RouterModule,
    CustomInputTextSignal,
    IonItem,
    IonLabel,
    IonAvatar,
    IonAccordionGroup,
    IonAccordion,
    IonButton,
    LxTag,
    MobileActionMenu,
    DataViewMobile,
    LxIcon,
  ],
})
export class OrdenesServicioListMobile {
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
