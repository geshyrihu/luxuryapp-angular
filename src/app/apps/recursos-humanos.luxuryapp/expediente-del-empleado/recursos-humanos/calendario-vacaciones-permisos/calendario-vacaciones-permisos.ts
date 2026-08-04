import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FullCalendarModule } from "@fullcalendar/angular";
import {
  CalendarOptions,
  DatesSetArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CalendarEventDTO } from "../interfaces/calendar-event.interface";
import { PermisoDetalleModal } from "./modal-permiso-detalle";
import { VacacionDetalleModal } from "./modal-vacacion-detalle";

interface HolidayCalendarEventDTO extends CalendarEventDTO {}
type CalendarEventKind = "vacation" | "permission" | "holiday" | "default";

@Component({
  selector: "app-calendario-vacaciones-permisos",
  templateUrl: "./calendario-vacaciones-permisos.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .calendar-shell {
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      border-radius: var(--ds-radius-xl);
      box-shadow: var(--ds-shadow-sm);
      overflow: hidden;
      width: 100%;
    }

    :host ::ng-deep .fc-theme-standard td,
    :host ::ng-deep .fc-theme-standard th {
      border-color: var(--surface-border);
    }

    :host ::ng-deep .fc-header-toolbar {
      padding: var(--ds-space-md);
      background: var(--surface-section);
      border-bottom: 1px solid var(--surface-border);
      margin-bottom: 0 !important;
    }

    :host ::ng-deep .fc-view-harness {
      overflow: hidden;
    }

    :host ::ng-deep .fc-col-header-cell {
      background: var(--surface-ground);
    }

    :host ::ng-deep .fc-col-header-cell-cushion {
      color: var(--primary-600);
      font-weight: 700;
      padding: var(--ds-space-sm) 0;
      text-decoration: none;
    }

    :host ::ng-deep .fc-daygrid-day-number {
      color: var(--text-color);
      font-weight: 600;
      padding: var(--ds-space-xs);
      text-decoration: none;
    }

    :host ::ng-deep .fc-day-today {
      background: var(--primary-50) !important;
    }

    :host ::ng-deep .fc-day-other {
      background: var(--surface-ground);
    }

    :host ::ng-deep .fc-daygrid-day-frame {
      min-height: 6rem;
    }

    :host ::ng-deep .fc-scroller,
    :host ::ng-deep .fc-scroller-liquid-absolute {
      overflow: hidden !important;
    }

    :host ::ng-deep .fc-event {
      border: none;
      border-radius: var(--ds-radius-md);
      box-shadow: var(--ds-shadow-xs);
      font-size: 0.75rem;
      font-weight: 600;
      margin: 0.125rem 0.25rem;
      overflow: hidden;
    }

    :host ::ng-deep .fc-event-main {
      padding: 0.25rem 0.5rem;
    }

    :host ::ng-deep .fc-event-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host ::ng-deep .fc-daygrid-more-link {
      color: var(--primary-600);
      font-weight: 700;
      text-decoration: none;
      margin: 0 0.25rem 0.25rem;
    }

    :host ::ng-deep .fc-event.event-vacation {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
      color: var(--primary-color-text);
    }

    :host ::ng-deep .fc-event.event-permission {
      background: linear-gradient(135deg, var(--orange-400), var(--orange-600));
      color: var(--primary-color-text);
    }

    :host ::ng-deep .fc-event.event-holiday {
      background: linear-gradient(135deg, var(--green-400), var(--green-600));
      color: var(--primary-color-text);
    }

    :host ::ng-deep .fc-event.event-default {
      background: linear-gradient(135deg, var(--surface-500), var(--surface-700));
      color: var(--primary-color-text);
    }

    @media screen and (max-width: 768px) {
      :host ::ng-deep .fc-header-toolbar {
        align-items: stretch !important;
        flex-direction: column !important;
        gap: var(--ds-space-sm);
        padding: var(--ds-space-sm);
      }

      :host ::ng-deep .fc-toolbar-chunk {
        display: flex;
        justify-content: center;
        width: 100%;
      }

      :host ::ng-deep .fc-toolbar-title {
        font-size: 1.25rem !important;
        text-align: center;
      }

      :host ::ng-deep .fc-button {
        font-size: 0.85rem !important;
        padding: 0.4rem 0.6rem !important;
      }
    }
  `],
  imports: [FullCalendarModule],
})
export class CalendarioVacacionesPermisos {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);

  private rawEvents = signal<CalendarEventDTO[]>([]);

  readonly calendarEvents = computed<EventInput[]>(() => {
    const events = this.rawEvents();
    console.log('🔷 calendarEvents computed - rawEvents:', events);
    const mapped = events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end || event.start,
      allDay: event.allDay,
      classNames: [`event-${this.getEventKind(event)}`],
      extendedProps: {
        eventKind: this.getEventKind(event),
      },
    }));
    console.log('🔷 calendarEvents mapped result:', mapped);
    return mapped;
  });

  readonly calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    height: "auto",
    contentHeight: "auto",
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    editable: false,
    selectable: false,
    dayMaxEvents: 2,
    displayEventTime: false,
    fixedWeekCount: false,
    stickyHeaderDates: false,
    locales: [esLocale],
    locale: "es",
    buttonText: {
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día",
    },
    datesSet: (dateInfo: DatesSetArg) => {
      const year = dateInfo.view.currentStart.getFullYear();
      const month = dateInfo.view.currentStart.getMonth() + 1;
      this.loadEvents(year, month);
    },
    eventClick: this.handleEventClick.bind(this),
  };

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.loadEvents();
    });
  }

  async loadEvents(
    year: number = new Date().getFullYear(),
    month?: number,
  ): Promise<void> {
    const customerId: string = this.customerIdS.customerId();
    console.log('🔶 loadEvents called - customerId:', customerId, 'year:', year, 'month:', month);
    if (!customerId) return;

    const eventsUrl = Endpoints.HR.VacationRequestApproval.calendarEvents(
      year,
      customerId,
      month,
    );
    const holidaysUrl = Endpoints.Settings.holidaysByYear(year);

    try {
      const [eventsData, holidaysData] = await Promise.all([
        this.apiResponseS.onGetItem<CalendarEventDTO[]>(eventsUrl),
        this.apiResponseS.onGetItem<HolidayCalendarEventDTO[]>(holidaysUrl),
      ]);

      console.log('🔶 API response - eventsData:', eventsData, 'holidaysData:', holidaysData);

      const transformedEvents = (eventsData || [])
        .map((event) => this.normalizeCalendarEvent(event))
        .filter((event): event is CalendarEventDTO => !!event);

      const transformedHolidays = (holidaysData || [])
        .map((holiday) => this.normalizeCalendarEvent(holiday))
        .filter((event): event is CalendarEventDTO => !!event);

      console.log('🔶 Transformed events:', transformedEvents, 'holidays:', transformedHolidays);

      const finalEvents = [...transformedEvents, ...transformedHolidays];
      console.log('🔶 Setting rawEvents to:', finalEvents);
      this.rawEvents.set(finalEvents);
    } catch (error) {
      console.error("Error loading calendar events:", error);
      this.rawEvents.set([]);
    }
  }

  private normalizeCalendarEvent(
    event: Partial<CalendarEventDTO> | null | undefined,
  ): CalendarEventDTO | null {
    if (!event?.title || !event.start) {
      return null;
    }

    const start = this.normalizeDateOnly(event.start);
    const end = this.normalizeDateOnly(event.end || event.start);

    return {
      id: event.id || `${event.title}-${start}`,
      title: event.title,
      start,
      end,
      backgroundColor: event.backgroundColor,
      allDay: event.allDay ?? true,
    };
  }

  private normalizeDateOnly(value: string): string {
    return value.split("T")[0];
  }

  private getEventKind(event: Pick<CalendarEventDTO, "title" | "backgroundColor">): CalendarEventKind {
    if (event.backgroundColor === "#4285F4") return "vacation";
    if (event.backgroundColor === "#FF9900") return "permission";
    if (event.backgroundColor === "#28a745") return "holiday";

    const normalizedTitle = event.title.trim().toLowerCase();
    if (normalizedTitle.includes("festivo")) return "holiday";
    return "default";
  }

  handleEventClick(arg: EventClickArg): void {
    const eventId = arg.event.id;
    const eventTitle = arg.event.title;
    const eventKind = arg.event.extendedProps["eventKind"] as CalendarEventKind | undefined;

    if (eventKind === "vacation") {
      this.dialogHandlerS.openDialog(
        VacacionDetalleModal,
        { id: eventId },
        `Detalle de Vacaciones: ${eventTitle}`,
        this.dialogHandlerS.sizeLg,
      );
      return;
    }

    if (eventKind === "permission") {
      this.dialogHandlerS.openDialog(
        PermisoDetalleModal,
        { id: eventId },
        `Detalle de Permiso: ${eventTitle}`,
        this.dialogHandlerS.sizeLg,
      );
      return;
    }

    alert(`Clic en evento: ${eventTitle} (ID: ${eventId})`);
  }
}
