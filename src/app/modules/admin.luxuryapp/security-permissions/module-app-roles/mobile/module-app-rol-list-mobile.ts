import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ModuleAppRolDto } from "../interfaces/module-app-rol.dto";

@Component({
  selector: "app-module-app-rol-list-mobile",
  templateUrl: "./module-app-rol-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LxIcon, MobileListItem, DataViewMobile],
})
export class ModuleAppRolListMobile {
  data = input.required<ModuleAppRolDto[]>();
  groupedData = input<Record<string, ModuleAppRolDto[]>>({});

  select = output<{ roleId: any; roleName: string; title: string }>();
}
