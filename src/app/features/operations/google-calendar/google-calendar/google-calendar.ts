import { CommonModule } from "@angular/common";
import {
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
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import {
  WebButtonLabelDelete,
  WebButtonLabelEdit,
} from "src/app/core/components/buttons/web-label";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { JuntaMensualSessionChecklistDialog } from "src/app/features/operations/meetings/juntas-comite/juntas-mensuales-session/junta-mensual-session-checklist-dialog";
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

@Component({
  selector: "app-google-calendar",
  templateUrl: "./google-calendar.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    FullCalendarModule,
    TableModule,
    TagModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    ActionMenu,
    WebButtonLabel,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    IonItem,
    IonLabel,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
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
  readonly canCreate = this.aspRoleS.anyOf([
    EApplicationRole.Administrador,
    EApplicationRole.Asistente,
    EApplicationRole.GerenteOperaciones,
    EApplicationRole.GerenteAtencion,
    EApplicationRole.SuperUsuario,
  ]);
  readonly canViewAllDetails = this.aspRoleS.anyOf([
    EApplicationRole.SuperUsuario,
    EApplicationRole.Direccion,
    EApplicationRole.GerenteMantenimiento,
    EApplicationRole.SupervisionOperativa,
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
        `google-calendar-events/customer/${customerId}`,
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
        this.dialogHandlerS.sizeLg,
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
      .onDelete(`google-calendar-events/${id}`)
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
