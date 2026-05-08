import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { MultiSelectModule } from "primeng/multiselect";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { RangoCalendarioyyyymmdd } from "src/app/core/components/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { IFechasFiltro } from "src/app/core/interfaces/fechas-filtro.interface";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AgendaSupervisionForm } from "./agenda-supervision-form";
@Component({
  selector: "app-agenda-supervision",
  templateUrl: "./agenda-supervision.html",
  imports: [IonButtonDelete, IonButtonEdit, 
    CommonModule,
    FormsModule,
    TableModule,
    MultiSelectModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButton,
    ActionMenu,
    RangoCalendarioyyyymmdd,
  ],
})
export class AgendaSupervision implements OnInit {
  dateS = inject(DateService);
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  public aspRoleS = inject(AspRoleService);
  aspRole = EApplicationRole;
  rangoCalendarioService = inject(FiltroCalendarService);
  tableScrollHeightS = inject(TableScrollHeightService);
  rangeDates: Date[] = [];
  ref: DynamicDialogRef;
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  AspRole = EApplicationRole;
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
  depto: string = "SUPERVISIÃ³N DE OPERACIONES";
  nombre: string =
    this.authS.infoUserAuth.firstName + " " + this.authS.infoUserAuth.lastName;
  semana: string = this.fechaInicial + " a " + this.fechaFinal;

  ngOnInit(): void {
    this.onLoadUserSupervisor();

    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(`NombreCorto`)
      .then((response: any) => {
        this.cb_customers.set(
          response.map((selectList: any) => ({
            label: selectList.label,
          })),
        );
      });

    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.fechaInicial = resp.fechaInicio;
      this.fechaFinal = resp.fechaFinal;
      this.onLoadData();
    });
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `AgendaSupervision/list/${this.fechaInicial}/${this.fechaFinal}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onLoadUserSupervisor() {
    const urlApi = `getlistsupervision`;
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(urlApi)
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
      .onDelete(`AgendaSupervision/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }
}









