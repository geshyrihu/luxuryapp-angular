import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { Department } from "@core/enums/department.enum";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { LxIcon } from "@ui/adaptive/icon/icon";
import {
  SegmentItem,
  SegmentedControl,
} from "@ui/primitives/segmented-control/segmented-control";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { IWorkPosition } from "../interfaces/work-position.model";
import { ButtonWeb } from "@ui/buttons/web";

@Component({
  selector: "app-work-position-list-desktop",
  templateUrl: "./work-position-list-desktop.html",
  styleUrl: "../work-position-list.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    AppAvatar,
    LuxTableCaption,
    LxTag,
    LxIcon,
    SegmentedControl,
  ],
})
export class WorkPositionListDesktop {
  data = input.required<IWorkPosition[]>();
  globalFilterFields = input<string[]>([]);
  departmentFilterItems = input<SegmentItem[]>([]);
  selectedDepartment = input<number | null>(null);
  statusFilter = input<"Activo" | "Inactivo">("Activo");
  showSalaryColumn = input<boolean>(false);
  scrollHeight = input<string>("0px");
  departamentLabels = input<Record<number, string>>({});

  statusFilterChange = output<"Activo" | "Inactivo">();
  departmentChange = output<number | null>();
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
