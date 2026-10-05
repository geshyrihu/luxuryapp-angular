import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-calendario-maestro-equipo-mobile",
  templateUrl: "./calendario-maestro-equipo-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileButtonLabelDelete,
    ButtonMobile,
    MobileActionMenu,
    DataViewMobile,
    MobileListItem,
  ],
})
export class CalendarioMaestroEquipoMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  showAdd = input<boolean>(true);

  add = output<{ id: number; title: string }>();
  edit = output<{ id: any; title: string }>();
  delete = output<any>();
}
