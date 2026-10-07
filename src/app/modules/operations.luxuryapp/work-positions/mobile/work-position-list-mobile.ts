import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

import { ButtonMobile } from "@ui/buttons/mobile";
import { IWorkPosition } from "../interfaces/work-position.model";

@Component({
  selector: "app-work-position-list-mobile",
  templateUrl: "./work-position-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    LuxDataViewMobile,
    LxTag,
    MobileListItem,
  ],
})
export class WorkPositionListMobile {
  data = input.required<IWorkPosition[]>();
  globalFilterFields = input<string[]>([]);
  departamentLabels = input<Record<number, string>>({});

  details = output<IWorkPosition>();
  administerEmployee = output<{ employeeId: string; userId: string }>();
  cardEmployee = output<string>();
  requestDelete = output<IWorkPosition>();

  isVacant(item: IWorkPosition): boolean {
    return !item.applicationUserId;
  }

  necesitaActualizacion(item: IWorkPosition): boolean {
    return !item.applicationRoleName || item.applicationRoleName === "Asignar";
  }

  getDepartamentLabel(value: number | null | undefined): string {
    if (value === null || value === undefined) return "Sin Departamento";
    return this.departamentLabels()[value] ?? "Sin Departamento";
  }
}
