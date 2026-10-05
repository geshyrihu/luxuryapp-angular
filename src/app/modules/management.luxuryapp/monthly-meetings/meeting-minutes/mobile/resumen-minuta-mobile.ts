import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-resumen-minuta-mobile",
  templateUrl: "./resumen-minuta-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataViewMobile, MobileListItem, AppIcon],
})
export class ResumenMinutaMobile {
  data = input.required<any[]>();

  getSeverityText(status: number): string {
    switch (status) {
      case 0:
        return "Pendiente";
      case 1:
        return "Concluido";
      case 2:
        return "No Autorizado";
      default:
        return "Desconocido";
    }
  }
}
