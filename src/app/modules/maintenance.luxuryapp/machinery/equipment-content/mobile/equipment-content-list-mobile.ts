import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { EquipmentContentDto } from "../interfaces/equipment-content.dto";

@Component({
  selector: "app-equipment-content-list-mobile",
  templateUrl: "./equipment-content-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataViewMobile, AppIcon],
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
