import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Mesanio as MesAnio } from "@ui/web/mesanio/mesanio";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DateService } from "@core/services/date.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PeriodMonthService } from "@core/services/periodo-month.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { FiltroMinutasArea } from "../area-minutes-filter/filtro-minutas-area";
@Component({
  selector: "app-minutas-resumen",
  templateUrl: "./minutas-resumen.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, AppTable, AppSortableColumn, AppSorticon, MesAnio],
})
export class MinutasResumen implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  PeriodMonthService = inject(PeriodMonthService);
  dateS = inject(DateService);
  tableScrollHeightS = inject(TableScrollHeightService);
  ref: DynamicDialogRef;
  cb_customers = signal<any[]>([]);
  generalMinutasSignal = signal<any[]>([]);
  generalMinutasGrupoSignal = signal<any[]>([]);
  generalMinutasView = signal<boolean>(false);
  generalMinutasGrupoView = signal<boolean>(true);
  periodo = signal<string>("");
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.periodo.set(
      this.dateS.getNameMontYear(this.PeriodMonthService.fechaInicial),
    );

    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.nombreCorto)
      .then((response: any) => {
        this.cb_customers.set(
          response.map((selectList: any) => ({
            label: selectList.label,
          })),
        );
      });

    this.onLoadData(
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoInicio),
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoFin),
    );
  }

  onFiltrarPeriodo(periodo: string) {
    this.PeriodMonthService.setPeriodo(periodo);
    this.onLoadData(
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoInicio),
      this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoFin),
    );

    this.periodo.set(
      this.dateS.getNameMontYear(this.PeriodMonthService.fechaInicial),
    );
  }

  onLoadData(fehcaInicio: string, fechaFinal: string) {
    this.apiResponseS
      .onGetList(
        Endpoints.ResumenGeneral.minutasGeneralList(
          fehcaInicio,
          fechaFinal,
        ),
      )
      .then((result: any) => {
        this.generalMinutasSignal.set(result);
      });

    this.apiResponseS
      .onGetList(
        Endpoints.ResumenGeneral.minutasGeneralGroup(
          fehcaInicio,
          fechaFinal,
        ),
      )
      .then((result: any) => {
        this.generalMinutasGrupoSignal.set(result);
      });
  }
  onModalFiltroMinutasArea(
    meetingId: any,
    area: number,
    titleEstatus: string,
    estatus: number,
    customerName: string,
  ) {
    this.dialogHandlerS.openDialog(
      FiltroMinutasArea,
      {
        meetingId: meetingId,
        area: area,
        titleEstatus: titleEstatus,
        estatus: estatus,
        customerName: customerName,
      },
      "",
      this.dialogHandlerS.sizeFull,
    );
  }
}
