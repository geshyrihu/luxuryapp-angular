import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { EquipmentContentDto } from "../interfaces/equipment-content.dto";

@Component({
  selector: "app-equipment-content-list-mobile",
  templateUrl: "./equipment-content-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDataViewMobile, LxIcon],
})
export class EquipmentContentListMobile {
  data = input.required<EquipmentContentDto[]>();
  loading = input<boolean>(false);
  title = input<string>("");
  globalFilterFields = input<string[]>([]);
  canManage = input<boolean>(false);

  add = output<void>();
  edit = output<EquipmentContentDto>();
  delete = output<string>();
}
