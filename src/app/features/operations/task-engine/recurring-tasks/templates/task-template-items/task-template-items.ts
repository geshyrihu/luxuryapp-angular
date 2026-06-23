import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import {
  CustomButtonDelete,
  CustomButtonEdit,
} from "src/app/core/components/buttons/web";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { StatusBadge } from "src/app/core/components/status-badge/status-badge";
import { TaskTemplateItem } from "src/app/core/models/recurring-tasks/task-template-item.model";
import { TaskTemplate } from "src/app/core/models/recurring-tasks/task-template.model";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { TaskTemplateItemForm } from "../task-template-item-form/task-template-item-form";
@Component({
  selector: "app-task-template-items",
  templateUrl: "./task-template-items.html",
  imports: [
    ActionMenu,
    CustomButtonDelete,
    CustomButtonEdit,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    StatusBadge,
    TableModule,
    IonItem,
    IonLabel,
    CustomButtonDelete,
    CustomButtonEdit,
  ],
})
export class TaskTemplateItems implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  templateInfo = signal<TaskTemplate | null>(null);
  items = signal<TaskTemplateItem[]>([]);
  templateId: string = "";
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.templateId = this.route.snapshot.paramMap.get("id")!;
    if (this.templateId) {
      this.loadTemplateInfo();
      this.loadItems();
    }
  }

  loadTemplateInfo() {
    this.apiResponseS
      .onGetItem<TaskTemplate>(`recurring-tasks/templates/${this.templateId}`)
      .then((response) => this.templateInfo.set(response));
  }

  loadItems() {
    this.apiResponseS
      .onGetList<
        TaskTemplateItem[]
      >(`recurring-tasks/templates/${this.templateId}/items`)
      .then((response) => this.items.set(response || []));
  }

  onDeleteItem(itemId: string) {
    this.apiResponseS
      .onDelete(`recurring-tasks/templates/items/${itemId}`)
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
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.loadItems();
      });
  }

  // New method for reordering
  onRowReorder(event: any) {
    // PrimeNG p-table automatically updates the value array on reorder
    // The 'items' signal already holds the reordered array
    const itemIdsInOrder = this.items().map((item) => item.id);
    this.apiResponseS
      .onPut(`recurring-tasks/templates/${this.templateId}/items/reorder`, {
        itemIdsInOrder,
      })
      .then((result) => {
        if (result) {
          // Success toast handled by ApiResponseService
        }
      });
  }

  getPriorityDisplay(priority: number): { text: string; severity: string } {
    switch (priority) {
      case 0: // EPriorityLevel.High
        return { text: "Alta", severity: "danger" };
      case 1: // EPriorityLevel.Low
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

    // Base frequency
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
          // e.g., "BYDAY=1MO" (first Monday) or "-1FR" (last Friday)
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
        humanReadable = rruleString; // Fallback to raw string
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
        return "Sábado";
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
        return "óltimo";
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
