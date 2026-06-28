import { HttpClient } from "@angular/common/http";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ImageModule } from "primeng/image";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { firstValueFrom } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { ITaskMessageDTO, ITaskResultDTO } from "../models/task-message.dto";

interface ITaskAreaGroup {
  title: string;
  tasks: ITaskMessageDTO[];
}

@Component({
  selector: "app-task-pending-board",
  templateUrl: "./task-pending-board.html",
  imports: [ButtonModule, ImageModule, TagModule, AppIcon],
})
export class TaskPendingBoard implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiS = inject(ApiResponseService);
  private readonly http = inject(HttpClient);
  private readonly htmlPrintS = inject(HtmlPrintService);

  readonly ticketGroupId: string = this.route.snapshot.params["ticketGroupId"];
  readonly nameGroup = signal("");
  readonly loading = signal(true);
  readonly exportingPdf = signal(false);

  private readonly allItems = signal<ITaskMessageDTO[]>([]);

  readonly groupedTasks = computed<ITaskAreaGroup[]>(() => {
    const map = new Map<string, ITaskMessageDTO[]>();
    for (const item of this.allItems()) {
      const key = item.title?.trim() || "Sin area";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).map(([title, tasks]) => ({
      title,
      tasks,
    }));
  });

  readonly totalTasks = computed(() => this.allItems().length);

  async ngOnInit(): Promise<void> {
    const result = await this.apiS.onGetList<ITaskResultDTO>(
      Endpoints.Tasks.list(this.ticketGroupId, "0"),
      { page: 1, recordsNumber: 500, filter: "", sortField: "", sortOrder: 1 },
    );
    if (result) {
      this.nameGroup.set(result.nameGroup ?? "");
      this.allItems.set(result.items ?? []);
    }
    this.loading.set(false);
  }

  onBack(): void {
    this.router.navigate(["/tickets/messages", this.ticketGroupId]);
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      InProgress: "En Proceso",
      NotStarted: "No Iniciado",
      Reopened: "Reabierto",
      Completed: "Terminado",
    };
    return map[status] ?? status;
  }

  statusSeverity(
    status: string,
  ): "success" | "info" | "warn" | "danger" | "secondary" {
    switch (status) {
      case "InProgress":
        return "warn";
      case "NotStarted":
        return "danger";
      case "Reopened":
        return "danger";
      case "Completed":
        return "success";
      default:
        return "secondary";
    }
  }

  formatIndex(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  async exportPdf(): Promise<void> {
    this.exportingPdf.set(true);
    try {
      const groups = this.groupedTasks();
      const today = new Date();

      const imageMap = new Map<string, string>();
      await Promise.all(
        groups
          .flatMap((g) => g.tasks)
          .map((t) => t.beforeWork)
          .filter((url): url is string => !!url)
          .map(async (url) => {
            try {
              const blob = await firstValueFrom(
                this.http.get(url, { responseType: "blob" }),
              );
              imageMap.set(url, await this.blobToBase64(blob));
            } catch {
              // skip images that fail to load
            }
          }),
      );

      let groupsHtml = "";
      for (const group of groups) {
        groupsHtml += `
          <div style="font-size: 16px; font-weight: bold; color: #0d3b66; margin-top: 20px; margin-bottom: 10px;">
            ${this.htmlPrintS.esc(group.title)}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        `;

        for (const task of group.tasks) {
          groupsHtml += this.buildTaskCellHtml(task, imageMap);
        }

        groupsHtml += `</div>`;
      }

      const logo = await this.htmlPrintS.getLogoDataUrl();
      const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { margin: 10mm; }
  .container { max-width: 1000px; margin: auto; }
  .task-card { width: calc(50% - 8px); box-sizing: border-box; border: 1px solid #EEEEEE; padding: 10px; border-radius: 6px; margin-bottom: 10px; break-inside: avoid; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, this.nameGroup(), `Total: ${this.totalTasks()} tareas | Áreas: ${groups.length}`, today, "TABLERO DE PENDIENTES")}

  <div class="body-doc">
    ${groupsHtml}
  </div>

  ${this.htmlPrintS.buildStandardFooter(today)}
</div>
</body></html>`;

      const slug = this.nameGroup().replace(/\s+/g, "-").toLowerCase();
      this.htmlPrintS.printHtml(html, `tablero-pendientes-${slug}`);
    } finally {
      this.exportingPdf.set(false);
    }
  }

  private buildTaskCellHtml(
    task: ITaskMessageDTO,
    imageMap: Map<string, string>,
  ): string {
    const statusColor = this.statusColor(task.status);
    const statusLabel = this.statusLabel(task.status);
    const imgData = task.beforeWork ? imageMap.get(task.beforeWork) : null;

    let html = `
      <div class="task-card">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <div style="font-size: 10px; font-weight: bold; color: #6b7280;">${this.htmlPrintS.esc(task.folio)}</div>
          <div style="font-size: 10px; font-weight: bold; color: ${statusColor};">${this.htmlPrintS.esc(statusLabel)}</div>
        </div>
    `;

    if (task.assignee) {
      html += `<div style="font-size: 12px; color: #4b5563; margin-bottom: 2px;">${this.htmlPrintS.esc(task.assignee)}</div>`;
    }
    if (task.scheduledAt) {
      html += `<div style="font-size: 12px; color: #4b5563; margin-bottom: 5px;">${this.htmlPrintS.esc(task.scheduledAt)}</div>`;
    }
    if (task.description) {
      html += `<div style="font-size: 13px; margin-bottom: 10px;">${this.htmlPrintS.esc(task.description)}</div>`;
    }
    if (imgData) {
      html += `<div style="text-align: center;"><img src="${imgData}" style="max-width: 100%; max-height: 200px; object-fit: contain; border-radius: 4px;" /></div>`;
    }

    html += `</div>`;
    return html;
  }

  private statusColor(status: string): string {
    switch (status) {
      case "InProgress":
        return "#d97706";
      case "NotStarted":
        return "#dc2626";
      case "Reopened":
        return "#dc2626";
      case "Completed":
        return "#16a34a";
      default:
        return "#6b7280";
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Could not get canvas context");
        // Fondo blanco para evitar problemas con imágenes transparentes (como PNG)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject("Error loading image from blob");
      };
      img.src = url;
    });
  }
}
