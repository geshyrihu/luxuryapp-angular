import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { TaskTemplateItem } from "@core/interfaces/recurring-tasks/task-template-item.interface";
import { ButtonMobile } from "@ui/buttons/mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { StatusBadge } from "@ui/web/status-badge/status-badge";

@Component({
  selector: "app-task-template-items-mobile",
  templateUrl: "./task-template-items-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    MobileActionMenu,
    DataViewMobile,
    StatusBadge,
    MobileListItem,
    LxIcon,
  ],
})
export class TaskTemplateItemsMobile {
  items = input.required<TaskTemplateItem[]>();

  add = output<void>();
  edit = output<TaskTemplateItem>();
  delete = output<string>();

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
