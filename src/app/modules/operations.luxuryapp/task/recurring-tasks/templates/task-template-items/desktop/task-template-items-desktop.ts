import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { TaskTemplateItem } from "@core/interfaces/recurring-tasks/task-template-item.interface";
import { TaskTemplate } from "@core/interfaces/recurring-tasks/task-template.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { StatusBadge } from "@ui/web/status-badge/status-badge";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppReorderableRow,
  AppReorderableRowHandle,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-task-template-items-desktop",
  templateUrl: "./task-template-items-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    LuxTableCaption,
    TableFooter,
    StatusBadge,
    AppTable,
    AppReorderableRow,
    AppReorderableRowHandle,
    AppIcon,
  ],
})
export class TaskTemplateItemsDesktop {
  items = input.required<TaskTemplateItem[]>();
  template = input.required<TaskTemplate>();

  add = output<void>();
  edit = output<TaskTemplateItem>();
  delete = output<string>();
  rowReorder = output<{ dragIndex: number; dropIndex: number }>();

  private tableScrollHeightS = inject(TableScrollHeightService);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  getPriorityDisplay(priority: number): { text: string; severity: string } {
    switch (priority) {
      case 0:
        return { text: "Alta", severity: "danger" };
      case 1:
        return { text: "Baja", severity: "info" };
      default:
        return { text: "Desconocida", severity: "secondary" };
    }
  }

  formatRecurrenceRule(rruleString: string): string {
    if (!rruleString) return "No definida";

    const parts = rruleString.split(";");
    const rrule: { [key: string]: string } = {};
    parts.forEach((part) => {
      const [key, value] = part.split("=");
      rrule[key] = value;
    });

    let humanReadable = "";

    const freq = rrule["FREQ"];
    const interval = rrule["INTERVAL"] ? parseInt(rrule["INTERVAL"], 10) : 1;

    switch (freq) {
      case "DAILY":
        humanReadable += `Cada ${interval} día${interval > 1 ? "s" : ""}`;
        break;
      case "WEEKLY":
        humanReadable += `Cada ${interval} semana${interval > 1 ? "s" : ""}`;
        if (rrule["BYDAY"]) {
          const days = rrule["BYDAY"]
            .split(",")
            .map((day) => this.getDayName(day));
          humanReadable += ` (${days.join(", ")})`;
        }
        break;
      case "MONTHLY":
        humanReadable += `Cada ${interval} mes${interval > 1 ? "es" : ""}`;
        if (rrule["BYMONTHDAY"]) {
          humanReadable += ` el día ${rrule["BYMONTHDAY"]}`;
        } else if (rrule["BYDAY"]) {
          const byday = rrule["BYDAY"];
          const position = byday.match(/^(-?\d+)/)?.[1];
          const day = byday.match(/([A-Z]{2})$/)?.[1];
          if (position && day) {
            const posText = this.getPositionText(position);
            humanReadable += ` el ${posText} ${this.getDayName(day)}`;
          }
        }
        break;
      case "YEARLY":
        humanReadable += `Cada ${interval} Año${interval > 1 ? "s" : ""}`;
        if (rrule["BYMONTH"] && rrule["BYMONTHDAY"]) {
          const month = parseInt(rrule["BYMONTH"], 10);
          humanReadable += ` el ${rrule["BYMONTHDAY"]} de ${this.getMonthName(
            month,
          )}`;
        }
        break;
      default:
        humanReadable = rruleString;
        break;
    }

    return humanReadable;
  }

  private getDayName(day: string): string {
    switch (day) {
      case "MO":
        return "Lunes";
      case "TU":
        return "Martes";
      case "WE":
        return "Miórcoles";
      case "TH":
        return "Jueves";
      case "FR":
        return "Viernes";
      case "SA":
        return "Síbado";
      case "SU":
        return "Domingo";
      default:
        return day;
    }
  }

  private getPositionText(position: string): string {
    switch (position) {
      case "1":
        return "primer";
      case "2":
        return "segundo";
      case "3":
        return "tercer";
      case "4":
        return "cuarto";
      case "-1":
        return "último";
      default:
        return position;
    }
  }

  private getMonthName(month: number): string {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return monthNames[month - 1] || month.toString();
  }
}
