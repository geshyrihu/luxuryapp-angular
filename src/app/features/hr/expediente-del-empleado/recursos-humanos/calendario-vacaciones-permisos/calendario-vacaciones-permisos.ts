import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { FullCalendarModule } from "@fullcalendar/angular";
import {
  CalendarOptions,
  DatesSetArg,
  EventClickArg,
} from "@fullcalendar/core";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CalendarEventDTO } from "../interfaces/calendar-event.interface";
import { PermisoDetalleModal } from "./modal-permiso-detalle";
import { VacacionDetalleModal } from "./modal-vacacion-detalle";

interface HolidayCalendarEventDTO {
  fecha: string;
}

@Component({
  selector: "app-calendario-vacaciones-permisos",
  templateUrl: "./calendario-vacaciones-permisos.html",
  imports: [FullCalendarModule],
})
export class CalendarioVacacionesPermisos implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);

  events = signal<CalendarEventDTO[]>([]);
  options!: CalendarOptions;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onInitCalendar();
    });
  }

  ngOnInit(): void {
    this.onInitCalendar();
  }

  onInitCalendar(): void {
    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin],
      height: "100%",
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
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
  }

  async loadEvents(
    year: number = new Date().getFullYear(),
    month?: number,
  ): Promise<void> {
    const customerId: string = this.customerIdS.customerId();
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

      const transformedEvents = (eventsData || []).map((event) => ({
        ...event,
        allDay: true,
        start: event.start.split("T")[0],
        end: event.end ? event.end.split("T")[0] : "",
      }));

      const transformedHolidays: CalendarEventDTO[] = (holidaysData || []).map(
        (holiday) => ({
          id: holiday.fecha,
          title: "Día festivo",
          start: holiday.fecha,
          end: holiday.fecha,
          allDay: true,
        }),
      );

      this.events.set([...transformedEvents, ...transformedHolidays]);
    } catch (error) {
      console.error("Error loading calendar events:", error);
      this.events.set([]);
    }
  }

  handleEventClick(arg: EventClickArg): void {
    const eventId = arg.event.id;
    const eventTitle = arg.event.title;
    const eventColor = arg.event.backgroundColor;

    if (eventColor === "#4285F4") {
      this.dialogHandlerS.openDialog(
        VacacionDetalleModal,
        { id: eventId },
        `Detalle de Vacaciones: ${eventTitle}`,
        this.dialogHandlerS.sizeLg,
      );
      return;
    }

    if (eventColor === "#FF9900") {
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
