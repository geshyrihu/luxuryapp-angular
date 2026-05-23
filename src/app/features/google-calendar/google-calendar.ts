import { CommonModule, DatePipe } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions, EventClickArg, EventInput } from "@fullcalendar/core";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import {
  IonButtonDelete,
  IonButtonEdit,
} from "src/app/core/components/buttons/mobile";
import {
  CustomButtonDelete,
  CustomButtonEdit,
} from "src/app/core/components/buttons/web";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
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
  isSynchronized: boolean;
  isRecurring: boolean;
  recurrenceSummary: string;
}

@Component({
  selector: "app-google-calendar",
  templateUrl: "./google-calendar.html",
  imports: [
    CommonModule,
    FullCalendarModule,
    TableModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    IonItem,
    IonLabel,
    IonButtonEdit,
    IonButtonDelete,
    DatePipe,
  ],
})
export class GoogleCalendar {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly aspRoleS = inject(AspRoleService);

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
        start: item.startAt,
        end: item.endAt,
        allDay: false,
        backgroundColor: canViewDetails ? "#163B74" : "#64748B",
        borderColor: canViewDetails ? "#163B74" : "#64748B",
        textColor: "#FFFFFF",
        extendedProps: {
          item,
          canViewDetails,
          canManage: this.canManageItem(item),
        },
      };
    }),
  );
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
    const data = this.dataSignal();
    if (!data.length) return [];
    return globalFilterFields(data);
  });

  constructor() {
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
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
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
}
