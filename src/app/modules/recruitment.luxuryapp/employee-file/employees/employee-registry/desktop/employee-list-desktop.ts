import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { Department } from "@core/enums/department.enum";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconActiveDesactive } from "@ui/buttons/web-icon/button-active-desactive";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { IEmployee } from "../interfaces/employee.interface";

@Component({
  selector: "app-employee-list-desktop",
  templateUrl: "./employee-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LxTag,
    LxAvatar,
    WebButtonIconActiveDesactive,
    WebButtonIconItem,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
  ],
})
export class EmployeeListDesktop {
  data = input.required<IEmployee[]>();
  globalFilterFields = input<string[]>([]);
  isAdmin = input<boolean>(false);
  activo = input<boolean>(true);

  add = output<void>();
  stateChange = output<boolean>();
  cardEmployee = output<string>();
  editEmpleado = output<{ employeeId: string; applicationUserId: string }>();

  readonly departamentLabels: Record<number, string> = {
    [Department.Administracion]: "Administración",
    [Department.Legal]: "Legal",
    [Department.Contabilidad]: "Contabilidad",
    [Department.Mantenimiento]: "Mantenimiento",
    [Department.Limpieza]: "Limpieza",
    [Department.Operaciones]: "Operaciones",
    [Department.Jardineria]: "Jardinería",
    [Department.Sistemas]: "Sistemas",
    [Department.Seguridad]: "Seguridad",
    [Department.Constructora]: "Constructora",
    [Department.Supervision]: "Supervisión",
    [Department.Direcciones]: "Dirección",
    [Department.RecursosHumanos]: "Recursos Humanos",
    [Department.Reclutamiento]: "Reclutamiento",
    [Department.Recepcion]: "Recepción",
    [Department.Mensajeria]: "Mensajería",
    [Department.Ludoteca]: "Ludoteca",
    [Department.NA]: "Sin Departamento",
  };

  getDepartamentLabel(value: number | null | undefined): string {
    if (value === null || value === undefined) return "Sin Departamento";
    return this.departamentLabels[value] ?? "Sin Departamento";
  }
}
