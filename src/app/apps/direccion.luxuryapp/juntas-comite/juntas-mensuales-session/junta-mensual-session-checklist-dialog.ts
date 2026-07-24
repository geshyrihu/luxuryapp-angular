import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

interface IChecklistItem {
  id: string;
  asambleaPlanId: string;
  juntaMensualSessionId: string;
  templateCode: string;
  templateVersion: number;
  title: string;
  category: string;
  description: string;
  dueDate: string;
  responsibleRole: string;
  responsibleUserId: string;
  status: number;
  statusDisplayName: string;
  completedAt: string | null;
  evidenceNotes: string;
  isManual: boolean;
}

interface IJuntaMensualSessionDetail {
  id: string;
  scheduledAt: string;
  scheduledEndAt: string;
  sessionTitle: string;
  sessionTypeDisplayName: string;
  location: string;
  assembly?: {
    requiresPaddles: boolean;
    paddlesQuantity: number | null;
    requiresAudioVisual: boolean;
    audioVisualNotes: string;
    operationalNotes: string;
    specialInstructions: string;
  } | null;
}

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-junta-mensual-session-checklist-dialog",
  templateUrl: "./junta-mensual-session-checklist-dialog.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    CommonModule,
    FormsModule,
    TableModule,
    CustomInputSelectSignal,
    WebButtonLabel,
    LxTag,
    DatePipe,
  ],
})
export class JuntaMensualSessionChecklistDialog {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly sessionId = this.config.data.sessionId as string;
  readonly loading = signal(false);
  readonly items = signal<IChecklistItem[]>([]);
  readonly sessionDetail = signal<IJuntaMensualSessionDetail | null>(null);
  readonly groupedItems = computed(() => {
    const map = new Map<string, IChecklistItem[]>();

    for (const item of this.items()) {
      const key = item.responsibleRole || "Sin asignar";
      const current = map.get(key) ?? [];
      current.push(item);
      map.set(key, current);
    }

    return Array.from(map.entries())
      .map(([responsibleRole, items]) => ({
        responsibleRole,
        items: [...items].sort((a, b) => {
          const dueA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const dueB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return dueA - dueB || a.title.localeCompare(b.title);
        }),
      }))
      .sort((a, b) => a.responsibleRole.localeCompare(b.responsibleRole));
  });
  readonly statusOptions = [
    { label: "Pendiente", value: 0 },
    { label: "En progreso", value: 1 },
    { label: "Completado", value: 2 },
    { label: "Cancelado", value: 3 },
    { label: "No aplica", value: 4 },
  ];

  constructor() {
    this.onLoadData();
  }

  async onLoadData() {
    this.loading.set(true);
    try {
      const result = await this.apiResponseS.onGetList<IChecklistItem[]>(
        Endpoints.AsambleaChecklist.bySession(this.sessionId),
      );
      const sessionDetail =
        await this.apiResponseS.onGetItem<IJuntaMensualSessionDetail>(
          Endpoints.JuntaMensualSession.detail(this.sessionId),
        );

      this.sessionDetail.set(sessionDetail ?? null);
      this.items.set(result ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  async onSaveRow(item: IChecklistItem) {
    const result = await this.apiResponseS.onPut<IChecklistItem>(
      Endpoints.AsambleaChecklist.updateStatus(item.id),
      {
        status: item.status,
        evidenceNotes: item.evidenceNotes ?? "",
      },
    );

    if (!result) {
      return;
    }

    item.status = result.status;
    item.statusDisplayName = result.statusDisplayName;
    item.completedAt = result.completedAt;
    item.evidenceNotes = result.evidenceNotes;
    this.items.set([...this.items()]);
  }

  onClose() {
    this.ref.close(true);
  }

  getSeverity(status: number) {
    switch (status) {
      case 2:
        return "success";
      case 1:
        return "info";
      case 3:
        return "danger";
      case 4:
        return "contrast";
      default:
        return "warn";
    }
  }

  formatAssemblyDate() {
    const scheduledAt = this.sessionDetail()?.scheduledAt;
    if (!scheduledAt) return "";

    const parsed = new Date(scheduledAt);
    if (Number.isNaN(parsed.getTime())) return scheduledAt;

    return parsed.toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
}
