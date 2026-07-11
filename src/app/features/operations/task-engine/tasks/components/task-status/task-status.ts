import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { addIcons } from "ionicons";
import {
  checkmarkCircleOutline,
  folderOpenOutline,
  refreshOutline,
  settingsOutline,
} from "ionicons/icons";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TaskGroupService } from "../../task.service";
@Component({
  selector: "app-task-status",
  templateUrl: "./task-status.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, WebButtonLabel],
})
export class TaskStatus implements OnInit {
  TaskGroupService = inject(TaskGroupService);
  apiResponseS = inject(ApiResponseService);
  enumSelectS = inject(EnumSelectService);
  breakpointObserver = inject(BreakpointObserver); // Inyectar BreakpointObserver

  cb_status: any[] = []; // Lista de estados

  status: string = this.TaskGroupService.taskGroupMessageStatus || "NotStarted";
  statusChange = output<string>();

  isMobile: boolean = false; // Propiedad para detectar mívil

  constructor() {
    addIcons({
      folderOpenOutline,
      settingsOutline,
      checkmarkCircleOutline,
      refreshOutline,
    });
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  ngOnInit() {
    this.cb_status = [
      { value: "NotStarted", label: "Abierto", icon: "mdi:folder-open" },
      { value: "InProgress", label: "En Proceso", icon: "mdi:sync" },
      { value: "Completed", label: "Completado", icon: "mdi:check-circle" },
      { value: "Reopened", label: "Reabierto", icon: "mdi:refresh" },
    ];
  }

  onStatusChange(value: any) {
    this.TaskGroupService.setStatus(value);
    this.status = value;
    this.statusChange.emit(this.status);
  }

  getIconForStatus(value: string): string {
    const map: Record<string, string> = {
      NotStarted: "mdi:folder-open",
      InProgress: "mdi:sync",
      Completed: "mdi:check-circle",
      Reopened: "mdi:refresh",
    };
    return map[value] || "mdi:circle";
  }

  getSeverityForStatus(value: string): "danger" | "warn" | "success" | "info" {
    const map: Record<string, "danger" | "warn" | "success" | "info"> = {
      NotStarted: "danger",
      InProgress: "warn",
      Completed: "success",
      Reopened: "info",
    };
    return map[value] ?? "info";
  }
}
