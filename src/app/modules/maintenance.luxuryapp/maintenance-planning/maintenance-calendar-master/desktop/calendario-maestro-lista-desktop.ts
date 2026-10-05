import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MenuItem } from "@core/interfaces/menu-item.interface";
import { LxMenu } from "@ui/adaptive/menu/menu";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-calendario-maestro-lista-desktop",
  templateUrl: "./calendario-maestro-lista-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxMenu,
    LxTag,
    LxTooltipDirective,
    WebButtonLabelAdd,
    WebButtonLabelItem,
    AppIcon,
  ],
})
export class CalendarioMaestroListaDesktop {
  data = input.required<any[]>();
  menuItems = input<MenuItem[]>([]);
  canManage = input<boolean>(false);

  add = output<{ id: number; mes: number }>();
  selectItem = output<{ item: any; menu: LxMenu }>();
  datosServicio = output<any>();
}
