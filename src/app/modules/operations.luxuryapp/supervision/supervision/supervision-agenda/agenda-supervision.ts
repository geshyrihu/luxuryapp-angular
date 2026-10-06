import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { FechasFiltro } from "@core/interfaces/fechas-filtro.interface";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DateService } from "@core/services/date.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { FiltroCalendarService } from "@core/services/filtro-calendar.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { ButtonWeb } from "@ui/buttons/web";
import { ButtonMobile } from "@ui/buttons/mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { RangoCalendarioyyyymmdd } from "@ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { AgendaSupervisionForm } from "./agenda-supervision-form";

@Component({
  selector: "app-agenda-supervision",
  templateUrl: "./agenda-supervision.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ButtonWeb,
    ButtonMobile,
    ActionMenu,
    WebButtonIcon,
    LxTooltipDirective,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
    DataViewMobile,
    RangoCalendarioyyyymmdd,
  ],
})
export class AgendaSupervision implements OnInit {
  dateS = inject(DateService);
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  public aspRoleS = inject(AspRoleService);
  aspRole = ApplicationRole;
  rangoCalendarioService = inject(FiltroCalendarService);
  tableScrollHeightS = inject(TableScrollHeightService);
  rangeDates: Date[] = [];
  ref: DynamicDialogRef;
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  AspRole = ApplicationRole;
  cb_user = signal<any[]>([]);
  cb_customers = signal<any[]>([]);
  cb_estatus = signal<any[]>(["Concluido", "Pendiente"]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  fechaInicial: string = this.dateS.getDateFormat(
    this.rangoCalendarioService.fechaInicioDateFull,
  );
  fechaFinal: string = this.dateS.getDateFormat(
    this.rangoCalendarioService.fechaFinalDateFull,
  );
  confirmS = inject(ConfirmService);
  applicationUserId = this.authS.applicationUserId;
  depto: string = "SUPERVISIÓN DE OPERACIONES";
  nombre: string =
    this.authS.infoUserAuth.firstName + " " + this.authS.infoUserAuth.lastName;
  semana: string = this.fechaInicial + " a " + this.fechaFinal;

  ngOnInit(): void {
    this.onLoadUserSupervisor();

    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.nombreCorto)
      .then((response: any) => {
        this.cb_customers.set(
          response.map((selectList: any) => ({
            label: selectList.label,
          })),
        );
      });

    this.rangoCalendarioService.fechas$.subscribe((resp: FechasFiltro) => {
      this.fechaInicial = resp.fechaInicio;
      this.fechaFinal = resp.fechaFinal;
      this.onLoadData();
    });
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.AgendaSupervision.listByDateRange(
      this.fechaInicial,
      this.fechaFinal,
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onLoadUserSupervisor() {
    const urlApi = Endpoints.SelectItems.supervision;
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(urlApi)
      .then((result: any) => {
        this.cb_user.set(result);
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        AgendaSupervisionForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta supervisión?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.AgendaSupervision.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }
}
