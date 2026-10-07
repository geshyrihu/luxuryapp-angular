import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-catalogo-revisiones-inspeccion-mobile",
  templateUrl: "./catalogo-revisiones-inspeccion-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    LuxDataViewMobile,
  ],
})
export class CatalogoRevisionesInspeccionMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  departments = input<SelectItemDto[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();

  getDepartamentLabel(value: number): string {
    return (
      this.departments().find((x) => x.value === value)?.label ??
      "Sin departamento"
    );
  }
}
