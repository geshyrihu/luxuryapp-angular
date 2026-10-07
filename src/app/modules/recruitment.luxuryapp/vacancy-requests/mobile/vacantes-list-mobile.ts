import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-vacantes-list-mobile",
  templateUrl: "./vacantes-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    LuxDataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class VacantesListMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isSuperUser = input<boolean>(false);

  edit = output<{ id: string }>();
  delete = output<string>();
  deletePermanente = output<string>();
  detail = output<string>();
  jobDescription = output<string>();
}
