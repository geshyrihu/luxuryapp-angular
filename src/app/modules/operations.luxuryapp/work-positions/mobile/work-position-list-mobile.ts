import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { IWorkPosition } from "../interfaces/work-position.model";

@Component({
  selector: "app-work-position-list-mobile",
  templateUrl: "./work-position-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MobileActionMenu,
    MobileButtonLabelItem,
    DataViewMobile,
    LxTag,
    MobileListItem,
    AppAvatar,
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
