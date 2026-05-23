import { HttpClient } from "@angular/common/http";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Content } from "pdfmake/interfaces";
import { ButtonModule } from "primeng/button";
import { ImageModule } from "primeng/image";
import { TagModule } from "primeng/tag";
import { firstValueFrom } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
import { ITaskMessageDTO, ITaskResultDTO } from "../models/task-message.dto";

interface ITaskAreaGroup {
  title: string;
  tasks: ITaskMessageDTO[];
}

@Component({
  selector: "app-task-pending-board",
  templateUrl: "./task-pending-board.html",
  imports: [ButtonModule, ImageModule, TagModule],
})
export class TaskPendingBoard implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiS = inject(ApiResponseService);
  private readonly http = inject(HttpClient);
  private readonly pdfS = inject(PdfGeneratorService);

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
      const today = new Date().toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

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

      const content: Content[] = [
        {
          text: this.nameGroup(),
          fontSize: 20,
          bold: true,
          color: "#0d3b66",
          margin: [0, 0, 0, 4],
        },
        {
          text: `Tablero de Pendientes - ${today}`,
          fontSize: 11,
          color: "#6b7280",
          margin: [0, 0, 0, 4],
        },
        {
          text: `Total: ${this.totalTasks()} tareas  |  Areas: ${groups.length}`,
          fontSize: 10,
          color: "#6b7280",
          margin: [0, 0, 0, 12],
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1.5,
              lineColor: "#c9a84c",
            },
          ],
          margin: [0, 0, 0, 16],
        },
      ];

      for (const group of groups) {
        content.push({
          text: group.title,
          fontSize: 13,
          bold: true,
          color: "#0d3b66",
          margin: [0, 4, 0, 8],
        });

        for (let i = 0; i < group.tasks.length; i += 2) {
          const pair = group.tasks.slice(i, i + 2);
          const cols = pair.map((task) => this.buildTaskCell(task, imageMap));
          while (cols.length < 2) cols.push({ text: "" });
          content.push({ columns: cols, columnGap: 8, margin: [0, 0, 0, 8] });
        }

        content.push({ text: "", margin: [0, 8, 0, 0] });
      }

      const slug = this.nameGroup().replace(/\s+/g, "-").toLowerCase();
      await this.pdfS.generatePdf({ content }, `tablero-pendientes-${slug}`, {
        clientName: "Tablero de Pendientes",
      });
    } finally {
      this.exportingPdf.set(false);
    }
  }

  private buildTaskCell(
    task: ITaskMessageDTO,
    imageMap: Map<string, string>,
  ): any {
    const stack: Content[] = [
      {
        columns: [
          {
            text: task.folio,
            fontSize: 8,
            bold: true,
            color: "#6b7280",
            width: "*",
          },
          {
            text: this.statusLabel(task.status),
            fontSize: 8,
            bold: true,
            color: this.statusColor(task.status),
            alignment: "right",
            width: "auto",
          },
        ],
        margin: [0, 0, 0, 4],
      } as Content,
    ];

    if (task.assignee) {
      stack.push({
        text: task.assignee,
        fontSize: 9,
        color: "#4b5563",
        margin: [0, 0, 0, 2],
      });
    }
    if (task.scheduledAt) {
      stack.push({
        text: task.scheduledAt,
        fontSize: 9,
        color: "#4b5563",
        margin: [0, 0, 0, 4],
      });
    }
    if (task.description) {
      stack.push({
        text: task.description,
        fontSize: 10,
        margin: [0, 0, 0, 6],
      });
    }
    const imgData = task.beforeWork ? imageMap.get(task.beforeWork) : null;
    if (imgData) {
      stack.push({ image: imgData, width: 220, margin: [0, 4, 0, 0] });
    }

    return { stack, margin: [4, 4, 4, 4] };
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
