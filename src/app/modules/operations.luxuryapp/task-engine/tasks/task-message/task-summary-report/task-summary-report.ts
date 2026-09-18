import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { HtmlPrintService } from "@core/services/html-print.service";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { ITaskMessageDTO, ITaskResultDTO } from "../interfaces/task-message.dto";

interface SummaryRow {
  index: number;
  title: string;
  description: string;
  executionDate: string;
  lastFollowUp: string;
}

interface SummaryGroup {
  key: string;
  label: string;
  background: string;
  color: string;
  rows: SummaryRow[];
}

const PENDING_STATUSES = ["NotStarted", "Reopened"];
const PAGE_SIZE = 200;
const MAX_PAGES = 10;

@Component({
  selector: "app-task-summary-report",
  templateUrl: "./task-summary-report.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputDateSignal,
    WebButtonLabel,
    AppIcon,
    AppSpinner,
  ],
  styles: [
    `
      .summary-screen-table {
        font-size: 0.95rem;
      }
      .summary-screen-table thead th {
        font-size: 0.8rem;
      }
      .summary-screen-table td .cell-sub {
        font-size: 0.85rem;
      }
    `,
  ],
})
export class TaskSummaryReport implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly htmlPrintS = inject(HtmlPrintService);

  readonly ticketGroupId: string = this.config.data?.ticketGroupId ?? "";
  readonly groupName: string = this.config.data?.groupName ?? "";

  readonly loading = signal(false);
  readonly exportingPdf = signal(false);
  readonly truncated = signal(false);

  private readonly items = signal<ITaskMessageDTO[]>([]);

  readonly fromControl = new FormControl<Date | string | null>(null);
  readonly toControl = new FormControl<Date | string | null>(null);

  private readonly fromValue = toSignal(this.fromControl.valueChanges, {
    initialValue: null as Date | string | null,
  });
  private readonly toValue = toSignal(this.toControl.valueChanges, {
    initialValue: null as Date | string | null,
  });

  readonly groups = computed<SummaryGroup[]>(() => {
    const from = this.toDate(this.fromValue());
    const to = this.toDate(this.toValue());
    const inRange = this.items().filter((item) =>
      this.matchesRange(item, from, to),
    );

    const candidates: SummaryGroup[] = [
      {
        key: "pending",
        label: "Pendientes",
        background: "#fde68a",
        color: "#7c4a03",
        rows: this.toRows(
          inRange.filter((item) => PENDING_STATUSES.includes(item.status)),
        ),
      },
      {
        key: "inProgress",
        label: "En proceso",
        background: "#fed7aa",
        color: "#9a3412",
        rows: this.toRows(
          inRange.filter((item) => item.status === "InProgress"),
        ),
      },
      {
        key: "completed",
        label: "Concluidos",
        background: "#a7f3d0",
        color: "#065f46",
        rows: this.toRows(
          inRange.filter((item) => item.status === "Completed"),
        ),
      },
    ];

    return candidates.filter((group) => group.rows.length > 0);
  });

  readonly total = computed(() =>
    this.groups().reduce((acc, group) => acc + group.rows.length, 0),
  );

  async ngOnInit(): Promise<void> {
    await this.loadAll();
  }

  async loadAll(): Promise<void> {
    this.loading.set(true);
    try {
      const [open, completed] = await Promise.all([
        this.fetchAll("NotStarted"),
        this.fetchAll("Completed"),
      ]);
      this.items.set([...open, ...completed]);
    } finally {
      this.loading.set(false);
    }
  }

  private async fetchAll(status: string): Promise<ITaskMessageDTO[]> {
    const result: ITaskMessageDTO[] = [];
    let page = 1;
    let total = 0;

    do {
      const response = await this.apiResponseS.onGetList<ITaskResultDTO>(
        Endpoints.Tasks.list(this.ticketGroupId, status),
        { page, recordsNumber: PAGE_SIZE, filter: "" },
      );
      if (!response) break;

      result.push(...(response.items ?? []));
      total = response.totalRecords ?? result.length;
      page += 1;
    } while (result.length < total && page <= MAX_PAGES);

    if (result.length < total) this.truncated.set(true);
    return result;
  }

  private toRows(items: ITaskMessageDTO[]): SummaryRow[] {
    return items.map((item, position) => ({
      index: position + 1,
      title: item.title ?? "",
      description: item.description ?? "",
      executionDate:
        item.status === "Completed" ? "—" : (item.scheduledAt ?? "—"),
      lastFollowUp: item.lastFollowUp
        ? `${item.lastFollowUpDate ?? ""} · ${item.lastFollowUp}`.trim()
        : "—",
    }));
  }

  private toDate(value: Date | string | null | undefined): Date | null {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  private matchesRange(
    item: ITaskMessageDTO,
    from: Date | null,
    to: Date | null,
  ): boolean {
    if (!from && !to) return true;

    const created = this.toDate(item.createdAtFilter as Date | string | null);
    if (!created) return false;

    if (from) {
      const start = new Date(from);
      start.setHours(0, 0, 0, 0);
      if (created < start) return false;
    }
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      if (created > end) return false;
    }
    return true;
  }

  /**
   * Exporta el reporte a PDF con la técnica oficial del repo:
   * `HtmlPrintService.printHtml()` imprime un `<iframe>` aislado con el
   * encabezado y pie estándar (logo del cliente incluido). Mismo patrón
   * que `task-pending-board.exportPdf()`.
   */
  async exportPdf(): Promise<void> {
    if (this.total() === 0) return;

    this.exportingPdf.set(true);
    try {
      const logo = await this.htmlPrintS.getLogoDataUrl();
      const generatedAt = new Date();

      const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
<title>${this.htmlPrintS.esc(this.groupName || "Resumen de tareas")}</title>
${this.htmlPrintS.getStandardCss()}
<style>
  .group-title { margin: 20px 0 0; padding: 9px 14px; font-size: 1.05rem; font-weight: 700; border-radius: 6px 6px 0 0; }
  .group-title:first-child { margin-top: 0; }
  .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  .summary-table th, .summary-table td { border: 1px solid #D1D5DB; padding: 9px 10px; font-size: 0.95rem; text-align: left; vertical-align: top; }
  .summary-table th { background: #E8EEF8; font-weight: 700; color: #111827; font-size: 0.85rem; text-transform: uppercase; letter-spacing: .03em; }
  .summary-table tbody tr:nth-child(even) { background: #FAFAFA; }
  .cell-sub { font-size: 0.85rem; color: #4B5563; margin-top: 3px; }
  .col-num { width: 52px; text-align: center; }
  .col-date { width: 150px; }
  .col-follow { width: 260px; }
  @media print {
    .group-title { break-after: avoid; page-break-after: avoid; }
    .summary-table tr { break-inside: avoid; page-break-inside: avoid; }
  }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(
    logo,
    this.groupName || "Resumen de tareas",
    `Total: ${this.total()} tarea(s)`,
    generatedAt,
    "RESUMEN DE TAREAS",
    this.buildMetaLine(),
  )}
  <div class="body-doc">${this.buildSectionsHtml()}</div>
  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;

      const slug = (this.groupName || "resumen")
        .toLowerCase()
        .replace(/\s+/g, "-");
      this.htmlPrintS.printHtml(html, `resumen-tareas-${slug}`);
    } finally {
      this.exportingPdf.set(false);
    }
  }

  private buildSectionsHtml(): string {
    return this.groups()
      .map(
        (group) => `
    <div class="group-title" style="background:${group.background};color:${group.color}">
      ${this.htmlPrintS.esc(group.label)} (${group.rows.length})
    </div>
    <table class="summary-table">
      <thead>
        <tr>
          <th class="col-num">N°</th>
          <th>Descripción</th>
          <th class="col-date">Fecha de ejecución</th>
          <th class="col-follow">Último seguimiento</th>
        </tr>
      </thead>
      <tbody>
        ${group.rows
          .map(
            (row) => `
        <tr>
          <td class="col-num">${row.index}</td>
          <td>
            <strong>${this.htmlPrintS.esc(row.title)}</strong>
            ${
              row.description
                ? `<div class="cell-sub">${this.htmlPrintS.esc(row.description)}</div>`
                : ""
            }
          </td>
          <td>${this.htmlPrintS.esc(row.executionDate)}</td>
          <td class="cell-sub">${this.htmlPrintS.esc(row.lastFollowUp)}</td>
        </tr>`,
          )
          .join("")}
      </tbody>
    </table>`,
      )
      .join("");
  }

  readonly metaLabel = computed(() => this.buildMetaLine());

  buildMetaLine(): string {
    const from = this.toDate(this.fromValue());
    const to = this.toDate(this.toValue());
    const parts: string[] = [];

    if (from || to) {
      const start = from ? from.toLocaleDateString("es-MX") : "inicio";
      const end = to ? to.toLocaleDateString("es-MX") : "hoy";
      parts.push(`Del ${start} al ${end}`);
    }
    parts.push(`${this.total()} tarea(s)`);
    return parts.join(" · ");
  }

}
