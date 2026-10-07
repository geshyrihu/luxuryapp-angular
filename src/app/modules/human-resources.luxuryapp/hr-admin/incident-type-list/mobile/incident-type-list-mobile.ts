import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { IncidentTypeListDTO } from "@human-resources.luxuryapp/evaluation/hr-catalog/interfaces/hr-catalog.interfaces";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
@Component({
  selector: "app-incident-type-list-mobile",
  templateUrl: "./incident-type-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MobileListItem, MobileActionMenu, ButtonMobile, LuxDataViewMobile],
})
export class IncidentTypeListMobile {
  data = input.required<IncidentTypeListDTO[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
