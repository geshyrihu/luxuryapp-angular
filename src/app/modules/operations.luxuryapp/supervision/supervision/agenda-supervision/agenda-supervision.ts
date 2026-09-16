import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxMultiSelect } from "@ui/adaptive/multi-select/multi-select";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { RangoCalendarioyyyymmdd } from "@ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { FechasFiltro } from "@core/interfaces/fechas-filtro.interface";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DateService } from "@core/services/date.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { FiltroCalendarService } from "@core/services/filtro-calendar.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { AgendaSupervisionForm } from "./agenda-supervision-form";

@Component({
  selector: "app-agenda-supervision",
  templateUrl: "./agenda-supervision.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ActionMenu,
    WebButtonIcon,
    LxTooltipDirective,
    PrimeNgCustomTableEmptyMessage,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    ApiDatePipe,
    FormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxMultiSelect,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
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
  tablePrimeNgRows: number = tablePrimeNgRows();
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
  applicationUserId = this.authS.applicationUserId;
  depto: string = "SUPERVISIóN DE OPERACIONES";
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
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: any) {
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

