import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
@Component({
  selector: "app-lista-evaluacion-realizada-mobile",
  templateUrl: "./lista-evaluacion-realizada-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    DataViewMobile],
})
export class ListaEvaluacionRealizadaMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<string>();
  delete = output<string>();
}
