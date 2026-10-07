import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
@Component({
  selector: "app-lista-plantilla-evaluacion-mobile",
  templateUrl: "./lista-plantilla-evaluacion-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileListItem, MobileActionMenu, ButtonMobile, LuxDataViewMobile],
})
export class ListaPlantillaEvaluacionMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<string>();
  delete = output<string>();
}
