import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { TaskTemplateItem } from "@core/interfaces/recurring-tasks/task-template-item.interface";
import { TaskTemplate } from "@core/interfaces/recurring-tasks/task-template.interface";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { TaskTemplateItemForm } from "../task-template-item-form/task-template-item-form";
import { TaskTemplateItemsDesktop } from "./desktop/task-template-items-desktop";
import { TaskTemplateItemsMobile } from "./mobile/task-template-items-mobile";

@Component({
  selector: "app-task-template-items",
  templateUrl: "./task-template-items.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TaskTemplateItemsDesktop, TaskTemplateItemsMobile],
})
export class TaskTemplateItems implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);
  templateInfo = signal<TaskTemplate | null>(null);
  items = signal<TaskTemplateItem[]>([]);
  templateId: string = "";

  ngOnInit(): void {
    this.templateId = this.route.snapshot.paramMap.get("id")!;
    if (this.templateId) {
      this.loadTemplateInfo();
      this.loadItems();
    }
  }

  loadTemplateInfo() {
    this.apiResponseS
      .onGetItem<TaskTemplate>(
        Endpoints.RecurringTasks.Templates.getById(this.templateId),
      )
      .then((response) => this.templateInfo.set(response));
  }

  loadItems() {
    this.apiResponseS
      .onGetList<TaskTemplateItem[]>(
        Endpoints.RecurringTasks.Templates.itemsByTemplate(this.templateId),
      )
      .then((response) => this.items.set(response || []));
  }

  async onDeleteItem(itemId: string) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este item?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.RecurringTasks.Templates.itemById(itemId))
      .then((result: boolean) => {
        if (result) {
          this.loadItems();
        }
      });
  }

  showItemForm(item?: TaskTemplateItem) {
    this.dialogHandlerS
      .openDialog(
        TaskTemplateItemForm,
        { templateId: this.templateId, item },
        item ? "Editar Item" : "Nuevo Item",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.loadItems();
      });
  }

  onRowReorder(event: { dragIndex: number; dropIndex: number }) {
    const reordered = [...this.items()];
    const [moved] = reordered.splice(event.dragIndex, 1);
    if (!moved) return;
    reordered.splice(event.dropIndex, 0, moved);
    this.items.set(reordered);
    const itemIdsInOrder = reordered.map((item) => item.id);
    this.apiResponseS
      .onPut(Endpoints.RecurringTasks.Templates.reorderItems(this.templateId), {
        itemIdsInOrder,
      })
      .then((result) => {
        if (result) {
        }
      });
  }

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
      "Diciembre"];
    return monthNames[month - 1] || month.toString();
  }
}
