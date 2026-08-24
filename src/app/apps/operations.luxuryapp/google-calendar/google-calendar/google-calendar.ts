import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, EventClickArg, EventInput } from "@fullcalendar/core";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { JuntaMensualSessionChecklistDialog } from "src/app/apps/direccion.luxuryapp/juntas-comite/juntas-mensuales-session/junta-mensual-session-checklist-dialog";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { GoogleCalendarDetail } from "./google-calendar-detail";
import { GoogleCalendarForm } from "./google-calendar-form";

interface IGoogleCalendarEventListItem {
  id: string;
  customerId: string;
  title: string;
  subjectType: number;
  subjectTypeName: string;
  modality: number;
  modalityName: string;
  startAt: string;
  endAt: string;
  location: string;
  guestCount: number;
  googleHtmlLink: string;
  googleMeetUrl: string;
  googleStatus: string;
  juntaMensualSessionId: string | null;
  hasAssemblyChecklist: boolean;
  isSynchronized: boolean;
  isRecurring: boolean;
  recurrenceSummary: string;
}

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";

@Component({
  selector: "app-google-calendar",
  templateUrl: "./google-calendar.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host ::ng-deep .fc-theme-standard td,
      :host ::ng-deep .fc-theme-standard th {
        border-color: var(--surface-border);
      }
      :host ::ng-deep .fc-header-toolbar {
        padding: 1rem;
        background: var(--surface-section);
        border-radius: 16px 16px 0 0;
        margin-bottom: 0 !important;
        border: 1px solid var(--surface-border);
        border-bottom: none;
      }
      :host ::ng-deep .fc-view-harness {
        border: 1px solid var(--surface-border);
        border-top: none;
        border-radius: 0 0 16px 16px;
        overflow: hidden;
      }
      :host ::ng-deep .fc-daygrid-day-number {
        font-weight: 600;
        color: var(--text-color);
        padding: 0.5rem;
      }
      :host ::ng-deep .fc-event {
        border-radius: 6px;
        border: none;
        padding: 3px 6px;
        font-size: 0.75rem;
        font-weight: 500;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        margin: 1px 4px;
      }
      :host ::ng-deep .fc-day-today {
        background: var(--primary-50) !important;
      }
      @media screen and (max-width: 768px) {
        :host ::ng-deep .fc-header-toolbar {
          flex-direction: column !important;
          gap: 0.75rem;
          align-items: stretch !important;
          padding: 1rem 0.5rem;
        }
        :host ::ng-deep .fc-toolbar-chunk {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        :host ::ng-deep .fc-toolbar-chunk:nth-child(2) {
          order: -1;
          margin-bottom: 0.5rem;
        }
        :host ::ng-deep .fc-toolbar-title {
          font-size: 1.25rem !important;
          text-align: center;
        }
        :host ::ng-deep .fc-button {
          padding: 0.4rem 0.6rem !important;
          font-size: 0.85rem !important;
        }
      }
    `,
  ],
  imports: [
    WebButtonLabel,
    WebButtonIcon,
    LxTooltipDirective,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    FullCalendarModule,
    TableModule,
    LxTag,
    PrimeNgCustomCaption,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
})
export class GoogleCalendar {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly dateS = inject(DateService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly aspRoleS = inject(AspRoleService);
  private readonly signalRService = inject(SignalRService);
  private readonly destroyRef = inject(DestroyRef);

  readonly dataSignal = signal<IGoogleCalendarEventListItem[]>([]);
  readonly loading = signal(false);
  readonly scrollHeight = inject(TableScrollHeightService).scrollHeight;
  readonly tablePrimeNgRows = tablePrimeNgRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly canCreate = this.aspRoleS.canAccessAnySignal([
    ApplicationRole.Administrador,
    ApplicationRole.Asistente,
    ApplicationRole.GerenteOperaciones,
    ApplicationRole.GerenteAtencion,
    ApplicationRole.SuperUsuario,
  ]);
  readonly canViewAllDetails = this.aspRoleS.canAccessAnySignal([
    ApplicationRole.SuperUsuario,
    ApplicationRole.Direccion,
    ApplicationRole.GerenteMantenimiento,
    ApplicationRole.SupervisionOperativa,
  ]);
  readonly calendarEvents = computed<EventInput[]>(() =>
    this.dataSignal().map((item) => {
      const canViewDetails = this.canViewItemDetails(item);
      return {
        id: item.id,
        title: item.title,
        start: this.parseBusinessDateTime(item.startAt),
        end: this.parseBusinessDateTime(item.endAt),
        allDay: false,
        backgroundColor: canViewDetails ? "#003d9b" : "#94a3b8",
        borderColor: canViewDetails ? "#003d9b" : "#94a3b8",
        textColor: "#FFFFFF",
        extendedProps: {
          item,
          canViewDetails,
          canManage: this.canManageItem(item),
        },
      };
    }),
  );
  readonly listData = computed(() => {
    if (this.canViewAllDetails()) {
      return this.dataSignal();
    }

    const customerId = this.customerIdS.customerId();
    return this.dataSignal().filter((item) => item.customerId === customerId);
  });
  readonly calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    locale: "es",
    locales: [esLocale],
    initialView: "dayGridMonth",
    height: 560,
    dayMaxEvents: 3,
    nowIndicator: true,
    editable: false,
    selectable: false,
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    buttonText: {
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Dia",
    },
    eventClick: this.onCalendarEventClick.bind(this),
  };

  readonly globalFilterFields = computed(() => {
    const data = this.listData();
    if (!data.length) return [];
    return globalFilterFields(data);
  });

  constructor() {
    this.signalRService.googleCalendarEventUpdate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        const currentCustomerId = this.customerIdS.customerId();
        if (!currentCustomerId) return;

        if (
          this.canViewAllDetails() ||
          payload.customerId === currentCustomerId
        ) {
          this.onLoadData();
        }
      });

    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    this.loading.set(true);
    this.apiResponseS
      .onGetList<IGoogleCalendarEventListItem[]>(
        Endpoints.GoogleCalendarEvents.listByCustomer(customerId),
      )
      .then((result) => {
        this.dataSignal.set(result || []);
      })
      .finally(() => this.loading.set(false));
  }

  onModalForm(id: string | null = null) {
    this.dialogHandlerS
      .openDialog(
        GoogleCalendarForm,
        {
          id,
          customerId: this.customerIdS.customerId(),
          events: this.dataSignal(),
        },
        id ? "Editar evento de comite" : "Nuevo evento de comite",
        this.dialogHandlerS.sizeFull,
      )
      .then(
        (
          result:
            | boolean
            | {
                refresh?: boolean;
                openAssemblyChecklist?: boolean;
                sessionId?: string;
              }
            | undefined,
        ) => {
          if (!result) return;

          this.onLoadData();

          if (
            typeof result === "object" &&
            result.openAssemblyChecklist &&
            result.sessionId
          ) {
            this.openAssemblyChecklistDialog(result.sessionId);
          }
        },
      );
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.GoogleCalendarEvents.delete(id))
      .then((result) => {
        if (!result) return;

        this.dataSignal.update((items) =>
          items.filter((item) => item.id !== id),
        );
      });
  }

  onCalendarEventClick(arg: EventClickArg) {
    const item = arg.event.extendedProps[
      "item"
    ] as IGoogleCalendarEventListItem;
    const canViewDetails = arg.event.extendedProps["canViewDetails"] as boolean;
    const canManage = arg.event.extendedProps["canManage"] as boolean;

    if (canManage) {
      this.onModalForm(item.id);
      return;
    }

    if (!canViewDetails) {
      return;
    }

    this.dialogHandlerS.openDialog(
      GoogleCalendarDetail,
      { item },
      item.title,
      this.dialogHandlerS.sizeMd,
    );
  }

  canManageItem(item: IGoogleCalendarEventListItem) {
    return (
      this.canCreate() &&
      (this.canViewAllDetails() ||
        item.customerId === this.customerIdS.customerId())
    );
  }

  canViewItemDetails(item: IGoogleCalendarEventListItem) {
    return (
      this.canViewAllDetails() ||
      item.customerId === this.customerIdS.customerId()
    );
  }

  canOpenAssemblyChecklist(item: IGoogleCalendarEventListItem) {
    return item.subjectType === 1 && !!item.juntaMensualSessionId;
  }

  onOpenAssemblyChecklist(item: IGoogleCalendarEventListItem) {
    if (!item.juntaMensualSessionId) {
      return;
    }

    this.openAssemblyChecklistDialog(item.juntaMensualSessionId);
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

  getDay(value: string | Date | null | undefined): string {
    const parsed = this.parseBusinessDateTime(value);
    return parsed ? `${parsed.getDate()}`.padStart(2, "0") : "--";
  }

  getMonth(value: string | Date | null | undefined): string {
    const parsed = this.parseBusinessDateTime(value);
    if (!parsed) return "---";
    const months = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];
    return months[parsed.getMonth()];
  }

  formatBusinessTime(value: string | Date | null | undefined): string {
    const parsed = this.parseBusinessDateTime(value);
    if (!parsed) return "";
    const hours = `${parsed.getHours()}`.padStart(2, "0");
    const minutes = `${parsed.getMinutes()}`.padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  getSubjectTypeClass(item: IGoogleCalendarEventListItem): string {
    // SubjectType values: 0: JCM, 1: Asamblea, 2: Junta Lujo, 3: Junta Interna
    switch (item.subjectType) {
      case 0:
        return "bg-blue-100 text-blue-800";
      case 1:
        return "bg-purple-100 text-purple-800";
      case 2:
        return "bg-orange-100 text-orange-800";
      case 3:
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  getStatusLabel(item: IGoogleCalendarEventListItem) {
    if (item.isSynchronized) {
      return "Sincronizado con Google";
    }

    const normalizedStatus = (item.googleStatus || "").trim().toLowerCase();
    if (
      normalizedStatus === "historicolocal" ||
      normalizedStatus === "historico local"
    ) {
      return "Solo local (historico)";
    }

    const startAt = this.parseBusinessDateTime(item.startAt);
    if (startAt && startAt.getTime() < Date.now()) {
      return "Solo local";
    }

    return "Pendiente de sincronizar";
  }

  getStatusSeverity(
    item: IGoogleCalendarEventListItem,
  ): "success" | "info" | "warn" | "secondary" {
    const label = this.getStatusLabel(item);
    if (label === "Sincronizado con Google") return "success";
    if (label === "Solo local (historico)") return "info";
    if (label === "Solo local") return "warn";
    return "secondary";
  }

  private openAssemblyChecklistDialog(sessionId: string) {
    this.dialogHandlerS
      .openDialog(
        JuntaMensualSessionChecklistDialog,
        { sessionId },
        "Checklist de asamblea",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {
        this.onLoadData();
      });
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
