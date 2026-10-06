import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from '@ui/adaptive/icon/icon';

@Component({
  selector: "app-seguimiento-minutas-mobile",
  templateUrl: "./seguimiento-minutas-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataViewMobile,
    MobileActionMenu,
    ButtonMobile,
    MobileListItem,
    LxIcon,
    LxTag,
    SanitizeHtmlPipe],
})
export class SeguimientoMinutasMobile {
  data = input.required<any[]>();
  statusFiltro = input<number>(0);

  filtrar = output<number>();
  todosSeguimientos = output<number>();
  addSeguimiento = output<number>();
  edit = output<any>();
}
