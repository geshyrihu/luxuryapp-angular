import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router, RouterModule } from "@angular/router";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web/label/button-delete";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { JuntaMensualSessionChecklistDialog } from "./junta-mensual-session-checklist-dialog";
import { JuntaMensualSessionRescheduleForm } from "./junta-mensual-session-reschedule-form";

interface IJuntaMensualSessionListItem {
  id: string;
  customerId: string;
  customerName: string;
  customerShortName: string;
  sessionTitle: string;
  sessionType: number;
  sessionTypeDisplayName: string;
  googleCalendarEventEntityId: string | null;
  googleCalendarEventId: string;
  presentacionJuntaComiteId: string | null;
  meetingId: string | null;
  scheduledAt: string;
  scheduledEndAt: string;
  modality: number;
  location: string;
  googleMeetUrl: string;
  status: number;
  statusDisplayName: string;
  hasPresentation: boolean;
  hasMeeting: boolean;
  closedAt: string | null;
  cancelledAt: string | null;
}

interface IJuntaMensualSessionDetail extends IJuntaMensualSessionListItem {
  canViewAllDetails: boolean;
  createdByUserId: string;
  cancelReason: string;
  agenda: {
    googleCalendarEventEntityId: string;
    googleCalendarEventId: string;
    title: string;
    description: string;
    googleHtmlLink: string;
    googleMeetUrl: string;
    googleStatus: string;
    startAt: string;
    endAt: string;
    recurrenceSeriesId: string | null;
    recurrenceRule: string;
  } | null;
  assembly: {
    asambleaPlanId: string;
    copyLegal: boolean;
    requiresPaddles: boolean;
    paddlesQuantity: number | null;
    requiresAudioVisual: boolean;
    audioVisualNotes: string;
    operationalNotes: string;
    specialInstructions: string;
    inviteesCount: number;
    supportRequestsCount: number;
    checklistItemsCount: number;
    checklistPendingCount: number;
    checklist: Array<{
      id: string;
      templateCode: string;
      title: string;
      category: string;
      dueDate: string;
      responsibleRole: string;
      status: number;
      statusDisplayName: string;
    }>;
  } | null;
  presentation: {
    id: string;
    fechaCorrespondiente: string;
    fechaJunta: string | null;
    enviadoTesorero: boolean;
    enviadoComite: boolean;
    enviadoCondominos: boolean;
    hasCoverFile: boolean;
    hasAccountingFile: boolean;
    hasOperationsFile: boolean;
    hasFinalFile: boolean;
  } | null;
  meeting: {
    id: string;
    date: string;
    eTypeMeeting: number;
    meetingTypeDisplayName: string;
    hasPresentationLinked: boolean;
  } | null;
}

@Component({
  selector: "app-juntas-mensuales-session",
  templateUrl: "./juntas-mensuales-session.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    RouterModule,
    TableModule,
    CardModule,
    TagModule,
    WebButtonLabel,
    WebButtonLabelDelete,
    DatePipe,
  ],
})
export class JuntasMensualesSession {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly aspRoleS = inject(AspRoleService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly dateS = inject(DateService);
  private readonly router = inject(Router);
  private readonly signalRService = inject(SignalRService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly items = signal<IJuntaMensualSessionListItem[]>([]);
  readonly selectedId = signal<string | null>(null);
  readonly selectedDetail = signal<IJuntaMensualSessionDetail | null>(null);
  readonly canViewAllCustomers = this.aspRoleS.anyOf([
    EApplicationRole.SuperUsuario,
    EApplicationRole.Direccion,
    EApplicationRole.GerenteMantenimiento,
    EApplicationRole.SupervisionOperativa,
  ]);
  readonly selectedSummary = computed(
    () => this.items().find((item) => item.id === this.selectedId()) ?? null,
  );

  constructor() {
    this.signalRService.googleCalendarEventUpdate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        const customerId = this.customerIdS.customerId();
        if (
          this.canViewAllCustomers() ||
          (customerId && payload.customerId === customerId)
        ) {
          this.onLoadData();
        }
      });

    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId || this.canViewAllCustomers()) {
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId && !this.canViewAllCustomers()) return;

    const url = this.canViewAllCustomers()
      ? "JuntaMensualSession"
      : `JuntaMensualSession?customerId=${customerId}`;

    this.loading.set(true);
    this.apiResponseS
      .onGetList<IJuntaMensualSessionListItem[]>(url)
      .then((result) => {
        const items = result || [];
        this.items.set(items);

        const currentSelectedId = this.selectedId();
        const stillExists = items.some((item) => item.id === currentSelectedId);
        const nextId = stillExists ? currentSelectedId : (items[0]?.id ?? null);
        this.selectedId.set(nextId);

        if (nextId) {
          this.onLoadDetail(nextId);
        } else {
          this.selectedDetail.set(null);
        }
      })
      .finally(() => this.loading.set(false));
  }

  onLoadDetail(id: string) {
    this.selectedId.set(id);
    this.detailLoading.set(true);
    this.apiResponseS
      .onGetItem<IJuntaMensualSessionDetail>(`JuntaMensualSession/${id}/detail`)
      .then((result) => {
        this.selectedDetail.set(result || null);
      })
      .finally(() => this.detailLoading.set(false));
  }

  onOpenAgenda() {
    this.router.navigateByUrl("/calendars/google-calendar");
  }

  onOpenPresentations() {
    if (
      this.aspRoleS.hasRole(EApplicationRole.Contador) &&
      !this.aspRoleS.hasAny([
        EApplicationRole.SuperUsuario,
        EApplicationRole.Administrador,
        EApplicationRole.GerenteOperaciones,
        EApplicationRole.GerenteAtencion,
        EApplicationRole.Asistente,
      ])
    ) {
      this.router.navigateByUrl("/committee-meetings/presentations-contador");
    } else {
      this.router.navigateByUrl("/committee-meetings/presentations");
    }
  }

  onOpenMinutes() {
    const detail = this.selectedDetail();
    if (detail?.meeting?.id) {
      this.router.navigate([
        "/committee-meetings/gestion-minuta",
        detail.meeting.id,
      ]);
      return;
    }

    this.router.navigateByUrl("/committee-meetings/minutes");
  }

  onCreateMeeting() {
    const detail = this.selectedDetail();
    if (!detail) return;

    this.apiResponseS
      .onPost<IJuntaMensualSessionListItem>(
        `JuntaMensualSession/${detail.id}/meeting/create`,
        {},
      )
      .then((result) => {
        if (!result) return;
        this.onLoadData();
        if (result.meetingId) {
          this.router.navigate([
            "/committee-meetings/gestion-minuta",
            result.meetingId,
          ]);
        }
      });
  }

  onCancel() {
    const detail = this.selectedDetail();
    if (!detail) return;

    this.apiResponseS
      .onPost<IJuntaMensualSessionListItem>(
        `JuntaMensualSession/${detail.id}/cancel`,
        {
          reason:
            "Sesion cancelada desde el modulo central de juntas mensuales.",
        },
      )
      .then((result) => {
        if (!result) return;
        this.onLoadData();
      });
  }

  onOpenReschedule() {
    const detail = this.selectedDetail();
    if (!detail) return;

    this.dialogHandlerS
      .openDialog(
        JuntaMensualSessionRescheduleForm,
        { detail },
        "Reprogramar sesion",
        this.dialogHandlerS.sizeMd,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onOpenAssemblyChecklist() {
    const detail = this.selectedDetail();
    if (!detail?.assembly) return;

    this.dialogHandlerS
      .openDialog(
        JuntaMensualSessionChecklistDialog,
        { sessionId: detail.id },
        "Checklist de asamblea",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadDetail(detail.id);
        }
      });
  }

  canCreateMeeting(detail: IJuntaMensualSessionDetail | null) {
    return (
      !!detail && !detail.meetingId && detail.statusDisplayName !== "Cancelled"
    );
  }

  canCancel(detail: IJuntaMensualSessionDetail | null) {
    return !!detail && !detail.cancelledAt;
  }

  canReschedule(detail: IJuntaMensualSessionDetail | null) {
    return !!detail && !detail.cancelledAt;
  }

  hasAssemblyChecklist(detail: IJuntaMensualSessionDetail | null) {
    return !!detail?.assembly;
  }

  formatBusinessDateTime(value: string | Date | null | undefined) {
    const parsed = this.parseBusinessDateTime(value);
    if (!parsed) return "";

    const day = `${parsed.getDate()}`.padStart(2, "0");
    const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
    const year = parsed.getFullYear();
    const hours = `${parsed.getHours()}`.padStart(2, "0");
    const minutes = `${parsed.getMinutes()}`.padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  formatBusinessTime(value: string | Date | null | undefined) {
    const parsed = this.parseBusinessDateTime(value);
    if (!parsed) return "";

    const hours = `${parsed.getHours()}`.padStart(2, "0");
    const minutes = `${parsed.getMinutes()}`.padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  private parseBusinessDateTime(value: string | Date | null | undefined) {
    if (!value) return null;

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    const normalized = `${value}`.trim();
    const match = normalized.match(
      /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/,
    );

    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second ?? "0"),
      );
    }

    return this.dateS.parseDate(normalized) ?? null;
  }
}
