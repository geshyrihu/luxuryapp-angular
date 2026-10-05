import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-catalogo-revisiones-inspeccion-mobile",
  templateUrl: "./catalogo-revisiones-inspeccion-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    MobileListItem,
    MobileActionMenu,
    ButtonMobile,
    MobileButtonLabelDelete,
    DataViewMobile,
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
